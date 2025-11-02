# 🔧 Troubleshooting: Calendário não está carregando

## Problemas Comuns e Soluções

### 1. Erro de CORS (Cross-Origin Resource Sharing)

**Sintoma:** Erro "Failed to fetch" ou "CORS policy"

**Solução:**
- O Google Calendar pode bloquear requisições diretas do navegador por CORS
- Opções:
  - **Opção A:** Usar um proxy CORS (ex: cors-anywhere)
  - **Opção B:** Criar endpoint backend que busca o iCal e retorna para o frontend
  - **Opção C:** Usar Google Calendar API com OAuth (mais complexo)

**Teste rápido:** Abra o link do calendário diretamente no navegador
- Se abrir e baixar um arquivo `.ics`, o link está correto
- Se der erro de CORS, precisa de proxy ou backend

### 2. Link do Calendário Incorreto

**Verificar:**
- O link deve começar com: `https://calendar.google.com/calendar/ical/`
- Deve terminar com: `/public/basic.ics` ou similar
- Não deve ser o link de visualização web (`?cid=...`)

**Link correto:**
```
https://calendar.google.com/calendar/ical/seu-email%40gmail.com/public/basic.ics
```

**Link errado:**
```
https://calendar.google.com/calendar/u/2?cid=...
```

### 3. Calendário Não Está Público

**Sintoma:** Erro 403 ou calendário vazio

**Solução:**
1. Google Calendar → Configurações do calendário
2. "Acesso público"
3. Marque **"Tornar disponível publicamente"**
4. OU marque **"Disponibilizar apenas informações de disponibilidade"**

### 4. Nenhum Evento Importado

**Verificar no console do navegador (F12):**
- Quantos eventos foram encontrados
- Se há erros de parsing
- Se todos os eventos foram pulados (já existem)

**Causas comuns:**
- Todos os eventos já foram importados anteriormente
- Calendário está vazio
- Eventos não têm título ou data válida

### 5. Problema com ical.js

**Verificar:**
```bash
npm list ical.js
```

Se não estiver instalado:
```bash
npm install ical.js
```

## Como Debugar

### 1. Abrir Console do Navegador
- Pressione F12
- Vá na aba "Console"
- Execute a sincronização
- Veja os logs detalhados

### 2. Testar o Link Diretamente
1. Copie o link iCal
2. Cole no navegador
3. Deve baixar um arquivo `.ics` ou mostrar texto iCal
4. Se der erro, o link está errado ou não está público

### 3. Verificar no Código

Adicione logs temporários em `src/lib/google-calendar-simple.ts`:

```typescript
console.log('Fetching:', icalUrl);
console.log('Response status:', response.status);
console.log('Data length:', icalData.length);
console.log('Events found:', vevents.length);
```

## Solução Rápida: Backend Proxy

Se CORS for o problema, podemos criar um endpoint backend no Supabase Edge Function que:
1. Recebe o link do calendário
2. Busca o iCal no servidor (sem CORS)
3. Retorna os eventos processados

**Quer que eu implemente essa solução?** 🤔

## Checklist de Verificação

- [ ] Link iCal está correto (formato correto)
- [ ] Calendário está público no Google Calendar
- [ ] Link abre diretamente no navegador
- [ ] Biblioteca `ical.js` está instalada
- [ ] Console do navegador mostra erros específicos
- [ ] Migração SQL foi aplicada no Supabase

---

**Envie:**
1. O erro exato que aparece (console do navegador)
2. Se o link abre no navegador
3. Quantos eventos aparecem nos logs

Assim consigo identificar o problema específico! 🔍

