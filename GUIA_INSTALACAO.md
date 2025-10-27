# 🚀 Guia de Instalação - PayManager

## ⚠️ Situação Atual

O projeto **precisa** que você tenha o **Node.js** instalado no seu sistema Windows para funcionar.

**Status atual:** Node.js não detectado no PATH do sistema.

---

## 📦 Opção 1: Instalar Node.js (Recomendado)

### Passo 1: Baixar o Node.js

1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS (Long Term Support)** recomendada
3. Atualmente é a versão **20.x** ou superior

### Passo 2: Instalar

1. Execute o instalador baixado
2. **Importante:** Marque a opção "Add to PATH" durante a instalação
3. Clique em "Next" até concluir

### Passo 3: Verificar Instalação

Abra um **novo terminal** (PowerShell ou CMD) e execute:

```powershell
node --version
npm --version
```

Você deve ver as versões instaladas.

---

## 🔄 Opção 2: Usar NVM (Node Version Manager)

Se você quiser gerenciar múltiplas versões do Node.js:

### Windows: nvm-windows

1. Baixe: https://github.com/coreybutler/nvm-windows/releases
2. Instale o arquivo `.exe`
3. Feche e reabra o terminal

```powershell
# Instalar Node.js LTS
nvm install lts

# Usar a versão instalada
nvm use lts

# Verificar
node --version
```

---

## ⚙️ Após Instalar Node.js

### 1. Navegue até a pasta do projeto

```powershell
cd "C:\Users\Thiago Rotondo\Documents\GitHub\partners-li"
```

### 2. Instale as dependências

```powershell
npm install
```

Isso vai instalar todas as 61+ dependências do projeto (pode demorar alguns minutos na primeira vez).

### 3. Inicie o servidor de desenvolvimento

```powershell
npm run dev
```

### 4. Acesse a aplicação

O Vite vai iniciar e você verá algo como:

```
  VITE v5.4.19  ready in 1500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.x.x:8080/
  ➜  press h + enter to show help
```

**Abra seu navegador em:** http://localhost:8080

---

## 🎯 Scripts Disponíveis

Após instalar, você pode usar:

```powershell
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Build desenvolvimento (não minificado)
npm run build:dev

# Preview da build
npm run preview

# Lint do código
npm run lint
```

---

## 🔍 Verificação de Instalação Completa

Execute estes comandos para verificar se tudo está OK:

```powershell
# 1. Verificar Node.js
node --version
# Deve mostrar: v20.x.x ou superior

# 2. Verificar npm
npm --version
# Deve mostrar: 10.x.x ou superior

# 3. Verificar se node_modules existe
Test-Path node_modules
# Deve retornar: True

# 4. Verificar se o build funciona
npm run build
# Deve compilar sem erros
```

---

## ❌ Problemas Comuns

### 1. "npm não é reconhecido"

**Solução:** Feche e reabra o terminal após instalar Node.js

### 2. "Cannot find module"

**Solução:** 
```powershell
rm -rf node_modules
npm install
```

### 3. "Port 8080 already in use"

**Solução:** Altere a porta no arquivo `vite.config.ts`:
```typescript
server: {
  port: 3000, // ou outra porta
}
```

### 4. Erro de permissão

**Solução Windows:** Execute o terminal como Administrador

---

## 📱 Alternativa: Usar Online

Se não quiser instalar localmente agora:

1. Acesse: https://lovable.dev/projects/55ca9dd2-05ae-47d1-a86c-6506f6a6825c
2. Use o editor online do Lovable
3. Publique direto pela plataforma

---

## ✅ Checklist de Instalação

- [ ] Node.js instalado (versão 18.x ou superior)
- [ ] npm disponível no terminal
- [ ] Pasta do projeto acessível
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Navegador abre em http://localhost:8080
- [ ] Aplicação carrega corretamente

---

**Última atualização:** Janeiro 2025

