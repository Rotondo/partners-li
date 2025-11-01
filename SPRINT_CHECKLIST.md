# 📋 Checklist de Implementação - Sistema PRM/CRM

## ✅ Sprint 1: Fundação - Criar Tabelas no Supabase (CONCLUÍDO)

### Database Schema
- [x] Criar ENUM types (activity_type, activity_status, health_status, task_priority, task_status)
- [x] Criar tabela `partner_contacts` para contatos dos parceiros
- [x] Criar tabela `partner_activities` para pipeline/CRM
- [x] Criar tabela `partner_health_metrics` para painel de saúde
- [x] Criar tabela `partner_tasks` para próximos passos
- [x] Criar tabela `partner_documents` para anexos e documentos

### RLS Policies
- [x] RLS policies para `partner_contacts`
- [x] RLS policies para `partner_activities`
- [x] RLS policies para `partner_health_metrics`
- [x] RLS policies para `partner_tasks`
- [x] RLS policies para `partner_documents`

### Triggers
- [x] Trigger de updated_at para `partner_contacts`
- [x] Trigger de updated_at para `partner_activities`
- [x] Trigger de updated_at para `partner_tasks`

### Indexes
- [x] Indexes de performance para todas as tabelas
- [x] Indexes para foreign keys
- [x] Indexes para campos de busca frequente

### TypeScript Types
- [x] Criar arquivo `src/types/crm.ts` com todos os tipos
- [x] Tipos: ActivityType, ActivityStatus, HealthStatus, TaskPriority, TaskStatus
- [x] Interfaces: PartnerContact, PartnerActivity, PartnerHealthMetrics, PartnerTask, PartnerDocument
- [x] Helper types: NewPartnerContact, NewPartnerActivity, etc.

### CRUD Functions
- [x] Funções CRUD para `partner_contacts` em `src/lib/db.ts`
  - [x] savePartnerContact()
  - [x] getPartnerContacts()
  - [x] deletePartnerContact()
- [x] Funções CRUD para `partner_activities`
  - [x] savePartnerActivity()
  - [x] getPartnerActivities()
  - [x] deletePartnerActivity()
- [x] Funções CRUD para `partner_health_metrics`
  - [x] savePartnerHealthMetrics()
  - [x] getPartnerHealthMetrics()
  - [x] getAllPartnerHealthMetrics()
- [x] Funções CRUD para `partner_tasks`
  - [x] savePartnerTask()
  - [x] getPartnerTasks()
  - [x] deletePartnerTask()
- [x] Funções CRUD para `partner_documents`
  - [x] savePartnerDocument()
  - [x] getPartnerDocuments()
  - [x] deletePartnerDocument()
- [x] Atualizar clearDatabase() para incluir novas tabelas
- [x] Conversão de datas (string -> Date) em todas as funções

---

## 🔄 Sprint 2: CRM Core - Interface de Atividades (EM ANDAMENTO)

### Componente PartnerDetailView (Visão 360°)
- [ ] Criar componente base `PartnerDetailView.tsx`
- [ ] Implementar Drawer/Sheet para visualização
- [ ] Criar sistema de Tabs
- [ ] Tab: Informações (dados cadastrais)
- [ ] Tab: Contatos (lista de contatos)
- [ ] Tab: Timeline (histórico de atividades)
- [ ] Tab: Tarefas (próximos passos)
- [ ] Tab: Performance (gráficos)
- [ ] Tab: Saúde (score e indicadores)
- [ ] Tab: Documentos (anexos)
- [ ] Footer com botão "Nova Atividade"

### Componente ActivityTimeline
- [ ] Criar componente `ActivityTimeline.tsx`
- [ ] Design de cards de atividade
- [ ] Ordenação cronológica
- [ ] Ícones por tipo de atividade
- [ ] Status visual (scheduled, completed, cancelled)
- [ ] Exibição de participantes
- [ ] Links para editar/excluir

### Formulário AddActivityDialog
- [ ] Criar componente `AddActivityDialog.tsx`
- [ ] Campo: Select de Parceiro (busca)
- [ ] Campo: Tipo (reunião, call, email, tarefa, nota)
- [ ] Campo: Data/Quando (date picker)
- [ ] Campo: Participantes (multi-select)
- [ ] Campo: O que discutimos (textarea)
- [ ] Campo: Oportunidades (textarea com tags)
- [ ] Campo: Próximos passos (lista de tarefas)
  - [ ] Cada item vira task automática
  - [ ] Data de vencimento por item
  - [ ] Assignee por item
- [ ] Validação com Zod
- [ ] Integração com banco (savePartnerActivity)
- [ ] Auto-save de rascunhos

### Sistema de Contatos Múltiplos
- [ ] Criar componente `ContactsList.tsx`
- [ ] Botão "Adicionar Contato"
- [ ] Formulário de contato (nome, cargo, email, telefone)
- [ ] Marcar contato principal
- [ ] Editar contato existente
- [ ] Remover contato
- [ ] Integração com banco (savePartnerContact, getPartnerContacts)

### Integrações
- [ ] Integrar PartnerDetailView nas tabelas de parceiros
- [ ] Click em parceiro abre o drawer
- [ ] Recarregar dados após ações
- [ ] Toast de feedback

