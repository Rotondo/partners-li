# 🔧 Como Configurar o Arquivo .env

## ⚠️ Erro Atual
Se você está vendo: **"VITE_GOOGLE_CLIENT_ID não configurado"**, você precisa:

1. **Criar/editar o arquivo `.env`** na raiz do projeto
2. **Adicionar suas credenciais do Google OAuth**

## 📝 Passos Rápidos

### 1. Editar o arquivo `.env`

Abra o arquivo `.env` (na raiz do projeto) e adicione:

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
```

### 2. Obter o Client ID

Se você ainda não tem as credenciais:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Tipo: **Web application**
6. Configure:
   - **Name:** Partners LI
   - **Authorized redirect URIs:** 
     - `http://localhost:8080/auth/google/callback`
7. Clique em **Create**
8. **Copie o Client ID** e cole no `.env`

### 3. Reiniciar o servidor

Após configurar o `.env`, **reinicie o servidor de desenvolvimento**:

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

## ✅ Verificação

Após configurar, o arquivo `.env` deve ter pelo menos:

```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefgh.apps.googleusercontent.com
```

## 📚 Guia Completo

Para instruções completas sobre OAuth, veja: **`CONFIGURAR_GOOGLE_OAUTH.md`**

---

**Dica:** O arquivo `.env` não deve ser commitado no Git (já está no `.gitignore`)

