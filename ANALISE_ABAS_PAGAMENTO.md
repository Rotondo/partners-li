# Análise das Abas: Resumo vs Detalhado

## Situação Atual

### ✅ Detalhado (PaymentMethodsTable)
- **Tipo de dados**: `PaymentMethod` (estrutura muito granular)
- **Tabela**: `payment_methods` (separada)
- **Campos mostrados**: 
  - Parceiro, Tipo, MDR Créd., MDR Déb., MDR Pix, Liquidação, Take Rate, Aprovação Média, Status
- **Recursos**: Visualização apenas
- **Dialog**: `AddPaymentMethodDialog`

### ✅ Resumo (PaymentPartnersTable)  
- **Tipo de dados**: `PaymentPartner` (estrutura simplificada)
- **Tabela**: `partners` com `type='payment'`
- **Campos mostrados**:
  - Parceiro, MDR Crédito, MDR Débito, MDR PIX, Liquidação, Status
- **Recursos**: Busca, filtro de colunas, edição, exclusão
- **Dialog**: `AddPartnerDialog`

## Problema Identificado

⚠️ **REDUNDÂNCIA**: Ambos mostram essencialmente os mesmos dados (taxas MDR básicas) mas:
- Armazenam em tabelas diferentes
- Têm formulários de cadastro diferentes
- Duplicam funcionalidade
- Confundem o usuário

## Solução Proposta

### Opção 1: Unificar em uma única tabela (RECOMENDADA)
- **Remover**: Aba "Detalhado" (PaymentMethodsTable)
- **Manter**: Aba "Resumo" (PaymentPartnersTable) mas melhorar
- **Melhorias**:
  - Adicionar toggle de visualização compacta/detalhada
  - Incluir colunas opcionais (Take Rate, Aprovação Média)
  - Migrar dados de `payment_methods` para `partners` se necessário

### Opção 2: Unificar tipos de dados
- Manter apenas estrutura `PaymentPartner` 
- Remover `PaymentMethod` completamente
- Migrar dados existentes

### Opção 3: Simplificar para uma única view
- Remover as abas completamente
- Criar uma única tabela com filtros avançados
- Modal para visualização detalhada ao clicar no parceiro

## Recomendação

**Opção 1** - Unificar mantendo PaymentPartnersTable e adicionando:
1. Botão toggle para visualização compacta/detalhada
2. Colunas opcionais que podem ser mostradas/escondidas
3. Remover completamente PaymentMethodsTable e tabela payment_methods

