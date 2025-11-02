# 📅 Como Obter o Link iCal do Google Calendar

## O link que você compartilhou

Você compartilhou:
```
https://calendar.google.com/calendar/u/2?cid=dGhpYWdvLnBlcm9zYUBsb2phaW50ZWdyYWRhLmNvbS5icg
```

Este é um link de **visualização web**, não o link do **feed iCal** que precisamos.

## ✅ Como Obter o Link iCal Correto

### Opção 1: Pelo Google Calendar (Recomendado)

1. Abra [Google Calendar](https://calendar.google.com/)
2. No lado esquerdo, encontre seu calendário na lista
3. Clique nos **3 pontos** (⋮) ao lado do nome do calendário
4. Selecione **"Configurações e compartilhamento"**
5. Role até a seção **"Integrar calendário"**
6. Copie o **"Link público no formato iCal"**

O link será algo como:
```
https://calendar.google.com/calendar/ical/seu-email%40gmail.com/public/basic.ics
```

### Opção 2: Converter o Link Atual

Baseado no seu link, o calendário parece ser: `thiago.perosa@lojaintegra.com.br`

O link iCal seria:
```
https://calendar.google.com/calendar/ical/thiago.perosa%40lojaintegra.com.br/public/basic.ics
```

**Mas**: Este link só funcionará se o calendário estiver configurado como público.

### Opção 3: Link Compartilhado (se não for público)

Se você compartilhou o calendário com um link específico:

1. Nas configurações do calendário
2. Seção **"Compartilhar com pessoas específicas"**
3. Role até **"Permissões de acesso para eventos"**
4. Se houver um link compartilhado, ele terá formato:
```
https://calendar.google.com/calendar/ical/[hash]/public/basic.ics
```

## 🔧 Configuração Necessária

Para o link iCal funcionar, o calendário precisa estar:

1. ✅ **Público** OU
2. ✅ **Compartilhado com link público**

**Como verificar:**

1. Configurações do calendário → "Acesso público"
2. Marque **"Tornar disponível publicamente"**
3. OU marque **"Disponibilizar apenas informações de disponibilidade (ocupado/livre)"**

## 📋 Teste o Link

Depois de obter o link iCal, você pode testá-lo:

1. Abra o link no navegador
2. Deve baixar um arquivo `.ics` ou mostrar texto em formato iCal
3. Se aparecer erro, o calendário não está público o suficiente

## 🚀 Próximo Passo

Depois que você tiver o link iCal correto, posso:

1. ✅ Implementar a integração completa
2. ✅ Criar o componente de configuração
3. ✅ Fazer a sincronização automática

**Envie o link iCal quando obtiver e eu implemento tudo!** 🎯

