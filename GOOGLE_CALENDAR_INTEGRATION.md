# 📅 Integração com Google Calendar

Este documento explica como integrar o Pipeline/Calendário com o Google Calendar para sincronização bidirecional de eventos.

## ✅ Sim, é possível!

A integração com Google Calendar é totalmente viável e oferece vários benefícios:

### Benefícios:
- ✅ **Sincronização bidirecional**: Atividades do pipeline aparecem no Google Calendar e vice-versa
- ✅ **Acesso unificado**: Veja todas as atividades em um só lugar (Google Calendar ou Pipeline)
- ✅ **Notificações do Google**: Use as notificações nativas do Google Calendar
- ✅ **Compartilhamento**: Compartilhe calendários com sua equipe
- ✅ **Integração com apps**: Funciona com qualquer app que use Google Calendar

## 🏗️ Arquitetura da Integração

### 1. Autenticação OAuth 2.0

```
Usuário → Clica "Conectar Google Calendar" 
→ Redireciona para Google OAuth
→ Usuário autoriza
→ Recebe Access Token + Refresh Token
→ Salva tokens no Supabase (tabela user_google_tokens)
```

### 2. Sincronização

#### Importar do Google Calendar → Pipeline:
- Buscar eventos do Google Calendar
- Converter `Google Calendar Event` → `PartnerActivity`
- Salvar no Supabase
- Criar eventos para parceiros baseado em títulos/descrições

#### Exportar do Pipeline → Google Calendar:
- Quando criar/atualizar atividade no Pipeline
- Criar/atualizar evento no Google Calendar
- Armazenar `google_event_id` na atividade

### 3. Sincronização em Tempo Real (Opcional)

Usando Google Calendar Push Notifications (webhooks):
- Google notifica quando eventos mudam
- Sistema atualiza automaticamente

## 📋 Estrutura de Dados Necessária

### Tabela no Supabase: `user_google_calendar_tokens`

```sql
CREATE TABLE IF NOT EXISTS public.user_google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT DEFAULT 'primary', -- ID do calendário do Google
  enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
```

### Adicionar campo na tabela `partner_activities`:

```sql
ALTER TABLE public.partner_activities
ADD COLUMN IF NOT EXISTS google_event_id TEXT,
ADD COLUMN IF NOT EXISTS google_calendar_synced BOOLEAN DEFAULT false;
```

## 🔧 Implementação Passo a Passo

### Passo 1: Configurar Google Cloud Project

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative a **Google Calendar API**
4. Configure **OAuth Consent Screen**:
   - Tipo: Externo
   - Informações do app
   - Scopes necessários:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
5. Crie **OAuth 2.0 Credentials**:
   - Tipo: Web application
   - Adicione URLs de redirect:
     - `http://localhost:8080/auth/google/callback` (dev)
     - `https://seu-dominio.com/auth/google/callback` (prod)
   - Anote: **Client ID** e **Client Secret**

### Passo 2: Instalar Dependências

```bash
npm install googleapis google-auth-library
```

### Passo 3: Criar Serviço de Integração

Arquivo: `src/lib/google-calendar.ts`

```typescript
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Configuração
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:8080/auth/google/callback';

// Criar OAuth2 client
export function createOAuth2Client() {
  return new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// Gerar URL de autorização
export function getAuthUrl(): string {
  const oauth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Força refresh token na primeira vez
  });
}

// Trocar código por tokens
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Criar cliente autenticado
export async function getAuthenticatedClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Sincronizar atividade para Google Calendar
export async function syncActivityToGoogle(
  activity: PartnerActivity,
  accessToken: string,
  refreshToken?: string
) {
  const calendar = await getAuthenticatedClient(accessToken, refreshToken);
  
  const event = {
    summary: activity.title,
    description: activity.what_discussed || '',
    start: {
      dateTime: activity.scheduled_date?.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: activity.scheduled_date 
        ? new Date(new Date(activity.scheduled_date).getTime() + 60 * 60 * 1000).toISOString() // +1 hora
        : undefined,
      timeZone: 'America/Sao_Paulo',
    },
  };

  if (activity.google_event_id) {
    // Atualizar evento existente
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: activity.google_event_id,
      requestBody: event,
    });
    return response.data.id;
  } else {
    // Criar novo evento
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return response.data.id;
  }
}

// Buscar eventos do Google Calendar
export async function fetchGoogleCalendarEvents(
  accessToken: string,
  refreshToken: string,
  timeMin?: Date,
  timeMax?: Date
) {
  const calendar = await getAuthenticatedClient(accessToken, refreshToken);
  
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin?.toISOString(),
    timeMax: timeMax?.toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}
```

