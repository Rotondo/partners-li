# 🔐 Configuração do Google OAuth para Calendar

## 📋 Passo a Passo Completo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione um projeto ou crie um novo
3. Vá em **"APIs & Services"** → **"Library"**
4. Procure e ative: **"Google Calendar API"**

### 2. Configurar OAuth Consent Screen

1. Vá em **"APIs & Services"** → **"OAuth consent screen"**
2. Escolha **"External"** (ou "Internal" se for Workspace)
3. Preencha:
   - **App name:** Partners LI (ou seu nome)
   - **User support email:** Seu email
   - **Developer contact:** Seu email
4. Clique em **"Save and Continue"**
5. Em **Scopes**, adicione:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events.readonly`
6. Clique em **"Save and Continue"**
7. Em **Test users**, adicione seu email (para testes)
8. Clique em **"Save and Continue"**

### 3. Criar Credenciais OAuth 2.0

1. Vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"Create Credentials"** → **"OAuth client ID"**
3. Selecione **"Web application"**
4. Configure:
   - **Name:** Partners LI Web Client
   - **Authorized JavaScript origins:**
     - `http://localhost:8080` (dev)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs:**
     - `http://localhost:8080/auth/google/callback` (dev)
     - `https://seu-dominio.com/auth/google/callback` (produção)
5. Clique em **"Create"**
6. **IMPORTANTE:** Copie o **Client ID** e **Client Secret**

### 4. Configurar Variáveis de Ambiente

Adicione ao seu `.env`:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=seu-client-secret

# Redirect URI (opcional, será inferido automaticamente)
VITE_GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback
```

### 5. Configurar Supabase Edge Functions

No Supabase Dashboard:

1. Vá em **"Edge Functions"**
2. Crie a função **"google-oauth-token"**:
   - Cole o código de `supabase/functions/google-oauth-token/index.ts`
3. Crie a função **"google-oauth-refresh"**:
   - Cole o código de `supabase/functions/google-oauth-refresh/index.ts`
4. Configure **Secrets** (variáveis de ambiente):
   - `GOOGLE_CLIENT_ID` = seu-client-id
   - `GOOGLE_CLIENT_SECRET` = seu-client-secret

**Como configurar Secrets:**
```bash
supabase secrets set GOOGLE_CLIENT_ID=seu-client-id
supabase secrets set GOOGLE_CLIENT_SECRET=seu-client-secret
```

OU via Dashboard:
- Edge Functions → Sua função → Settings → Secrets

### 6. Atualizar Migração SQL

Aplique a migração atualizada `20251102160000_add_calendar_sync.sql` no Supabase:
- Ela inclui os campos OAuth necessários

## ✅ Checklist

- [ ] Google Calendar API ativada
- [ ] OAuth Consent Screen configurado
- [ ] Credenciais OAuth criadas (Client ID e Secret)
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Edge Functions criadas no Supabase
- [ ] Secrets configurados no Supabase
- [ ] Migração SQL aplicada
- [ ] Redirect URIs configurados corretamente

## 🚀 Testar

1. Acesse `/admin` → aba "Calendário"
2. Clique em **"Conectar Google Calendar"**
3. Você será redirecionado para Google
4. Faça login e autorize
5. Volta automaticamente e está conectado!

## 🔧 Troubleshooting

**Erro: "redirect_uri_mismatch"**
- Verifique se o redirect URI no Google Cloud está exatamente igual
- Deve ser: `http://localhost:8080/auth/google/callback` (sem barra final)

**Erro: "invalid_client"**
- Verifique se Client ID e Secret estão corretos
- Verifique se estão configurados nas Edge Functions Secrets

**Token expira rápido**
- O refresh_token deve renovar automaticamente
- Se não funcionar, desconecte e reconecte

---

**Precisa de ajuda? Me avise!** 🚀

