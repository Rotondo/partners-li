# PRM/CRM System - Sistema de Gestão de Parcerias

Sistema completo de gestão de relacionamento com parceiros (PRM/CRM) desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

### ✅ Sprint 1: Foundation (Completo)
- **Banco de Dados Supabase**
  - Tabelas: partners, partner_contacts, partner_activities, partner_tasks, partner_documents, partner_health_metrics, partner_alerts
  - RLS (Row Level Security) configurado
  - Triggers e índices otimizados
  - TypeScript types auto-gerados

### ✅ Sprint 2: CRM Core (Completo)
- **Gestão de Parceiros**
  - CRUD completo de parceiros (Pagamento, Marketplace, Logística)
  - Visualização detalhada com tabs
  - Formulários dinâmicos por tipo de parceiro
  
- **Gestão de Contatos**
  - Múltiplos contatos por parceiro
  - Contato principal
  - Informações completas (nome, cargo, email, telefone, notas)

- **Timeline de Atividades**
  - Registro de reuniões, ligações, emails
  - Notas detalhadas
  - Próximos passos e oportunidades

- **Gestão de Tarefas**
  - Tarefas vinculadas a parceiros e atividades
  - Prioridades e status
  - Atribuição de responsáveis

- **Documentos**
  - Upload e gestão de documentos por parceiro
  - Categorização e descrições

### ✅ Sprint 3: Pipeline (Completo)
- **Kanban Board**
  - Visualização em colunas por status
  - Drag & drop com @dnd-kit
  - Filtros avançados
  
- **Lista Global de Tarefas**
  - Visualização de todas as tarefas
  - Ordenação e filtros
  - Ações rápidas

- **Calendário de Atividades**
  - Visualização mensal
  - Indicadores visuais por tipo
  - Navegação entre meses

- **Página Pipeline**
  - Rota dedicada `/pipeline`
  - Interface responsiva
  - Filtros por parceiro, status, prioridade

### ✅ Sprint 4: Health & Intelligence (Completo)
- **Sistema de Health Scores**
  - Edge Function para cálculo automático
  - Scores: Performance, Engajamento, Comercial, Overall
  - Status: Excellent, Good, Warning, Critical
  
- **Sistema de Alertas**
  - Alertas automáticos baseados em métricas
  - Severidade: Low, Medium, High, Critical
  - Tipos: No Contact, High Priority Issues, Health Critical
  
- **Health Dashboard**
  - Visão geral da saúde das parcerias
  - Métricas consolidadas
  - Alertas ativos em destaque

### ✅ Sprint 5: Polish (Completo)
- **Documentação Completa**
  - README atualizado
  - Guia de instalação
  - Sprint checklist

## 🛠️ Tecnologias

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Vite
  - React Router
  - React Query (@tanstack/react-query)
  - React Hook Form + Zod
  - date-fns
  - lucide-react (ícones)
  - @dnd-kit (drag & drop)

- **Backend:**
  - Supabase (Lovable Cloud)
  - PostgreSQL
  - Row Level Security (RLS)
  - Edge Functions
  - Realtime subscriptions

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ ou Bun
- Conta Lovable Cloud (já configurada)

### Setup Local

1. Clone o repositório:
```bash
git clone <seu-repo>
cd <nome-do-projeto>
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:
O arquivo `.env` é gerado automaticamente pelo Lovable Cloud com:
```
VITE_SUPABASE_URL=<sua-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<sua-key>
VITE_SUPABASE_PROJECT_ID=<seu-project-id>
```

4. Execute o projeto:
```bash
npm run dev
# ou
bun dev
```

5. Acesse: `http://localhost:5173`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### partners
- `id`: UUID (PK)
- `name`: TEXT
- `type`: TEXT (payment, marketplace, logistic)
- `data`: JSONB (campos dinâmicos por tipo)
- `user_id`: UUID
- `created_at`, `updated_at`: TIMESTAMP

#### partner_contacts
- `id`: UUID (PK)
- `partner_id`: UUID (FK)
- `name`: TEXT
- `role`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `is_primary`: BOOLEAN
- `notes`: TEXT

#### partner_activities
- `id`: UUID (PK)
- `partner_id`: UUID (FK)
- `title`: TEXT
- `activity_type`: ENUM (meeting, call, email, video_call, other)
- `status`: ENUM (pending, completed, cancelled)
- `scheduled_date`: DATE
- `completed_date`: DATE
- `what_discussed`: TEXT
- `next_steps`: TEXT
- `opportunities`: TEXT
- `participants`: JSONB

