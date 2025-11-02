# 📊 Guia: Como Cadastrar Métricas Mensais dos Parceiros

Este guia explica passo a passo como cadastrar mensalmente as métricas de cada parceiro de pagamento e logística.

## 📋 Campos Disponíveis

Para cada mês, você pode cadastrar:

1. **Share de GMV (%)** - Percentual de participação no GMV total do mês
2. **Share de Rebate (%)** - Percentual de participação no rebate total do mês
3. **Valor GMV (R$)** - Valor absoluto de GMV transacionado no mês
4. **Valor Rebate (R$)** - Valor absoluto de rebate gerado no mês
5. **Número de Lojas** - Quantas lojas estavam ativas usando este parceiro no mês
6. **Taxa de Aprovação (%)** - Percentual de transações aprovadas no mês
7. **Número de Pedidos** - Total de pedidos/transações processados no mês
8. **Observações** - Notas adicionais sobre o mês (campanhas, mudanças, etc.)

## 🚀 Passo a Passo

### Opção 1: Através da Visualização Detalhada do Parceiro

1. **Acesse a página de Parceiros**
   - Vá para `/partners/payment` ou `/partners/logistics`
   - Ou clique em "Parceiros" no menu lateral

2. **Abra os detalhes do parceiro**
   - Clique em um parceiro na lista
   - Isso abrirá o painel lateral com os detalhes do parceiro

3. **Acesse a aba "Performance"**
   - No painel lateral, clique na aba **"Performance"**
   - Role até o final da aba

4. **Clique no botão "Cadastrar Métricas Mensais"**
   - Você verá um card com o botão para cadastrar métricas
   - Clique em **"Cadastrar Métricas Mensais"**

5. **Preencha o formulário**
   - Selecione o **Ano** (ex: 2025)
   - Selecione o **Mês** (ex: Novembro)
   - Preencha os campos:
     - **Share de GMV (%)** - Ex: 25.5
     - **Share de Rebate (%)** - Ex: 30.2
     - **Valor GMV (R$)** - Ex: 125000.50
     - **Valor Rebate (R$)** - Ex: 3750.25
     - **Número de Lojas** - Ex: 150
     - **Taxa de Aprovação (%)** - Ex: 85.5
     - **Número de Pedidos** - Ex: 12500
     - **Observações** (opcional) - Ex: "Campanha Black Friday"

6. **Salve as métricas**
   - Clique em **"Salvar Métrica"**
   - Você receberá uma confirmação de sucesso
   - As prioridades dos parceiros serão atualizadas automaticamente

### Opção 2: Através da Lista de Parceiros (se implementado)

*(Esta funcionalidade pode estar disponível diretamente na tabela de parceiros)*

## ✨ Funcionalidades Automáticas

### Atualização de Priorização

Após salvar as métricas mensais, o sistema **automaticamente**:

- ✅ Calcula a priorização dos parceiros baseada em Pareto (80/20)
- ✅ Atualiza o campo **"É Importante"** (⭐)
- ✅ Atualiza o **Ranking** (1º, 2º, 3º lugar, etc.)
- ✅ Define o **Foco Pareto** (GMV ou Rebate)

Isso acontece de forma transparente - você não precisa fazer nada além de salvar as métricas!

### Edição de Métricas Existentes

Se você já cadastrou métricas para um mês:

1. **Selecione o mesmo Ano e Mês** no formulário
2. Os dados serão **carregados automaticamente**
3. **Edite os valores** conforme necessário
4. **Salve** para atualizar

## 📊 Visualização de Métricas

Após cadastrar métricas, você pode visualizar:

- **Lista de métricas já cadastradas** - Aparece na parte inferior do dialog, mostrando os últimos 5 meses
- **Histórico completo** - Acessível através da aba "Performance" do parceiro (em desenvolvimento)

## 💡 Dicas

1. **Cadastre mensalmente** - É recomendado cadastrar as métricas assim que os dados do mês estiverem disponíveis

2. **Use as Observações** - Anote campanhas especiais, mudanças de estratégia ou eventos que impactaram as métricas

3. **Precisão nos percentuais** - Os shares de GMV e Rebate devem somar (aproximadamente) 100% entre todos os parceiros do mesmo tipo

4. **Consistência** - Mantenha a mesma fonte de dados (sistema interno, relatórios do parceiro, etc.) para garantir consistência

5. **Priorização Automática** - Confie no sistema de priorização automática, mas você também pode ajustar manualmente na aba "Prioridade" ao editar o parceiro

## 🔄 Fluxo Mensal Recomendado

1. **Primeiro dia útil do mês**: Prepare os dados do mês anterior
2. **Cadastre as métricas**: Use o formulário para cada parceiro
3. **Revise as priorizações**: Verifique se a priorização automática faz sentido
4. **Ajuste se necessário**: Edite manualmente a priorização se precisar

## ❓ Dúvidas Frequentes

**Q: Posso cadastrar métricas de meses passados?**  
A: Sim! Basta selecionar o ano e mês desejados no formulário.

**Q: O que acontece se eu cadastrar duas vezes o mesmo mês?**  
A: O sistema atualiza os dados existentes, não cria duplicatas.

**Q: As métricas são obrigatórias?**  
A: Todos os campos numéricos são obrigatórios, mas você pode deixar em 0 se não tiver o dado. O campo "Observações" é opcional.

**Q: Como vejo o histórico completo de métricas?**  
A: Atualmente, você pode ver os últimos 5 meses no próprio dialog. O histórico completo será exibido na aba "Performance" (em desenvolvimento).

---

**Última atualização:** Novembro 2025

