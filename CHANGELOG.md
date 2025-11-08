# Changelog

## Últimas 24 horas (2025-11-08)

- **fix(sidebar)**: Sidebar agora acessível em todas as páginas via botão hamburger mobile
- **fix(sidebar)**: Correção do highlight de links com query params (ex: `/reports?tab=financial`)
- **feat(ui)**: Feedback visual melhorado - botão hamburger some quando menu está aberto

---

## Últimas 24 horas (2025-11-07)

- **feat(ui)**: Sidebar com drawer/overlay mobile e painel de novidades 24h
- **feat(ui)**: Botão hamburger mobile para abertura do menu lateral
- **feat(ui)**: Sistema de cores semânticas para sidebar (melhor contraste)
- **feat(navigation)**: Submenu Relatórios com acesso direto ao Financeiro
- **feat(legal)**: Página Legal dedicada integrada à navegação

---

## Sprint 6 - UI/UX Mobile + Novidades (2025-11-07)

### 🎯 Features

#### Sidebar Mobile Recolhível
- **feat(ui)**: Drawer com overlay para mobile (< md breakpoint)
  - Botão hamburger fixo no topo esquerdo
  - Overlay semi-transparente (bg-black/40)
  - Painel deslizante (w-72, max-w-[85vw])
  - Animação slide-in-from-left
  - Fecha com Esc, clique fora ou botão X
  - Bloqueia scroll do body quando aberto
  - Acessibilidade: role="dialog", aria-modal, aria-controls

#### Painel de Novidades (24h)
- **feat(ui)**: Componente `Novidades24hPanel` na Sidebar
  - Parser de CHANGELOG.md para extrair últimas 24h
  - Exibe max. 5 itens com badges de tipo (feat/fix/chore)
  - Link para histórico completo
  - Aparece apenas quando sidebar não está colapsada
  - Lib: `src/lib/changelog-parser.ts` com utils de parse

#### Navegação Melhorada
- **feat(navigation)**: Submenu Relatórios expandido
  - "Visão Geral" → `/reports`
  - "Financeiro" → `/reports?tab=financial`
- **feat(navigation)**: Página Legal (`/legal`) adicionada ao menu principal

#### Sistema de Cores Sidebar
- **feat(ui)**: Tokens semânticos `--sidebar-*` em index.css
  - Light mode: fundo branco, texto escuro, azul para ativo
  - Dark mode: azul escuro suave, texto claro
  - Contraste WCAG AA em todos os estados
  - Remove verde agressivo dos estados ativos

### 📚 Libs Criadas
- `src/lib/changelog-parser.ts` - Parser e formatação de CHANGELOG.md

### 🎨 Componentes UI
- `src/components/layout/Novidades24hPanel.tsx` - Painel de novidades 24h
- `src/components/layout/MobileMenuButton.tsx` - Botão hamburger mobile

### 🔧 Atualizações
- `Sidebar.tsx`: Drawer mobile, painel novidades, cores semânticas, estado collapse persistido
- `Reports.tsx`: Integrado MobileMenuButton
- `Partners.tsx`: Integrado MobileMenuButton  
- `Legal.tsx`: Estrutura ajustada para mobile
- `index.css`: Variáveis `--sidebar-*` para light/dark mode

### ✅ Testes Realizados
- ✅ Mobile: botão hamburger abre drawer com overlay
- ✅ Fecha com Esc, clique fora e botão X
- ✅ Desktop: sidebar fixa sem regressões
- ✅ Painel de novidades renderiza itens do CHANGELOG
- ✅ Cores com contraste adequado (sem verde agressivo)
- ✅ Submenu Relatórios funcional
- ✅ Responsividade mantida em todas as páginas

---

## Histórico Anterior (2025-11-05)

- **feat(legal)**: Sistema completo de contratos com versões e signatários
- **feat(financial)**: Métricas mensais e relatório financeiro com export CSV
- **feat(storage)**: Upload de documentos integrado com Storage bucket privado
- **feat(admin)**: Configurações de campos persistidas no Supabase (multiusuário)

---

## Sprint 6 - Jurídico, Financeiro, Configs e Upload (2025-11-05)

### 🎯 Features

#### Jurídico (Legal)
- **feat(legal)**: Sistema completo de contratos com suporte a versões e signatários
  - Nova tabela `contracts` com status workflow (draft → under_review → awaiting_signature → active → expired → cancelled)
  - Tabela `contract_versions` para versionamento de documentos contratuais
  - Tabela `contract_signers` para rastreamento de assinaturas
  - Nova aba "Jurídico" no detalhe do parceiro com gerenciamento completo
  - Upload de versões de contratos integrado com Storage
  - RLS policies completas por usuário

#### Financeiro (Financial)
- **feat(financial)**: Sistema de métricas mensais e relatório financeiro
  - Tabela `partner_monthly_metrics` para GMV e Rebate mensais
  - Campos: gmv_share, rebate_share, gmv_amount, rebate_amount
  - Relatório Financeiro com agregações por parceiro
  - Exportação para CSV
  - Integração com página Reports (agora disponível)
  - RLS policies e índices otimizados

#### Admin - Field Configs
- **feat(admin)**: Configurações de campos persistidas no Supabase
  - Migração da tabela `field_configs` (já existente, estrutura validada)
  - Suporte multiusuário para configurações personalizadas
  - Isolamento por user_id via RLS

#### Storage & Upload
- **feat(storage)**: Sistema completo de upload de documentos
  - Bucket `partner-documents` privado criado via código
  - RLS policies baseadas em user_id no path
  - Componente `DocumentUploader` reutilizável
  - Suporte a signed URLs para downloads seguros
  - Integração com aba Documentos (upload + listagem + download)
  - Limite de 50MB por arquivo
  - Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP, TXT

### 📚 Libs Criadas
- `src/lib/contracts.ts` - CRUD completo de contratos, versões e signatários
- `src/lib/storage.ts` - Upload, download (signed URLs), listagem e deleção
- `src/lib/partner-metrics.ts` - Métricas mensais e resumo financeiro

### 🎨 Componentes UI
- `src/components/partners/DetailTabs/LegalTab.tsx` - Gestão de contratos
- `src/components/partners/DocumentUploader.tsx` - Upload com categorização
- `src/components/reports/FinancialReport.tsx` - Relatório com tabela e CSV export

### 🔧 Atualizações
- `PartnerDetailView`: Nova tab "Jurídico" (9 tabs total)
- `DocumentsTab`: Integrado upload + download com signed URLs
- `Reports.tsx`: Relatório Financeiro disponível (não mais "em desenvolvimento")
- `main.tsx`: Inicialização automática do bucket partner-documents

### 🔐 Segurança
- Todas as tabelas com RLS habilitado
- Políticas baseadas em `user_id = auth.uid()`
- Storage bucket privado com RLS no path
- Signed URLs para downloads seguros (3600s expiry)

### 📊 Database
- 3 novas tabelas: contracts, contract_versions, contract_signers
- 1 bucket: partner-documents (privado)
- Índices otimizados para queries comuns
- Triggers updated_at em todas as tabelas
- Comments/documentation em SQL

### ✅ Testes Recomendados
1. **Contratos**: Criar → Alterar Status → Upload Versão → Download
2. **Financeiro**: Adicionar métricas mensais → Visualizar relatório → Exportar CSV
3. **Documentos**: Upload → Listagem → Download → Categorias
4. **Regressão**: Pipeline, Health, Strategic continuam funcionais
