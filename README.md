# 🚀 Plataforma de Gestão de Parceiros

[![Project Status](https://img.shields.io/badge/status-desenvolvimento-yellow.svg)]()
[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **Plataforma de Gestão de Parceiros** é uma aplicação web moderna para gestão completa de parceiros logísticos, de pagamento e marketplaces em um único sistema integrado.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Status do Projeto](#status-do-projeto)
- [O Que Tem](#o-que-tem)
- [O Que Não Tem](#o-que-não-tem)
- [Pontos Fortes](#pontos-fortes)
- [Pontos Fracos](#pontos-fracos)
- [Próximos Passos](#próximos-passos)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

**Plataforma de Gestão de Parceiros** é uma solução completa para empresas que trabalham com múltiplos tipos de parceiros. O sistema permite:

- ✅ Gestão de parceiros logísticos (cobertura, prazos, capacidade)
- ✅ Gestão de parceiros de pagamento (taxas MDR, liquidação, performance)
- ✅ Gestão de marketplaces (comissões, categorias, alcance)
- ✅ **Parceiros multi-categoria** (um mesmo parceiro pode atuar em várias frentes)
- ✅ **Sistema de Admin** para configurar campos por tipo de parceiro
- ✅ **Dados compartilhados** entre categorias (nome, status, notas)
- ✅ Visão consolidada de todos os parceiros
- ✅ Interface centralizada para administração

**Objetivo:** Fornecer uma visão completa e centralizada de todos os parceiros logísticos, de pagamento e marketplaces, facilitando a tomada de decisão estratégica.

**Desenvolvido por:** Thiago Rotondo

---

## 🚀 Tecnologias

### Core
- **React 18.3** - Biblioteca JavaScript para interfaces
- **TypeScript 5.8** - Superset do JavaScript com tipagem estática
- **Vite 5.4** - Build tool e dev server ultrarrápido

### UI/UX
- **shadcn/ui** - Componentes acessíveis baseados em Radix UI
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones moderna
- **recharts** - Biblioteca de gráficos para React

### Gerenciamento de Estado e Formulários
- **TanStack Query 5.8** - Gerenciamento de servidor state e cache
- **React Hook Form 7.6** - Biblioteca performática para formulários
- **Zod 3.25** - Schema validation
- **@hookform/resolvers** - Integração Zod + React Hook Form

### Roteamento
- **React Router DOM 6.3** - Roteamento declarativo

### Utilitários
- **date-fns 3.6** - Manipulação de datas
- **class-variance-authority** - Gerenciamento de variantes de classe
- **tailwind-merge** - Merge inteligente de classes Tailwind
- **clsx** - Construção condicional de classes

### Outras
- **Sonner** - Sistema de notificações toast moderno
- **next-themes** - Suporte a temas dark/light

### Desenvolvimento
- **@vitejs/plugin-react-swc** - Plugin React com SWC
- **ESLint** - Linter de código
- **TypeScript ESLint** - Regras ESLint para TypeScript
- **PostCSS & Autoprefixer** - Processamento de CSS

---

## 📊 Status do Projeto

### Status: 🟡 Desenvolvimento Ativo

**Fase Atual:** MVP/Protótipo Funcional

- ✅ Interface de usuário completa
- ✅ Formulários complexos implementados
- ✅ Validação de dados robusta
- ⚠️ Integração com backend pendente
- ⚠️ Testes automatizados não implementados
- ⚠️ Persistência de dados não configurada

---

## ✅ O Que Tem

### Funcionalidades Implementadas

#### 1. Dashboard
- [x] Layout responsivo com sidebar
- [x] Cards de métricas (estrutura preparada)
- [x] Gráficos de distribuição (preparado para dados reais)
- [ ] **Dados mockados** (arrays vazios)

#### 2. Gestão de Parceiros
- [x] Visão geral de todos os parceiros
- [x] Categorização em Logísticos, Pagamento e Marketplaces
- [x] **Parceiros multi-categoria** (um parceiro pode atuar em múltiplas frentes)
- [x] **Dados compartilhados** entre categorias (nome, status, data de início, notas)
- [x] Navegação com submenu expandível
- [x] Formulários específicos com sistema de abas para cada tipo de parceiro

##### 2.1 Parceiros Logísticos
- [x] Cadastro de parceiros logísticos
- [x] Gestão de cobertura por estado
- [x] Informações de prazo de entrega e capacidade
- [x] Modelos de preço (fixo/variável)
- [x] Tipo de integração (API/Manual)
- [x] Status e observações

##### 2.2 Parceiros de Pagamento
- [x] Cadastro completo de parceiros de pagamento
- [x] **Formulário com 8 abas** (Identificação, Taxas, Prazos, Take Rate, Performance, Meios, Antifraude, Observações)
- [x] Gestão de taxas MDR (Crédito, Débito, PIX)
- [x] Configuração de prazos de liquidação
- [x] Take Rate e performance (3 meses)
- [x] Meios de pagamento aceitos (Cartão, PIX, Boleto, Carteiras, BNPL)
- [x] Sistema de antifraude opcional
- [x] Observações personalizadas

##### 2.3 Parceiros de Marketplace
- [x] Cadastro de marketplaces
- [x] Gestão de comissões
- [x] Seleção de categorias suportadas
- [x] Alcance mensal de usuários
- [x] Taxa de conversão e tipo de integração

#### 3. Sistema de Administração de Campos
- [x] **Gestão de campos por tipo de parceiro** (Logístico, Pagamento, Marketplace)
- [x] Interface admin para habilitar/desabilitar campos
- [x] Controle de campos obrigatórios
- [x] Configuração independente para cada tipo
- [x] **Adicionar novos campos customizados**
- [x] **Editar campos existentes**
- [x] **Remover campos**
- [x] Persistência de configurações no localStorage
- [x] Estatísticas de campos ativos/desabilitados
- [x] Reset para configuração padrão

#### 4. Sistema de Proteção de Dados (Blur)
- [x] **Botão toggle global** para ocultar/mostrar dados sensíveis
- [x] Blur automático em valores monetários, taxas e dados pessoais
- [x] Proteção por linha ou célula específica
- [x] Estado persistido no localStorage
- [x] Útil para apresentações e demos sem expor dados reais
- [x] Interface visual clara com ícone Eye/EyeOff

- [ ] **Persistência:** Estado apenas em memória (React state)

#### 5. Gestão de Lojas
- [x] Interface preparada
- [ ] **Funcionalidade não implementada**
- [ ] **Dados:** Array vazio

#### 6. Projeções
- [ ] **Em desenvolvimento**
- [ ] Placeholder visual

#### 7. Relatórios
- [ ] **Em desenvolvimento**
- [ ] Placeholder visual

### Infraestrutura e Configuração

#### ✅ Configurações Existentes
- [x] TypeScript configurado (em modo não-strict)
- [x] ESLint configurado
- [x] Tailwind CSS com tema dark/light
- [x] Vite configurado com SWC
- [x] Alias `@/` para importação de componentes
- [x] Componentes shadcn/ui instalados
- [x] Sistema de design completo (cores, espaçamentos, tipografia)

#### ✅ Qualidade de Código
- [x] Estrutura modular e organizada
- [x] Separação de responsabilidades
- [x] TypeScript em todos os componentes
- [x] Validação de dados com Zod
- [x] Componentes reutilizáveis
- [x] Hooks customizados (`use-toast`, `use-mobile`)

---

## ❌ O Que Não Tem

#### Observações de Desenvolvimento

Este é um **sistema privado** desenvolvido por **Thiago Rotondo**:
- 🔒 Não indexado por buscadores (robots.txt e meta tags configurados)
- 🛡️ Protegido contra crawlers
- 🔐 Acesso privado restrito

### Funcionalidades Faltantes

#### 1. Backend e Persistência
- [ ] Integração com API REST
- [ ] Banco de dados
- [ ] Autenticação e autorização
- [ ] Proteção contra CSRF e XSS
- [ ] Rate limiting
- [ ] Upload de arquivos

#### 2. Gestão de Estado
- [ ] Estado global (Context API/Zustand/Jotai)
- [ ] Persistência em localStorage/IndexedDB
- [ ] Cache de requisições
- [ ] Estado compartilhado entre componentes

#### 3. Testes
- [ ] Testes unitários (Jest + Testing Library)
- [ ] Testes de integração
- [ ] Testes E2E (Playwright/Cypress)
- [ ] Cobertura de código configurada

#### 4. Performance
- [ ] Lazy loading de componentes
- [ ] Code splitting
- [ ] Memorização de componentes (`React.memo`)
- [ ] Otimização de re-renders (`useMemo`, `useCallback`)
- [ ] Virtualização de listas longas

#### 5. Funcionalidades de Negócio
- [ ] Editar meios de pagamento existentes
- [ ] Deletar meios de pagamento
- [ ] Filtros e busca avançada
- [ ] Ordenação de tabelas
- [ ] Paginação de resultados
- [ ] Exportação de dados (CSV/Excel/PDF)
- [ ] Histórico de alterações
- [ ] Comparação lado a lado

#### 6. UX/UI
- [ ] Loading states (skeleton screens)
- [ ] Error boundaries
- [ ] Feedback visual de ações
- [ ] Toggle de tema dark/light no UI
- [ ] Navegação breadcrumbs
- [ ] Modais de confirmação
- [ ] Undo/redo de ações

#### 7. DevOps e Qualidade
- [ ] GitHub Actions (CI/CD)
- [ ] Pre-commit hooks (Husky)
- [ ] Lint-staged
- [ ] Testes automatizados
- [ ] Deploy automatizado
- [ ] Monitoramento de erro (Sentry)
- [ ] Analytics

#### 8. Documentação
- [ ] Arquitetura do sistema documentada
- [ ] Guia de contribuição
- [ ] Decisões técnicas (ADR)
- [ ] API endpoints documentados
- [ ] Exemplos de uso

---

## 💪 Pontos Fortes

### 1. Stack Moderna e Bem Escolhida
- **React + TypeScript**: Tipagem estática, melhor DX
- **Vite**: Hot reload instantâneo, builds rápidos
- **shadcn/ui**: Componentes acessíveis por padrão
- **Tailwind CSS**: CSS moderno e manutenível

### 2. Arquitetura Limpa
- **Separação de responsabilidades**: Componentes, types, schemas, libs
- **Modularidade**: Componentes pequenos e reutilizáveis
- **Organização**: Estrutura de pastas bem definida

### 3. Qualidade de UI
- **Design System**: Cores, espaçamentos, tipografia consistentes
- **Responsividade**: Layout adaptável
- **Acessibilidade**: Componentes Radix UI
- **Dark Mode**: Preparado para múltiplos temas

### 4. Validação Robusta
- **Zod**: Schema validation em tempo de desenvolvimento
- **React Hook Form**: Formulários performáticos
- **Feedback visual**: Mensagens de erro claras

### 5. Escalabilidade
- **TypeScript**: Detecção precoce de erros
- **Component-based**: Fácil adicionar novas features
- **TanStack Query**: Preparado para integração de API

### 6. Developer Experience
- **Hot Reload**: Feedback instantâneo
- **TypeScript**: Autocomplete e type checking
- **ESLint**: Padronização de código
- **Aliases**: Importação limpa com `@/`

---

## ⚠️ Pontos Fracos

### 1. TypeScript Não-Strict
```typescript
// tsconfig.json - Configurações desabilitadas
"noImplicitAny": false           // ❌ Perde segurança de tipos
"noUnusedParameters": false      // ❌ Código não otimizado
"strictNullChecks": false       // ❌ Perigoso para produção
```

**Risco:** Bugs potenciais em produção, perda de benefícios do TypeScript

### 2. Falta de Persistência
- **Estado em memória**: Dados perdidos ao recarregar
- **Sem backend**: Não há API real
- **Sem database**: Sem armazenamento permanente

**Impacto:** Sistema não funcional para uso real

### 3. Sem Testes
- **Nenhum teste**: Impossível garantir qualidade
- **Sem CI/CD**: Deploys manuais e arriscados
- **Risco de regressão**: Mudanças podem quebrar funcionalidades

**Impacto:** Baixa confiabilidade em produção

### 4. Performance Não Otimizada
- **Sem memoização**: Re-renders desnecessários
- **Sem code splitting**: Bundle único e pesado
- **Sem lazy loading**: Tudo carrega de uma vez

**Impacto:** UX lenta, especialmente em dispositivos móveis

### 5. Funcionalidades Incompletas
- **Lojas**: Apenas placeholder
- **Projeções**: Não implementado
- **Relatórios**: Não implementado
- **Dashboard**: Sem dados reais

**Impacto:** Produto incompleto

### 6. Muitas Dependências
- **61 dependências**: Bundle pesado
- **Combinar ferramentas**: Pode haver overlap

**Impacto:** Build lento, app lento para carregar

### 7. Sem Error Handling
- **Sem Error Boundaries**: App pode crashar
- **Sem tratamento de erros**: UX ruim ao falhar
- **Sem loading states**: Usuário sem feedback

**Impacto:** Experiência negativa ao encontrar erros

### 8. Segurança Básica
- **Sem autenticação**: Qualquer um pode acessar
- **Sem autorização**: Sem controle de acesso
- **Sem sanitização**: Vulnerável a XSS

**Impacto:** Não seguro para produção

---

## 🎯 Próximos Passos

### Prioridade ALTA 🔴

#### 1. Configurar TypeScript Strict Mode
**Objetivo:** Ativar todas as verificações de tipo

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // ✅ Ativar
    "noImplicitAny": true,             // ✅ Ativar
    "strictNullChecks": true,          // ✅ Ativar
    "noUnusedLocals": true,            // ✅ Ativar
    "noUnusedParameters": true,         // ✅ Ativar
  }
}
```

**Benefício:** Bugs detectados em desenvolvimento, código mais seguro

#### 2. Implementar Persistência Básica
**Objetivo:** Salvar dados localmente

- [ ] Integrar localStorage para dados temporários
- [ ] Criar service layer para abstrair persistência
- [ ] Implementar migrações de dados

**Benefício:** Dados não perdidos ao recarregar

#### 3. Adicionar Loading e Error States
**Objetivo:** Melhorar UX

```typescript
// Exemplo de loading state
const [loading, setLoading] = useState(false);

if (loading) return <Skeleton />;
if (error) return <ErrorBoundary error={error} />;
```

**Benefício:** Feedback visual para usuário

#### 4. Implementar Error Boundaries
**Objetivo:** Prevenir crashes

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  // ... implementação
}
```

**Benefício:** App mais resiliente

#### 5. Adicionar Primeiros Testes
**Objetivo:** Garantir qualidade

- [ ] Instalar Jest + Testing Library
- [ ] Testes de componentes críticos
- [ ] Testes de schemas Zod
- [ ] Configurar cobertura mínima (70%)

**Benefício:** Confiança ao fazer mudanças

---

### Prioridade MÉDIA 🟡

#### 6. Otimizar Performance
- [ ] Adicionar `React.memo` em componentes pesados
- [ ] Implementar `useMemo` em cálculos custosos
- [ ] Implementar `useCallback` em callbacks
- [ ] Lazy loading de rotas
- [ ] Code splitting

**Benefício:** App mais rápido

#### 7. Implementar Estado Global
- [ ] Escolher solução (Context API ou Zustand)
- [ ] Criar stores para cada entidade
- [ ] Migrar estados locais para global

**Benefício:** Estado compartilhado, menos prop drilling

#### 8. Completar Funcionalidades Core
- [ ] Implementar edição de meios de pagamento
- [ ] Adicionar exclusão com confirmação
- [ ] Implementar Dashboard com dados reais
- [ ] Adicionar filtros e busca

**Benefício:** Produto mais completo

#### 9. Integrar com Backend
- [ ] Definir contratos de API
- [ ] Implementar serviços de API
- [ ] Usar TanStack Query para cache
- [ ] Implementar retry e error handling

**Benefício:** Dados reais, app funcional

---

### Prioridade BAIXA 🟢

#### 10. Funcionalidades de Negócio
- [ ] Sistema de Projeções
- [ ] Sistema de Relatórios
- [ ] Gestão de Lojas completo
- [ ] Exportação de dados
- [ ] Histórico de alterações

**Benefício:** Features completas

#### 11. Melhorias de UX
- [ ] Toggle dark/light mode no UI
- [ ] Breadcrumbs
- [ ] Modal de confirmação
- [ ] Toast de sucesso/erro
- [ ] Animações suaves

**Benefício:** UX polida

#### 12. DevOps
- [ ] Configurar GitHub Actions
- [ ] Implementar CI/CD
- [ ] Pre-commit hooks (Husky)
- [ ] Lint-staged
- [ ] Deploy automatizado

**Benefício:** Processo de desenvolvimento profissional

#### 13. Documentação
- [ ] Documentar arquitetura
- [ ] Guia de contribuição
- [ ] Decisões técnicas (ADR)
- [ ] Exemplos de uso

**Benefício:** Onboarding facilitado

---

## 🛠️ Instalação

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **bun**
- Git

### ⚡ Instalação Rápida (Windows)

Se você estiver no Windows, execute o script automático:

```powershell
.\setup.ps1
```

Este script vai:
- ✅ Verificar se Node.js está instalado
- ✅ Instalar dependências automaticamente
- ✅ Iniciar o servidor de desenvolvimento

### 🔧 Instalação Manual

#### 1. Verificar Node.js

```bash
node --version
npm --version
```

Se não estiver instalado: [Baixar Node.js](https://nodejs.org/)

#### 2. Instalar Dependências

```bash
npm install
```

#### 3. Iniciar Servidor

```bash
npm run dev
```

#### 4. Acessar Aplicação

Abra seu navegador em: **http://localhost:8080**

---

### 📚 Guias Adicionais

- 📖 **[GUIA_INSTALACAO.md](./GUIA_INSTALACAO.md)** - Guia completo de instalação
- 🔧 **[setup.ps1](./setup.ps1)** - Script de setup automático

### ❌ Problemas Comuns

Veja a seção de [Problemas Comuns](./GUIA_INSTALACAO.md#-problemas-comuns) no guia de instalação.

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Build em modo desenvolvimento (não minificado)
npm run build:dev

# Visualizar preview da build
npm run preview

# Lint do código
npm run lint
```

### Estrutura de Pastas

```
partners-li/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── admin/       # Administração
│   │   │   └── FieldManager.tsx  # Gestão de campos
│   │   ├── dashboard/   # Dashboard
│   │   ├── layout/      # Layout
│   │   │   ├── Sidebar.tsx
│   │   │   └── BlurToggle.tsx  # Botão de proteção de dados
│   │   ├── partners/    # Gestão de parceiros
│   │   │   ├── AddPartnerDialog.tsx  # Diálogo de cadastro com abas
│   │   │   ├── LogisticPartnersTable.tsx
│   │   │   ├── PaymentPartnersTable.tsx
│   │   │   ├── MarketplacePartnersTable.tsx
│   │   │   ├── PartnersOverview.tsx
│   │   │   └── PartnerForm/  # Componentes de formulário (8 abas)
│   │   ├── payment-methods/  # (Legado)
│   │   ├── stores/      # Lojas
│   │   └── ui/          # Componentes shadcn/ui
│   ├── contexts/
│   │   └── BlurContext.tsx  # Contexto para controle de blur
│   ├── hooks/
│   │   ├── use-blur-sensitive.ts  # Hook para aplicar blur
│   │   ├── use-field-config.ts
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── partner-schema.ts  # Schema Zod para parceiros
│   │   └── utils.ts
│   ├── pages/           # Páginas
│   ├── types/           # TypeScript types
│   │   ├── partner.ts   # Tipos de parceiros (multi-categoria)
│   │   ├── field-config.ts  # Configuração de campos
│   │   └── payment-method.ts  # (Legado)
│   ├── App.tsx          # Componente raiz
│   └── main.tsx         # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

### Convenções

#### Imports
```typescript
// ✅ Usar alias @/
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/payment-method";

// ❌ Evitar paths relativos longos
import { Button } from "../../../components/ui/button";
```

#### Nomenclatura
```typescript
// ✅ Componentes em PascalCase
export const PaymentMethodsTable = () => {}

// ✅ Hooks com prefixo "use"
export const usePaymentMethods = () => {}

// ✅ Types em PascalCase
export interface PaymentMethod {}

// ✅ Constants em UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 1024;
```

---

## 🤝 Contribuindo

### Fluxo de Trabalho

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Commit Messages

Use commits descritivos:

```bash
# ✅ Bom
git commit -m "feat: adiciona filtros na tabela de meios de pagamento"
git commit -m "fix: corrige cálculo de aprovação média"
git commit -m "refactor: extrai lógica de formatação para util"

# ❌ Evitar
git commit -m "fix"
git commit -m "mudanças"
```

### Padrões de Código

- Seguir configurações do ESLint
- Usar TypeScript com tipos explícitos
- Comentar código complexo
- Manter funções pequenas (< 50 linhas)
- Evitar aninhamento profundo (< 3 níveis)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Contato

**Desenvolvido por:** Thiago Rotondo

---

## 📊 Roadmap de Desenvolvimento

### Sprint 1 (Semana 1-2)
- [x] Setup inicial do projeto
- [x] Configuração de ferramentas
- [x] Layout e navegação
- [x] Formulário de meios de pagamento
- [ ] **Correção TypeScript strict mode**

### Sprint 2 (Semana 3-4)
- [ ] Implementar persistência local
- [ ] Adicionar loading e error states
- [ ] Implementar Error Boundaries
- [ ] Primeiros testes automatizados

### Sprint 3 (Semana 5-6)
- [ ] Otimizar performance
- [ ] Implementar estado global
- [ ] Completar Dashboard com dados reais
- [ ] Integrar com backend mock

### Sprint 4 (Semana 7-8)
- [ ] Funcionalidades de edição e exclusão
- [ ] Filtros e busca
- [ ] Sistema de Projeções
- [ ] Sistema de Relatórios

### Sprint 5+ (Semana 9+)
- [ ] CI/CD e DevOps
- [ ] Testes E2E
- [ ] Melhorias de UX
- [ ] Documentação completa

---

**Última atualização:** Janeiro 2025
**Versão:** 0.4.0
**Desenvolvido por:** Thiago Rotondo
**Status:** Em Desenvolvimento Ativo 🚧

---

## 🎯 Destaques da Versão 0.4.0

### ✅ Sistema de Proteção de Dados
- **Botão toggle global** (canto superior direito) para ocultar dados sensíveis
- Blur automático em valores monetários, taxas e informações críticas
- Perfeito para apresentações e demos sem expor dados reais

### ✅ Gestão Avançada de Campos
- **Criar, editar e remover campos** customizados
- Controle granular por tipo de parceiro (Logístico, Pagamento, Marketplace)
- Interface admin completa

### ✅ Sistema Multi-Categoria
- Parceiros podem atuar em múltiplas categorias simultaneamente
- Dados compartilhados (nome, status, notas)
- Formulários completos com 8 abas

### ✅ Privacidade e Segurança
- Proteção contra indexação (robots.txt + meta tags)
- Autor identificado: Thiago Rotondo
- Sistema privado e não indexável

---
