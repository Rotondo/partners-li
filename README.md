# PRM/CRM System - Sistema de Gestão de Parcerias

Sistema completo de gestão de relacionamento com parceiros (PRM/CRM) desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

> 📊 **[Documentação Técnica Completa do Supabase](./SUPABASE.md)**

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
  - **Vinculação de contatos a atividades**

- **Timeline de Atividades**
  - Registro de reuniões, ligações, emails
  - **Seleção de parceiro e contato específico**
  - Anotação de participantes nas atividades
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
  - **Exibição de participantes/contatos nas atividades**
  
- **Lista Global de Tarefas**
  - Visualização de todas as tarefas
  - Ordenação e filtros
  - Ações rápidas

- **Calendário de Atividades**
  - Visualização mensal
  - Indicadores visuais por tipo
  - Navegação entre meses
  - **Informações de contatos nos eventos**

- **Página Pipeline**
  - Rota dedicada `/pipeline`
  - Interface responsiva
  - Filtros por parceiro, status, prioridade
  - **Criação de atividades com seleção de parceiro e contato**

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

### ✅ Sprint 5: Polish & Documentation (Completo)
- **Documentação Completa**
  - README atualizado
  - **Documentação técnica do Supabase (SUPABASE.md)**
  - Guia de instalação
  - Sprint checklist
  
- **UX Improvements**
  - Layout responsivo dos formulários
  - Melhor espaçamento e legibilidade
  - Tabs adaptáveis para mobile/tablet

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

> **📊 Para documentação técnica completa, veja [SUPABASE.md](./SUPABASE.md)**

### Resumo das Tabelas

- **partners** - Dados principais dos parceiros
- **partner_contacts** - Contatos relacionados aos parceiros
- **partner_activities** - Atividades/interações (reuniões, calls, emails)
- **partner_tasks** - Tarefas vinculadas a parceiros
- **partner_documents** - Documentos/arquivos dos parceiros
- **partner_health_metrics** - Métricas de saúde calculadas automaticamente
- **partner_alerts** - Alertas automáticos baseados em métricas
- **field_configs** - Configurações de campos customizados
- **user_roles** - Gestão de permissões

### Relacionamentos

```
auth.users
    │
    ├─── user_roles (roles/permissões)
    │
    └─── partners
            │
            ├─── partner_contacts (nome, cargo, email, telefone)
            ├─── partner_activities (com referência a contatos via participants)
            ├─── partner_tasks
            ├─── partner_documents
            ├─── partner_health_metrics (1:1)
            └─── partner_alerts
```

### Estrutura CRM Completa

**Hierarquia:**
```
Parceiro (Company)
  └─ Contatos (People)
      └─ Atividades (Activities)
          ├─ Participantes (referência aos contatos)
          └─ Tarefas (Tasks)
```

**Exemplo de Fluxo:**
1. Cadastrar parceiro "Empresa X"
2. Adicionar contatos: "João Silva (CEO)", "Maria Santos (CFO)"
3. Criar atividade "Reunião Q1" e selecionar "João Silva" como participante
4. Visualizar no Pipeline qual contato participou de cada atividade

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
  - Tokens semânticos `--sidebar-*` para navegação
  - Contraste WCAG AA em light/dark mode
- **Componentes:** shadcn/ui com customizações
- **Responsividade:** Mobile-first com Tailwind
  - Sidebar: Desktop fixa (w-64), Mobile drawer com overlay
  - Breakpoint: `md` (768px)
- **Dark Mode:** Suportado via next-themes

## 📱 UI/UX - Navegação

### Sidebar
- **Desktop (≥ md):**
  - Fixa à esquerda (sticky, h-screen)
  - Largura 256px (w-64) ou 64px quando colapsada
  - Botão de collapse (ChevronsLeft/Right)
  - Estado persistido no localStorage

- **Mobile (< md):**
  - Oculta por padrão
  - Botão hamburger fixo (top-4, left-4)
  - Abre como drawer overlay (z-50)
  - Fecha com: Esc, clique fora, botão X
  - Bloqueia scroll do body quando aberta

### Painel de Novidades (24h)
- Localização: Dentro da Sidebar (acima do rodapé)
- Fonte: Parse de `CHANGELOG.md` → seção "Últimas 24 horas"
- Exibe: Máx. 5 itens com badges de tipo (feat/fix/chore/docs)
- Link: "Ver histórico completo" abre `/CHANGELOG.md`
- Visibilidade: Apenas quando sidebar não está colapsada

### Submenu Relatórios
- **Visão Geral** → `/reports`
- **Financeiro** → `/reports?tab=financial` (acesso direto)

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