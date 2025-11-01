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

## ✅ Sprint 2: CRM Core - Interface de Atividades (CONCLUÍDO)

### Componente PartnerDetailView (Visão 360°)
- [x] Criar componente base `PartnerDetailView.tsx`
- [x] Implementar Drawer/Sheet para visualização
- [x] Criar sistema de Tabs
- [x] Tab: Informações (dados cadastrais)
- [x] Tab: Contatos (lista de contatos)
- [x] Tab: Timeline (histórico de atividades)
- [x] Tab: Tarefas (próximos passos)
- [x] Tab: Performance (gráficos)
- [x] Tab: Saúde (score e indicadores)
- [x] Tab: Documentos (anexos)
- [x] Footer com botão "Nova Atividade"

### Componente ActivityTimeline
- [x] Criar componente `ActivityTimeline.tsx`
- [x] Design de cards de atividade
- [x] Ordenação cronológica
- [x] Ícones por tipo de atividade
- [x] Status visual (scheduled, completed, cancelled)
- [x] Exibição de participantes
- [x] Links para editar/excluir

### Formulário AddActivityDialog
- [x] Criar componente `AddActivityDialog.tsx`
- [x] Campo: Select de Parceiro (busca)
- [x] Campo: Tipo (reunião, call, email, tarefa, nota)
- [x] Campo: Data/Quando (date picker)
- [x] Campo: Participantes (multi-select)
- [x] Campo: O que discutimos (textarea)
- [x] Campo: Oportunidades (textarea com tags)
- [x] Campo: Próximos passos (lista de tarefas)
  - [x] Cada item vira task automática
  - [x] Data de vencimento por item
  - [x] Assignee por item
- [x] Validação com Zod
- [x] Integração com banco (savePartnerActivity)
- [x] Auto-save de rascunhos

### Sistema de Contatos Múltiplos
- [x] Criar componente `AddContactDialog.tsx`
- [x] Botão "Adicionar Contato"
- [x] Formulário de contato (nome, cargo, email, telefone)
- [x] Marcar contato principal
- [x] Editar contato existente
- [x] Remover contato
- [x] Integração com banco (savePartnerContact, getPartnerContacts)

### Integrações
- [x] Integrar PartnerDetailView nas tabelas de parceiros
- [x] Click em parceiro abre o drawer
- [x] Recarregar dados após ações
- [x] Toast de feedback

---

## 🔄 Sprint 3: Pipeline - Gestão Visual (PRÓXIMO)

### Componente PipelineKanban
- [ ] Criar componente `PipelineKanban.tsx`
- [ ] Layout Kanban com 4 colunas dinâmicas
  - [ ] **Esta Semana**: Atividades agendadas para próximos 7 dias (scheduled_date)
  - [ ] **Em Andamento**: Status = 'pending' ou 'scheduled' (hoje ou passado)
  - [ ] **Concluídas**: Status = 'completed' (últimos 30 dias)
  - [ ] **Atrasadas**: Status != 'completed' && scheduled_date < hoje
- [ ] Cards de atividade arrastáveis (biblioteca: @dnd-kit)
- [ ] Drag and drop entre colunas
- [ ] Atualização automática de status ao mover card
  - [ ] Mover para "Concluídas" → status = 'completed', completed_date = hoje
  - [ ] Mover para "Em Andamento" → status = 'pending'
- [ ] Contador de cards por coluna
- [ ] Badge visual por tipo de atividade (meeting, call, email, task, note)
- [ ] Badge de prioridade para tarefas

### Sistema de Tarefas Global
- [ ] Criar componente `TasksListView.tsx` (página completa)
- [ ] Lista de todas as tarefas (não apenas de um parceiro)
- [ ] Checkbox para marcar como concluída (atualiza status)
- [ ] Indicador de prioridade com cores
  - [ ] 🔴 Urgent (vermelho)
  - [ ] 🟠 High (laranja)
  - [ ] 🟡 Medium (amarelo)
  - [ ] 🟢 Low (verde)
- [ ] Indicador de prazo
  - [ ] ⚠️ Vencendo em 24h (amarelo)
  - [ ] 🔴 Vencida (vermelho)
  - [ ] ✅ No prazo (verde)