---

## 🎯 Sprint 3: Pipeline - Gestão Visual (PENDENTE)

### Componente PipelineKanban
- [ ] Criar componente `PipelineKanban.tsx`
- [ ] Layout Kanban com 4 colunas
  - [ ] Esta Semana
  - [ ] Em Andamento
  - [ ] Concluídas
  - [ ] Atrasadas
- [ ] Cards de atividade arrastáveis
- [ ] Drag and drop entre colunas
- [ ] Atualização de status automática
- [ ] Filtros por parceiro
- [ ] Filtros por tipo de atividade

### Sistema de Tarefas
- [ ] Criar componente `TasksList.tsx`
- [ ] Lista de tarefas pendentes
- [ ] Checkbox para marcar como concluída
- [ ] Indicador de prioridade (cores)
- [ ] Indicador de prazo (vencendo/vencida)
- [ ] Filtros (status, prioridade, parceiro)
- [ ] Ordenação (prazo, prioridade)

### Calendário de Atividades
- [ ] Criar componente `ActivityCalendar.tsx`
- [ ] Visualização mensal
- [ ] Atividades agrupadas por dia
- [ ] Click em dia mostra detalhes
- [ ] Navegação entre meses
- [ ] Indicadores visuais de tipos

### Filtros e Busca Avançada
- [ ] Componente de filtros
- [ ] Busca por texto
- [ ] Filtro por parceiro
- [ ] Filtro por tipo de atividade
- [ ] Filtro por status
- [ ] Filtro por data

---

## 💚 Sprint 4: Health & Intelligence (PENDENTE)

### Componente HealthDashboard
- [ ] Criar componente `HealthDashboard.tsx`
- [ ] Score geral (0-100)
- [ ] Distribuição por status (excellent, good, warning, critical)
- [ ] Lista de parceiros que precisam atenção
- [ ] Alertas automáticos
- [ ] Gráficos de tendência

### Edge Function: Calculate Health Scores
- [ ] Criar edge function `calculate-health-scores`
- [ ] Algoritmo de cálculo:
  - [ ] Engagement score (frequência de reuniões)
  - [ ] Performance score (métricas de performance)
  - [ ] Recência score (tempo desde último contato)
  - [ ] Task completion score (taxa de conclusão)
- [ ] Atualização automática diária
- [ ] Trigger manual

### Sistema de Alertas
- [ ] Edge function para notificações
- [ ] Alerta: Parceiro sem contato há 30+ dias
- [ ] Alerta: Performance abaixo da média
- [ ] Alerta: Tarefa vencendo em 24h
- [ ] Alerta: Reunião agendada para hoje
- [ ] Sistema de notificações no UI

### Relatórios Automáticos
- [ ] Edge function de relatórios
- [ ] Relatório de Engajamento (semanal/mensal)
- [ ] Top 5 Parceiros
- [ ] Bottom 5 Parceiros (precisam atenção)
- [ ] Forecast de Renovações

---

## 🎨 Sprint 5: Polish - Refinamentos (PENDENTE)

### Dashboard Comparativo
- [ ] Criar componente `ComparativeGrid.tsx`
- [ ] Grid multi-parceiros
- [ ] Comparação de taxas
- [ ] Comparação de performance
- [ ] Comparação de saúde
- [ ] Seleção dinâmica de parceiros

### Gráficos de Tendência
- [ ] Gráfico: Evolução de GMV
- [ ] Gráfico: Taxa de aprovação over time
- [ ] Gráfico: Frequência de contato (heatmap)
- [ ] Gráfico: Distribuição de tipos de atividade

### Exportação
- [ ] Exportar para Excel (múltiplas abas)
- [ ] Exportar para PDF (com dashboard visual)
- [ ] Botão de export em cada tabela

### Importação
- [ ] Importar de Google Sheets
- [ ] Importar de CSV
- [ ] Mapeamento de colunas
- [ ] Validação de dados

### Testes e Correções
- [ ] Testes unitários de componentes
- [ ] Testes de integração
- [ ] Correção de bugs
- [ ] Otimização de performance
- [ ] Acessibilidade

### Documentação
- [ ] Documentar arquitetura
- [ ] Guia de uso
- [ ] Screenshots
- [ ] Changelog

---

## 📊 Resumo de Progresso

| Sprint | Status | Progresso |
|--------|--------|-----------|
| Sprint 1: Fundação | ✅ Concluído | 100% (44/44 tarefas) |
| Sprint 2: CRM Core | 🔄 Em Andamento | 0% (0/20 tarefas) |
| Sprint 3: Pipeline | ⏳ Pendente | 0% (0/18 tarefas) |
| Sprint 4: Health | ⏳ Pendente | 0% (0/15 tarefas) |
| Sprint 5: Polish | ⏳ Pendente | 0% (0/16 tarefas) |

**Total Geral:** 44/113 tarefas (39%)

---

## 🎯 Próximo Passo

**Implementar Sprint 2: CRM Core - Interface de Atividades**

Foco: Criar interface completa para visualização 360° de parceiros, timeline de atividades, formulário de atividades e sistema de contatos.
