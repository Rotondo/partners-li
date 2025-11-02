# 🔗 Como Obter o Link iCal Correto

## ❌ Link Errado (que você compartilhou)

```
https://calendar.google.com/calendar/embed?src=thiago.perosa%40lojaintegrada.com.br&ctz=America%2FSao_Paulo
```

Este é um link de **incorporação (embed)** para usar em iframes, não é um feed iCal!

## ✅ Link Correto (iCal Feed)

Baseado no seu email `thiago.perosa@lojaintegrada.com.br`, o link iCal correto seria:

```
https://calendar.google.com/calendar/ical/thiago.perosa%40lojaintegrada.com.br/public/basic.ics
```

**Diferença:**
- ❌ Embed: `calendar/embed?src=...`
- ✅ iCal: `calendar/ical/.../public/basic.ics`

## 📋 Como Obter o Link Correto no Google Calendar

### Método 1: Direto nas Configurações (Recomendado)

1. Abra [Google Calendar](https://calendar.google.com)
2. No lado **esquerdo**, encontre seu calendário na lista
3. Clique nos **3 pontos** (⋮) ao lado do nome do calendário
4. Clique em **"Configurações e compartilhamento"**
5. Role até a seção **"Integrar calendário"**
6. Copie o **"Link público no formato iCal"**

### Método 2: Converter Manualmente

Se você tem o email do calendário: `thiago.perosa@lojaintegrada.com.br`

O link iCal será:
```
https://calendar.google.com/calendar/ical/thiago.perosa%40lojaintegrada.com.br/public/basic.ics
```

**Nota:** O `@` precisa ser codificado como `%40`

### Método 3: Se for um Calendário Compartilhado

Se você compartilhou o calendário com um link específico, o formato pode ser:
```
https://calendar.google.com/calendar/ical/[HASH_DO_LINK]/public/basic.ics
```

## ✅ Como Verificar se o Link Está Correto

1. **Cole o link no navegador**
2. **Deve acontecer:**
   - ✅ Baixa um arquivo `.ics` OU
   - ✅ Mostra texto em formato iCal (começa com `BEGIN:VCALENDAR`)

3. **Se acontecer:**
   - ❌ Mostra página HTML → Link errado
   - ❌ Erro 403 → Calendário não está público
   - ❌ Erro 404 → Link incorreto

## 🔓 Verificar se o Calendário Está Público

1. Google Calendar → Configurações do calendário
2. Seção **"Acesso público"**
3. Marque uma das opções:
   - **"Tornar disponível publicamente"** (completo)
   - **"Disponibilizar apenas informações de disponibilidade"** (ocupado/livre)

## 🎯 Link Correto para Você

Baseado no seu email, use:

```
https://calendar.google.com/calendar/ical/thiago.perosa%40lojaintegrada.com.br/public/basic.ics
```

Cole este link no sistema e teste!

---

**Dica:** Se ainda não funcionar, verifique se o calendário está realmente público nas configurações do Google Calendar.

