# 🚀 Prompt para Atualizar Supabase com OAuth

## Instruções para Lovable/Supabase

Atualize a migração `20251102160000_add_calendar_sync.sql` no Supabase com os seguintes campos OAuth:

### SQL a aplicar:

```sql
-- Atualizar tabela existente para suportar OAuth
ALTER TABLE public.user_calendar_sync
  DROP CONSTRAINT IF EXISTS user_calendar_sync_calendar_url_not_null; -- Remover constraint se existir

ALTER TABLE public.user_calendar_sync
  ALTER COLUMN calendar_url DROP NOT NULL, -- Tornar opcional (não usado no OAuth)
  ADD COLUMN IF NOT EXISTS google_access_token TEXT,
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS google_calendar_id TEXT DEFAULT 'primary',
  ADD COLUMN IF NOT EXISTS connected_via_oauth BOOLEAN DEFAULT false;

-- Atualizar comentários
COMMENT ON COLUMN public.user_calendar_sync.calendar_url IS 'URL do feed iCal público (opcional, usado apenas como fallback)';
COMMENT ON COLUMN public.user_calendar_sync.google_access_token IS 'Token de acesso OAuth do Google Calendar API';
COMMENT ON COLUMN public.user_calendar_sync.google_refresh_token IS 'Token de refresh OAuth para renovar access_token';
COMMENT ON COLUMN public.user_calendar_sync.google_token_expires_at IS 'Data/hora de expiração do access_token';
COMMENT ON COLUMN public.user_calendar_sync.google_calendar_id IS 'ID do calendário Google (primary por padrão)';
COMMENT ON COLUMN public.user_calendar_sync.connected_via_oauth IS 'Se true, usa OAuth. Se false, usa iCal feed';
```

### Criar Edge Functions

#### 1. Função: `google-oauth-token`

**Caminho:** `supabase/functions/google-oauth-token/index.ts`

**Código:**
```typescript
// Supabase Edge Function: Trocar código OAuth por tokens
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, redirectUri } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Google OAuth credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || `${req.headers.get("origin")}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return new Response(
        JSON.stringify({ error: `Token exchange failed: ${error}` }),
        { status: tokenResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokens = await tokenResponse.json();

    return new Response(
      JSON.stringify(tokens),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

#### 2. Função: `google-oauth-refresh`

**Caminho:** `supabase/functions/google-oauth-refresh/index.ts`

**Código:**
```typescript
// Supabase Edge Function: Renovar access_token usando refresh_token
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return new Response(
        JSON.stringify({ error: "refreshToken is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Google OAuth credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return new Response(
        JSON.stringify({ error: `Token refresh failed: ${error}` }),
        { status: tokenResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokens = await tokenResponse.json();

    return new Response(
      JSON.stringify(tokens),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

### Configurar Secrets

Após criar as Edge Functions, configure os Secrets:

- `GOOGLE_CLIENT_ID` = (seu Client ID do Google Cloud)
- `GOOGLE_CLIENT_SECRET` = (seu Client Secret do Google Cloud)

---

**Aplique isso no Supabase e me avise quando estiver pronto!** ✅

