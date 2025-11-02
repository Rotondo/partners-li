/**
 * Google Calendar OAuth Integration
 * Permite conexão segura via OAuth 2.0 sem expor calendário publicamente
 */

// Configuração OAuth (será configurada via variáveis de ambiente)
export function getGoogleOAuthConfig() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID não configurado. Configure no .env');
  }

  return {
    clientId,
    redirectUri,
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
    ],
  };
}

/**
 * Gera URL de autorização OAuth
 */
export function getGoogleAuthUrl(): string {
  const config = getGoogleOAuthConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope.join(' '),
    access_type: 'offline', // Necessário para obter refresh_token
    prompt: 'consent', // Força consent para garantir refresh_token
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Troca código OAuth por tokens (chamado no callback)
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}> {
  const config = getGoogleOAuthConfig();
  const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error('VITE_GOOGLE_CLIENT_SECRET não configurado. Configure no .env');
  }

  // Fazer troca via backend (Supabase Edge Function ou seu backend)
  // Por segurança, nunca exponha client_secret no frontend
  // Vamos criar uma Edge Function para isso
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase.functions.invoke('google-oauth-token', {
    body: {
      code,
      redirectUri: config.redirectUri,
    },
  });

  if (error) {
    throw new Error(`Erro ao trocar código por tokens: ${error.message}`);
  }

  return data;
}

/**
 * Renova access_token usando refresh_token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data, error } = await supabase.functions.invoke('google-oauth-refresh', {
    body: { refreshToken },
  });

  if (error) {
    throw new Error(`Erro ao renovar token: ${error.message}`);
  }

  return data;
}

/**
 * Busca eventos do Google Calendar usando API
 */
export async function fetchGoogleCalendarEvents(
  accessToken: string,
  calendarId: string = 'primary',
  timeMin?: Date,
  timeMax?: Date
): Promise<any[]> {
  const params = new URLSearchParams({
    calendarId,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });

  if (timeMin) {
    params.append('timeMin', timeMin.toISOString());
  }
  if (timeMax) {
    params.append('timeMax', timeMax.toISOString());
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token expirado. Por favor, reconecte seu calendário.');
    }
    throw new Error(`Erro ao buscar eventos: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Converte evento do Google Calendar API para PartnerActivity
 */
export function convertGoogleEventToActivity(
  googleEvent: any,
  userId: string
): any {
  const start = googleEvent.start?.dateTime || googleEvent.start?.date;
  const end = googleEvent.end?.dateTime || googleEvent.end?.date;

  if (!start) {
    return null; // Pula eventos sem data
  }

  const startDate = new Date(start);
  const activityType = detectActivityTypeFromEvent(googleEvent);
  const status = determineStatus(googleEvent, startDate);

  return {
    partner_id: '', // Será preenchido depois
    user_id: userId,
    activity_type: activityType,
    status: status,
    title: googleEvent.summary || 'Evento do Calendário',
    scheduled_date: startDate,
    completed_date: status === 'completed' ? new Date(end || start) : undefined,
    what_discussed: googleEvent.description || undefined,
    participants: extractParticipantsFromEvent(googleEvent),
    notes: googleEvent.location || undefined,
    google_event_id: googleEvent.id,
  };
}

function detectActivityTypeFromEvent(event: any): 'meeting' | 'call' | 'email' | 'task' | 'note' {
  const text = `${event.summary || ''} ${event.description || ''}`.toLowerCase();
  
  if (text.includes('meeting') || text.includes('reunião')) return 'meeting';
  if (text.includes('call') || text.includes('chamada')) return 'call';
  if (text.includes('email')) return 'email';
  if (text.includes('task') || text.includes('tarefa')) return 'task';
  
  return 'note';
}

function determineStatus(event: any, startDate: Date): 'scheduled' | 'completed' | 'cancelled' | 'pending' {
  if (event.status === 'cancelled') return 'cancelled';
  if (event.status === 'confirmed' && startDate < new Date()) return 'pending';
  return 'scheduled';
}

function extractParticipantsFromEvent(event: any): Array<{ name: string; email?: string; role?: string }> {
  if (!event.attendees) return [];
  
  return event.attendees.map((attendee: any) => ({
    name: attendee.displayName || attendee.email?.split('@')[0] || 'Participante',
    email: attendee.email,
    role: attendee.organizer ? 'organizador' : undefined,
  }));
}