#### partner_tasks
- `id`: UUID (PK)
- `partner_id`: UUID (FK)
- `activity_id`: UUID (FK, nullable)
- `title`: TEXT
- `description`: TEXT
- `status`: ENUM (todo, in_progress, done, cancelled)
- `priority`: ENUM (low, medium, high)
- `due_date`: DATE
- `assigned_to`: UUID

#### partner_health_metrics
- `id`: UUID (PK)
- `partner_id`: UUID (FK)
- `overall_score`: INTEGER (0-100)
- `performance_score`: INTEGER (0-100)
- `engagement_score`: INTEGER (0-100)
- `commercial_score`: INTEGER (0-100)
- `health_status`: ENUM (excellent, good, warning, critical)
- `days_since_last_contact`: INTEGER
- `meetings_this_month`: INTEGER
- `open_issues_count`: INTEGER
- `calculated_at`: TIMESTAMP

#### partner_alerts
- `id`: UUID (PK)
- `partner_id`: UUID (FK)
- `user_id`: UUID
- `alert_type`: TEXT
- `severity`: TEXT (low, medium, high, critical)
- `title`: TEXT
- `message`: TEXT
- `is_read`: BOOLEAN
- `is_resolved`: BOOLEAN
- `metadata`: JSONB

### Security (RLS)

Todas as tabelas possuem políticas RLS:
- Usuários só podem ver/editar seus próprios dados
- Admins têm acesso total
- Função `has_role()` para verificação de permissões

## 🔧 Edge Functions

### calculate-health-scores
Calcula automaticamente os health scores de todos os parceiros:
- Analisa atividades, tarefas e engajamento
- Gera scores de performance, engajamento e comercial
- Cria alertas baseados em métricas
- Atualiza a tabela `partner_health_metrics`

**Endpoint:** `/functions/v1/calculate-health-scores`
**Método:** POST
**Auth:** Required (Bearer token)

## 📱 Páginas e Rotas

- `/` - Dashboard principal
- `/auth` - Login/Signup
- `/pipeline` - Pipeline Kanban e tarefas
- `/health` - Health Dashboard
- `/?view=partners` - Listagem de parceiros
- `/?view=payment-methods` - Métodos de pagamento (em desenvolvimento)

## 🎨 Design System

- **Cores:** Sistema de tokens HSL configurado em `index.css`
- **Componentes:** shadcn/ui com customizações
- **Responsividade:** Mobile-first com Tailwind
- **Dark Mode:** Suportado via next-themes

## 🔐 Autenticação

- Sistema de autenticação Supabase
- Email + Senha
- Auto-confirm habilitado (desenvolvimento)
- Protected Routes com contexto de autenticação
- Sistema de roles (admin, user)

## 📊 Métricas e KPIs

### Health Scores
- **Performance Score:** Baseado em issues abertas e tempo sem contato
- **Engagement Score:** Reuniões e atividades recentes
- **Commercial Score:** Atividades completadas e histórico
- **Overall Score:** Média ponderada (40% perf, 30% eng, 30% comm)

### Alertas Automáticos
- Sem contato > 30 dias
- Muitas tarefas de alta prioridade
- Health score crítico

## 🚧 Desenvolvimento

### Estrutura de Pastas
```
src/
├── components/
│   ├── admin/          # Componentes admin
│   ├── dashboard/      # Dashboard e métricas
│   ├── layout/         # Layout (Sidebar, etc)
│   ├── partners/       # Gestão de parceiros
│   ├── payment-methods/# Métodos de pagamento
│   ├── pipeline/       # Pipeline e Kanban
│   └── ui/            # shadcn/ui components
├── contexts/          # React contexts
├── hooks/            # Custom hooks
├── integrations/     # Supabase client
├── lib/             # Utilities
├── pages/           # Páginas principais
├── types/           # TypeScript types
└── main.tsx         # Entry point

supabase/
├── functions/       # Edge functions
└── config.toml      # Configuração Supabase
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 📝 Próximos Passos (Futuras Sprints)

- [ ] Exportação de dados (CSV, Excel)
- [ ] Importação em massa
- [ ] Dashboards comparativos
- [ ] Gráficos de tendências
- [ ] Relatórios automáticos por email
- [ ] Integração com calendários externos
- [ ] Mobile app (React Native)
- [ ] API pública

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do Lovable Discord.

---

**Desenvolvido com ❤️ usando Lovable**