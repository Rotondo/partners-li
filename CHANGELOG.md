# Changelog

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
