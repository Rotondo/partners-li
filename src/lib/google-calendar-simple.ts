import ICAL from 'ical.js';
import { format } from 'date-fns';
import { PartnerActivity, NewPartnerActivity, ActivityType, ActivityStatus } from '@/types/crm';

/**
 * Importa eventos de um feed iCal público do Google Calendar
 */
export async function importFromICalFeed(
  icalUrl: string
): Promise<NewPartnerActivity[]> {
  try {
    console.log('Fetching calendar from:', icalUrl);
    
    let icalData: string;
    
    // Tentar buscar diretamente primeiro
    try {
      const response = await fetch(icalUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/calendar',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      icalData = await response.text();
      console.log('Successfully fetched calendar directly');
    } catch (fetchError: any) {
      console.warn('Direct fetch failed:', fetchError.message);
      
      // Se falhar, tentar via Supabase Edge Function (resolve CORS)
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.functions.invoke('fetch-calendar', {
          body: { calendarUrl: icalUrl },
        });
        
        if (error) {
          throw new Error(`Erro ao buscar via proxy: ${error.message}`);
        }
        
        if (!data?.data) {
          throw new Error('Calendário retornou vazio');
        }
        
        icalData = data.data;
        console.log('Successfully fetched calendar via proxy');
      } catch (proxyError: any) {
        // Se proxy também falhar, dar erro claro
        console.error('Both direct and proxy fetch failed:', proxyError);
        
        if (fetchError.message.includes('CORS') || fetchError.message.includes('Failed to fetch')) {
          throw new Error('Erro de CORS ao acessar o calendário. O calendário precisa estar público e o link deve ser do formato iCal. Verifique também se o Supabase Edge Function está configurado.');
        }
        
        throw new Error(`Erro ao buscar calendário: ${fetchError.message || proxyError.message}`);
      }
    }
    
    if (!icalData || icalData.trim().length === 0) {
      throw new Error('O calendário retornou vazio. Verifique se o link está correto.');
    }
    
    console.log('Calendar data received, length:', icalData.length);
    
    // Parsear iCal usando ical.js
    let jcalData: any;
    try {
      jcalData = ICAL.parse(icalData);
    } catch (parseError) {
      console.error('Error parsing iCal:', parseError, 'Data preview:', icalData.substring(0, 500));
      throw new Error('Erro ao processar o formato iCal. Verifique se o link é do tipo correto (formato iCal).');
    }
    
    if (!jcalData || !Array.isArray(jcalData)) {
      throw new Error('Formato do calendário inválido');
    }
    
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent') || [];
    
    console.log('Found events:', vevents.length);
    
    const activities: NewPartnerActivity[] = [];
    
    for (const vevent of vevents) {
      try {
        const event = new ICAL.Event(vevent);
        const activity = convertICalEventToActivity(event);
        
        if (activity) {
          activities.push(activity);
        }
      } catch (eventError) {
        console.warn('Error processing event:', eventError);
        // Continua processando outros eventos
      }
    }
    
    console.log('Successfully converted activities:', activities.length);
    
    return activities;
  } catch (error: any) {
    console.error('Error importing from iCal:', error);
    
    // Mensagens de erro mais amigáveis
    if (error.message) {
      throw error;
    }
    
    throw new Error(`Erro ao importar calendário: ${error.message || 'Erro desconhecido'}`);
  }
}

/**
 * Converte evento iCal para PartnerActivity
 */
function convertICalEventToActivity(event: ICAL.Event): NewPartnerActivity | null {
  // Se não tem summary, pode ser apenas disponibilidade (ocupado/livre)
  // Neste caso, criar evento genérico
  const summary = event.summary || 'Evento do Calendário';
  const description = event.description || '';
  const startDate = event.startDate?.toJSDate();
  
  if (!startDate) {
    return null; // Pula eventos sem data
  }
  
  // Se não tem detalhes (apenas disponibilidade), usar título genérico
  const hasDetails = event.summary || event.description || event.location;
  const finalTitle = hasDetails ? summary : `Evento ${format(startDate, 'dd/MM/yyyy HH:mm')}`;
  
  // Detectar tipo de atividade pelo título/descrição
  const activityType = detectActivityType(summary, description);
  
  // Obter UID do evento para evitar duplicatas
  const googleEventId = event.uid || `${summary}-${startDate.getTime()}`;
  
  // Extrair participantes
  const participants = extractParticipants(event);
  
  // Determinar status
  const status = getStatusFromEvent(event);
  
  return {
    partner_id: '', // Será preenchido depois ou pode ser genérico
    user_id: '', // Será preenchido na hora de salvar
    activity_type: activityType,
    status: status,
    title: finalTitle,
    scheduled_date: startDate,
    completed_date: status === 'completed' ? startDate : undefined,
    what_discussed: hasDetails ? (description || undefined) : 'Evento sincronizado do calendário (apenas disponibilidade)',
    participants: participants,
    notes: event.location || undefined,
    // Campos customizados para tracking
    google_event_id: googleEventId,
  } as any; // Temporário - vamos adicionar ao tipo depois
}

/**
 * Detecta tipo de atividade baseado no título/descrição
 */
function detectActivityType(title: string, description: string): ActivityType {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('reunião') || text.includes('meeting') || text.includes('reunião')) {
    return 'meeting';
  }
  if (text.includes('call') || text.includes('ligação') || text.includes('chamada')) {
    return 'call';
  }
  if (text.includes('email') || text.includes('e-mail')) {
    return 'email';
  }
  if (text.includes('tarefa') || text.includes('task') || text.includes('todo')) {
    return 'task';
  }
  
  return 'note'; // Default
}

/**
 * Determina status da atividade
 */
function getStatusFromEvent(event: ICAL.Event): ActivityStatus {
  const status = event.status;
  const startDate = event.startDate?.toJSDate();
  const now = new Date();
  
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return status === 'COMPLETED' ? 'completed' : 'cancelled';
  }
  
  if (startDate && startDate < now) {
    return 'pending';
  }
  
  return 'scheduled';
}

/**
 * Extrai participantes do evento
 */
function extractParticipants(event: ICAL.Event): Array<{ name: string; email?: string; role?: string }> {
  const participants: Array<{ name: string; email?: string; role?: string }> = [];
  
  const attendees = event.component.getAllProperties('attendee');
  
  attendees.forEach((attendeeProp) => {
    const attendee = attendeeProp.getFirstValue();
    if (typeof attendee === 'string') {
      // Formato: mailto:email@example.com ou CN=Name:mailto:email@example.com
      const emailMatch = attendee.match(/mailto:([^\s]+)/);
      const email = emailMatch ? emailMatch[1] : attendee.includes('@') ? attendee : undefined;
      
      // Tentar extrair nome do CN parameter
      const cnParam = attendeeProp.getParameter('cn');
      const name = cnParam || (email ? email.split('@')[0] : 'Participante');
      
      participants.push({
        name: name,
        email: email,
      });
    }
  });
  
  return participants;
}

