# 📅 Integração Simples com Google Calendar (Link Público)

Esta é a forma **mais simples** de integrar: você apenas fornece o link público do seu calendário e o sistema importa automaticamente os eventos.

## 🎯 Como Funciona

1. Você compartilha seu Google Calendar como **público**
2. Obtém o link do feed iCal (formato: `https://calendar.google.com/calendar/ical/...`)
3. Cola o link no sistema
4. O sistema importa automaticamente os eventos periodicamente

## ✅ Vantagens

- ✅ **Zero configuração OAuth** - não precisa de tokens, autorização complexa
- ✅ **Sem credenciais** - apenas um link público
- ✅ **Sincronização automática** - busca eventos a cada X minutos
- ✅ **Fácil de configurar** - copiar e colar o link

## 📋 Passo a Passo para Você

### 1. Compartilhar Calendário como Público

1. Abra [Google Calendar](https://calendar.google.com/)
2. No lado esquerro, clique nos **3 pontos** ao lado do seu calendário
3. Selecione **"Configurações e compartilhamento"**
4. Role até **"Acesso público"**
5. Marque **"Tornar disponível publicamente"**
6. Copie o link do **"Link público no formato iCal"**

O link será algo como:
```
https://calendar.google.com/calendar/ical/seu-email%40gmail.com/public/basic.ics
```

### 2. Adicionar Link no Sistema

No sistema, haverá um campo simples onde você cola esse link.

## 🔧 Implementação Técnica

### 1. Biblioteca para Parsear iCal

```bash
npm install node-ical
```

### 2. Serviço de Importação

Arquivo: `src/lib/google-calendar-simple.ts`

```typescript
import ical from 'node-ical';
import { PartnerActivity, NewPartnerActivity, ActivityType } from '@/types/crm';

/**
 * Importa eventos de um feed iCal público do Google Calendar
 */
export async function importFromICalFeed(
  icalUrl: string
): Promise<PartnerActivity[]> {
  try {
    // Buscar feed iCal
    const response = await fetch(icalUrl);
    const icalData = await response.text();
    
    // Parsear iCal
    const parsed = ical.parseICS(icalData);
    
    const activities: NewPartnerActivity[] = [];
    
    for (const key in parsed) {
      const event = parsed[key];
      
      // Apenas eventos (VEVENT)
      if (event.type === 'VEVENT') {
        const activity = convertICalEventToActivity(event);
        if (activity) {
          activities.push(activity);
        }
      }
    }
    
    return activities;
  } catch (error) {
    console.error('Error importing from iCal:', error);
    throw error;
  }
}

/**
 * Converte evento iCal para PartnerActivity
 */
function convertICalEventToActivity(event: any): NewPartnerActivity | null {
  if (!event.start || !event.summary) {
    return null; // Pula eventos sem data ou título
  }
  
  // Detectar tipo de atividade pelo título/descrição
  const title = event.summary || '';
  const description = event.description || '';
  const activityType = detectActivityType(title, description);
  
  return {
    partner_id: '', // Será preenchido depois ou pode ser genérico
    user_id: '', // Será preenchido na hora de salvar
    activity_type: activityType,
    status: getStatusFromEvent(event),
    title: title,
    scheduled_date: new Date(event.start),
    completed_date: event.completed ? new Date(event.completed) : undefined,
    what_discussed: description,
    participants: extractParticipants(event),
    notes: event.location || undefined,
  };
}

/**
 * Detecta tipo de atividade baseado no título/descrição
 */
function detectActivityType(title: string, description: string): ActivityType {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('reunião') || text.includes('meeting')) {
    return 'meeting';
  }
  if (text.includes('call') || text.includes('ligação')) {
    return 'call';
  }
  if (text.includes('email') || text.includes('e-mail')) {
    return 'email';
  }
  if (text.includes('tarefa') || text.includes('task')) {
    return 'task';
  }
  
  return 'note'; // Default
}

/**
 * Determina status da atividade
 */
function getStatusFromEvent(event: any): ActivityStatus {
  if (event.status === 'COMPLETED' || event.completed) {
    return 'completed';
  }
  if (event.status === 'CANCELLED') {
    return 'cancelled';
  }
  if (event.start && new Date(event.start) < new Date()) {
    return 'pending';
  }
  return 'scheduled';
}

/**
 * Extrai participantes do evento
 */
function extractParticipants(event: any): ActivityParticipant[] {
  const participants: ActivityParticipant[] = [];
  
  if (event.attendee) {
    const attendees = Array.isArray(event.attendee) 
      ? event.attendee 
      : [event.attendee];
    
    attendees.forEach((attendee: any) => {
      const email = attendee.params?.CN || attendee.val || '';
      if (email) {
        participants.push({
          name: email.split('@')[0] || email,
          email: email.includes('@') ? email : undefined,
        });
      }
    });
  }
  
  return participants;
}
```

### 3. Configuração no Banco de Dados

Adicionar tabela para armazenar configuração:

```sql
CREATE TABLE IF NOT EXISTS public.user_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.user_calendar_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own calendar sync"
  ON public.user_calendar_sync
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```

### 4. Componente de Configuração Simples

Arquivo: `src/components/settings/CalendarSyncSettings.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { saveCalendarSyncConfig, getCalendarSyncConfig, syncCalendarNow } from '@/lib/db';

export function CalendarSyncSettings() {
  const [calendarUrl, setCalendarUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await getCalendarSyncConfig();
      if (config) {
        setCalendarUrl(config.calendar_url);
        setEnabled(config.enabled);
        setLastSync(config.last_sync_at);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleSave = async () => {
    if (!calendarUrl) {
      toast.error('Por favor, informe o link do calendário');
      return;
    }

    // Validar URL
    if (!calendarUrl.startsWith('https://calendar.google.com/calendar/ical/')) {
      toast.error('Link inválido. Use o link público do Google Calendar.');
      return;
    }

    setIsLoading(true);
    try {
      await saveCalendarSyncConfig({
        calendar_url: calendarUrl,
        enabled,
      });
      toast.success('Configuração salva!');
    } catch (error) {
      toast.error('Erro ao salvar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setIsLoading(true);
    try {
      await syncCalendarNow();
      toast.success('Sincronização concluída!');
      setLastSync(new Date());
    } catch (error) {
      toast.error('Erro na sincronização');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronização com Google Calendar</CardTitle>
        <CardDescription>
          Importe eventos do seu Google Calendar usando o link público
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="calendarUrl">Link Público do Calendário (iCal)</Label>
          <Input
            id="calendarUrl"
            type="url"
            placeholder="https://calendar.google.com/calendar/ical/..."
            value={calendarUrl}
            onChange={(e) => setCalendarUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Obtenha este link nas configurações do Google Calendar → 
            "Tornar disponível publicamente" → "Link público no formato iCal"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Ativar Sincronização Automática</Label>
            <p className="text-xs text-muted-foreground">
              Sincroniza a cada 15 minutos quando ativado
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {lastSync && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isLoading}>
            Salvar Configuração
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSyncNow} 
            disabled={isLoading || !calendarUrl}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sincronizar Agora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Funções no db.ts

```typescript
// Salvar configuração
export async function saveCalendarSyncConfig(config: {
  calendar_url: string;
  enabled?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('user_calendar_sync')
    .upsert({
      user_id: user.id,
      calendar_url: config.calendar_url,
      enabled: config.enabled ?? true,
    }, { onConflict: 'user_id' });

  if (error) throw error;
}

// Buscar configuração
export async function getCalendarSyncConfig() {
  const { data: { user } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_calendar_sync')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Sincronizar agora
export async function syncCalendarNow() {
  const config = await getCalendarSyncConfig();
  if (!config || !config.enabled) {
    throw new Error('Calendar sync not configured or disabled');
  }

  const { importFromICalFeed } = await import('./google-calendar-simple');
  const activities = await importFromICalFeed(config.calendar_url);

  // Salvar atividades
  for (const activity of activities) {
    await savePartnerActivity(activity);
  }

  // Atualizar last_sync_at
  await supabase
    .from('user_calendar_sync')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('user_id', config.user_id);
}
```

### 6. Sincronização Automática (opcional)

Criar um endpoint ou job que roda periodicamente:

```typescript
// src/lib/sync-calendar-job.ts
export async function runCalendarSyncJob() {
  const { data: configs } = await supabase
    .from('user_calendar_sync')
    .select('*')
    .eq('enabled', true);

  if (!configs) return;

  for (const config of configs) {
    const lastSync = config.last_sync_at 
      ? new Date(config.last_sync_at) 
      : new Date(0);
    
    const minutesSinceLastSync = (Date.now() - lastSync.getTime()) / 60000;
    
    if (minutesSinceLastSync >= (config.sync_interval_minutes || 15)) {
      try {
        await syncCalendarNow();
      } catch (error) {
        console.error(`Error syncing for user ${config.user_id}:`, error);
      }
    }
  }
}
```

## 🚀 Vantagens desta Abordagem

1. **Simplicidade extrema**: apenas colar um link
2. **Sem OAuth**: não precisa de autenticação complexa
3. **Funciona imediatamente**: sem configuração de credenciais
4. **Leitura apenas**: importa eventos, não cria (mais seguro)

## ⚠️ Limitações

- ✅ **Apenas leitura**: não cria eventos no Google Calendar (apenas importa)
- ✅ **Calendário público**: precisa ser público (ou compartilhado com link)
- ✅ **Sem atualizações em tempo real**: sincroniza periodicamente (ex: a cada 15 min)

---

**Esta é a forma mais simples! Posso implementar agora mesmo se quiser.** 🚀