### Passo 4: Criar Componente de Configuração

Arquivo: `src/components/settings/GoogleCalendarIntegration.tsx`

```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getAuthUrl } from '@/lib/google-calendar';
import { toast } from 'sonner';

export function GoogleCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    // Verificar se usuário tem tokens salvos
    // setIsConnected(hasTokens);
  };

  const handleConnect = () => {
    const authUrl = getAuthUrl();
    window.location.href = authUrl;
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // Sincronizar atividades
      toast.success('Sincronização concluída!');
    } catch (error) {
      toast.error('Erro na sincronização');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {isConnected ? 'Conectado' : 'Não conectado'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isConnected 
                ? 'Seu calendário está sincronizado'
                : 'Conecte seu Google Calendar para sincronizar eventos'}
            </p>
          </div>
          {isConnected ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {isConnected ? (
          <div className="flex gap-2">
            <Button onClick={handleSync} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Sincronizar Agora
            </Button>
            <Button variant="outline" onClick={() => {/* Desconectar */}}>
              Desconectar
            </Button>
          </div>
        ) : (
          <Button onClick={handleConnect}>
            Conectar Google Calendar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

### Passo 5: Página de Callback OAuth

Arquivo: `src/pages/GoogleCallback.tsx`

```typescript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTokensFromCode } from '@/lib/google-calendar';
import { saveGoogleTokens } from '@/lib/db';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      handleCallback(code);
    }
  }, [code]);

  const handleCallback = async (code: string) => {
    try {
      const tokens = await getTokensFromCode(code);
      await saveGoogleTokens(tokens);
      navigate('/settings?connected=true');
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      navigate('/settings?error=connection_failed');
    }
  };

  return <div>Conectando Google Calendar...</div>;
}
```

### Passo 6: Sincronização Automática

Atualizar `savePartnerActivity` em `src/lib/db.ts`:

```typescript
export async function savePartnerActivity(activity: NewPartnerActivity & { id?: string }) {
  // ... código existente ...
  
  // Se usuário tem Google Calendar conectado, sincronizar
  const tokens = await getUserGoogleTokens();
  if (tokens && tokens.enabled) {
    try {
      const googleEventId = await syncActivityToGoogle(
        savedActivity,
        tokens.access_token,
        tokens.refresh_token
      );
      
      // Atualizar atividade com google_event_id
      await supabase
        .from('partner_activities')
        .update({ 
          google_event_id: googleEventId,
          google_calendar_synced: true 
        })
        .eq('id', savedActivity.id);
    } catch (error) {
      console.error('Error syncing to Google Calendar:', error);
      // Não falha a operação, apenas loga o erro
    }
  }
  
  return savedActivity;
}
```

## 🎯 Funcionalidades

### Sincronização Automática
- ✅ Criar atividade → Cria evento no Google Calendar
- ✅ Atualizar atividade → Atualiza evento no Google Calendar
- ✅ Excluir atividade → Remove evento do Google Calendar
- ✅ Criar evento no Google Calendar → Importa como atividade

### Sincronização Manual
- Botão "Sincronizar Agora" na página de configurações
- Sincroniza todos os eventos do período selecionado

### Mapeamento de Dados

| PartnerActivity | Google Calendar Event |
|----------------|----------------------|
| `title` | `summary` |
| `what_discussed` | `description` |
| `scheduled_date` | `start.dateTime` |
| `activity_type` | `colorId` (mapeamento de cores) |
| `partner.name` | Adicionado no `description` |

## 🔒 Segurança

- ✅ Tokens armazenados criptografados no Supabase
- ✅ RLS (Row Level Security) para isolar dados por usuário
- ✅ Refresh tokens para renovação automática
- ✅ Validação de expiração de tokens

## 📝 Variáveis de Ambiente

Adicionar ao `.env`:

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=seu-client-secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback
```

## 🚀 Próximos Passos

1. **Decidir escopo**: Sincronização manual ou automática?
2. **Configurar Google Cloud**: Criar projeto e credenciais
3. **Implementar migrações**: Criar tabelas no Supabase
4. **Desenvolver integração**: Seguir passos acima
5. **Testar**: Validar sincronização bidirecional

---

**Posso implementar esta integração completa se você quiser!** 🚀

Diga se prefere:
- ✅ Implementação completa agora
- 📋 Apenas as migrações SQL primeiro
- 🔍 Mais detalhes sobre alguma parte específica