- [ ] Agrupamento por parceiro (collapsible)
- [ ] Filtros avançados
  - [ ] Status (todo, in_progress, done, cancelled)
  - [ ] Prioridade (urgent, high, medium, low)
  - [ ] Parceiro (multi-select)
  - [ ] Data de vencimento (range)
- [ ] Ordenação
  - [ ] Por prazo (crescente/decrescente)
  - [ ] Por prioridade (maior → menor)
  - [ ] Por parceiro (alfabético)
  - [ ] Por data de criação

### Calendário de Atividades
- [ ] Criar componente `ActivityCalendar.tsx`
- [ ] Visualização mensal (usar shadcn/ui Calendar como base)
- [ ] Integração com atividades (getPartnerActivities para todos)
- [ ] Atividades agrupadas por dia
- [ ] Click em dia abre popover com lista de atividades
- [ ] Navegação entre meses (< Outubro 2024 >)
- [ ] Indicadores visuais
  - [ ] Dot colorido por tipo de atividade
  - [ ] Badge de quantidade no dia
- [ ] Highlight do dia atual
- [ ] Hover mostra preview rápido das atividades

### Nova Página: Pipeline
- [ ] Criar `src/pages/Pipeline.tsx`
- [ ] Adicionar rota `/pipeline` no router
- [ ] Adicionar item "Pipeline" no Sidebar
- [ ] Layout com tabs:
  - [ ] Tab: Kanban (PipelineKanban)
  - [ ] Tab: Calendário (ActivityCalendar)
  - [ ] Tab: Minhas Tarefas (TasksListView)
  - [ ] Tab: Todas as Atividades (ActivityListView - tabela)
- [ ] Header com estatísticas rápidas
  - [ ] Total de atividades esta semana
  - [ ] Tarefas pendentes (count)
  - [ ] Atividades atrasadas (count)
  - [ ] Reuniões agendadas hoje (count)
- [ ] Botão flutuante "Nova Atividade" (FAB - Floating Action Button)

### Filtros e Busca Avançada
- [ ] Criar componente `ActivityFilters.tsx` (reutilizável)
- [ ] Busca por texto (título da atividade)
- [ ] Filtro por parceiro (multi-select com busca)
- [ ] Filtro por tipo de atividade (checkboxes)
  - [ ] 🤝 Reunião
  - [ ] 📞 Call
  - [ ] 📧 E-mail
  - [ ] ✅ Tarefa
  - [ ] 📝 Nota
- [ ] Filtro por status (checkboxes)
  - [ ] ⏳ Agendada
  - [ ] ✅ Concluída
  - [ ] ❌ Cancelada
  - [ ] 📋 Pendente
- [ ] Filtro por data (range picker)
  - [ ] Esta semana
  - [ ] Este mês
  - [ ] Últimos 30 dias
  - [ ] Range customizado
- [ ] Botão "Limpar Filtros"
- [ ] Contador de filtros ativos (badge)

### Melhorias de UX
- [ ] Loading states em todos os componentes
- [ ] Skeleton loaders enquanto carrega dados
- [ ] Empty states com ilustração e CTA
- [ ] Toast de confirmação para ações (drag, complete, delete)
- [ ] Animações suaves (framer-motion ou CSS transitions)
- [ ] Responsivo mobile (collapsible kanban em mobile)

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
| Sprint 1: Fundação | ✅ Concluído | 100% (59/59 tarefas) |
| Sprint 2: CRM Core | ✅ Concluído | 100% (54/54 tarefas) |
| Sprint 3: Pipeline | 🔄 Próximo | 0% (0/52 tarefas) |
| Sprint 4: Health | ⏳ Pendente | 0% (0/15 tarefas) |
| Sprint 5: Polish | ⏳ Pendente | 0% (0/16 tarefas) |

**Total Geral:** 113/196 tarefas (58%)

---

## 🎯 Próximo Passo

**Implementar Sprint 3: Pipeline - Gestão Visual**

Foco: Criar sistema completo de pipeline com Kanban visual, calendário de atividades, gerenciamento global de tarefas e filtros avançados. Esta sprint transformará o sistema em uma ferramenta visual poderosa para gestão do dia a dia com os parceiros.
