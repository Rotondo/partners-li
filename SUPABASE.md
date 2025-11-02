# 📊 Documentação Técnica Supabase - PRM/CRM System

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Tabelas e Relacionamentos](#tabelas-e-relacionamentos)
4. [Políticas RLS](#políticas-rls)
5. [Funções e Triggers](#funções-e-triggers)
6. [Edge Functions](#edge-functions)
7. [Tipos Customizados](#tipos-customizados)
8. [Índices e Performance](#índices-e-performance)

---

## 🎯 Visão Geral

Este documento detalha toda a estrutura do banco de dados Supabase utilizado no sistema PRM/CRM, incluindo todas as tabelas, campos, relacionamentos, políticas de segurança e regras de negócio.

### Informações do Projeto
- **Project ID:** `jekodgwqmhskmshtvmfh`
- **Database:** PostgreSQL 15
- **Region:** Auto-selecionada
- **Auth:** Habilitado com auto-confirm de email

---

## 🗄️ Estrutura do Banco de Dados

### Diagrama de Relacionamentos

```
auth.users (Supabase Auth)
    │
    ├─── user_roles (1:N)
    │
    └─── partners (1:N)
            │
            ├─── partner_contacts (1:N)
            ├─── partner_activities (1:N)
            ├─── partner_tasks (1:N)
            ├─── partner_documents (1:N)
            ├─── partner_health_metrics (1:1)
            └─── partner_alerts (1:N)
```

---

## 📊 Tabelas e Relacionamentos

### 1. **user_roles**
Tabela para gerenciamento de roles/permissões de usuários.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `role` | app_role (ENUM) | NOT NULL | - | Role do usuário |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE
- **Unique:** `(user_id, role)` - Um usuário não pode ter a mesma role duplicada

#### Enum: app_role
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
```

---

### 2. **partners**
Tabela principal para armazenar informações de parceiros (pagamento, marketplace, logística).

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `name` | TEXT | NOT NULL | - | Nome do parceiro |
| `type` | TEXT | NOT NULL | - | Tipo: payment/marketplace/logistic |
| `data` | JSONB | NOT NULL | `'{}'::jsonb` | Dados dinâmicos específicos do tipo |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Triggers
- `update_partners_updated_at` BEFORE UPDATE
  - Atualiza automaticamente `updated_at` quando o registro é modificado

#### Estrutura JSONB do campo `data`
Varia conforme o tipo de parceiro, mas pode incluir:
- Taxas (MDR, antecipação, chargeback)
- Prazos de liquidação
- Performance metrics
- Meios de pagamento aceitos
- Configurações específicas

---

### 3. **partner_contacts**
Armazena contatos relacionados a cada parceiro.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `name` | TEXT | NOT NULL | - | Nome do contato |
| `role` | TEXT | YES | NULL | Cargo/Função |
| `email` | TEXT | YES | NULL | Email do contato |
| `phone` | TEXT | YES | NULL | Telefone |
| `is_primary` | BOOLEAN | YES | `false` | Indica se é contato principal |
| `notes` | TEXT | YES | NULL | Anotações sobre o contato |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Triggers
- `update_partner_contacts_updated_at` BEFORE UPDATE

#### Regras de Negócio
- Um parceiro pode ter múltiplos contatos
- Apenas um contato pode ser marcado como `is_primary` (recomendado)
- Contatos são vinculados a atividades através do campo `participants` em `partner_activities`

---

### 4. **partner_activities**
Registro de todas as atividades/interações com parceiros.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `user_id` | UUID | NOT NULL | - | FK para auth.users (criador) |
| `activity_type` | activity_type (ENUM) | NOT NULL | - | Tipo de atividade |
| `status` | activity_status (ENUM) | NOT NULL | `'pending'` | Status da atividade |
| `title` | TEXT | NOT NULL | - | Título da atividade |
| `scheduled_date` | DATE | YES | NULL | Data agendada |
| `completed_date` | DATE | YES | NULL | Data de conclusão |
| `participants` | JSONB | YES | `'[]'::jsonb` | Lista de participantes |
| `what_discussed` | TEXT | YES | NULL | O que foi discutido |
| `opportunities` | TEXT | YES | NULL | Oportunidades identificadas |
| `next_steps` | TEXT | YES | NULL | Próximos passos |
| `notes` | TEXT | YES | NULL | Notas adicionais |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Triggers
- `update_partner_activities_updated_at` BEFORE UPDATE

#### Enums

**activity_type:**
```sql
CREATE TYPE public.activity_type AS ENUM ('meeting', 'call', 'email', 'task', 'note');
```

**activity_status:**
```sql
CREATE TYPE public.activity_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending');
```

#### Estrutura JSONB do campo `participants`
```json
[
  {
    "name": "João Silva",
    "role": "Gerente Comercial",
    "contact_id": "uuid-do-contato"
  }
]
```

#### Regras de Negócio
- Uma atividade DEVE estar vinculada a um parceiro
- `scheduled_date` é obrigatória para atividades com status `scheduled`
- `completed_date` é preenchida automaticamente quando status muda para `completed`
- `participants` armazena referência ao contato do parceiro

---

### 5. **partner_tasks**
Tarefas vinculadas a parceiros e atividades.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `activity_id` | UUID | YES | NULL | FK para partner_activities |
| `user_id` | UUID | NOT NULL | - | FK para auth.users (criador) |
| `assigned_to` | UUID | YES | NULL | FK para auth.users (responsável) |
| `title` | TEXT | NOT NULL | - | Título da tarefa |
| `description` | TEXT | YES | NULL | Descrição detalhada |
| `priority` | task_priority (ENUM) | NOT NULL | `'medium'` | Prioridade |
| `status` | task_status (ENUM) | NOT NULL | `'todo'` | Status |
| `due_date` | DATE | YES | NULL | Data de vencimento |
| `completed_date` | DATE | YES | NULL | Data de conclusão |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `activity_id` → `partner_activities(id)` ON DELETE SET NULL
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE
- **Foreign Key:** `assigned_to` → `auth.users(id)` ON DELETE SET NULL

#### Triggers
- `update_partner_tasks_updated_at` BEFORE UPDATE

#### Enums

**task_priority:**
```sql
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
```

**task_status:**
```sql
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');
```

#### Regras de Negócio
- Tarefa pode estar vinculada a uma atividade específica (`activity_id`)
- Tarefa pode ser atribuída a outro usuário (`assigned_to`)
- `completed_date` é preenchida quando status = `done`

---

### 6. **partner_documents**
Armazena metadados de documentos/arquivos relacionados aos parceiros.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `file_name` | TEXT | NOT NULL | - | Nome do arquivo |
| `file_type` | TEXT | YES | NULL | Tipo MIME |
| `file_size` | INTEGER | YES | NULL | Tamanho em bytes |
| `storage_path` | TEXT | NOT NULL | - | Caminho no storage |
| `document_type` | TEXT | YES | NULL | Categoria do documento |
| `description` | TEXT | YES | NULL | Descrição |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de upload |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Regras de Negócio
- Arquivos físicos são armazenados no Supabase Storage
- Esta tabela armazena apenas metadados
- `storage_path` referencia o bucket e caminho do arquivo

---

### 7. **partner_health_metrics**
Métricas de saúde calculadas automaticamente para cada parceiro.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `overall_score` | INTEGER | YES | NULL | Score geral (0-100) |
| `health_status` | health_status (ENUM) | NOT NULL | - | Status de saúde |
| `performance_score` | INTEGER | YES | NULL | Score de performance (0-100) |
| `engagement_score` | INTEGER | YES | NULL | Score de engajamento (0-100) |
| `commercial_score` | INTEGER | YES | NULL | Score comercial (0-100) |
| `last_activity_date` | DATE | YES | NULL | Última atividade registrada |
| `days_since_last_contact` | INTEGER | YES | `0` | Dias sem contato |
| `meetings_this_month` | INTEGER | YES | `0` | Reuniões no mês atual |
| `open_issues_count` | INTEGER | YES | `0` | Tarefas pendentes |
| `calculated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data do cálculo |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE
- **Unique:** `partner_id` - Cada parceiro tem apenas 1 registro de health metrics

#### Enum: health_status
```sql
CREATE TYPE public.health_status AS ENUM ('excellent', 'good', 'warning', 'critical');
```

#### Regras de Cálculo

**Overall Score (0-100):**
```
overall_score = (performance_score * 0.4) + (engagement_score * 0.3) + (commercial_score * 0.3)
```

**Performance Score:**
- Baseado em:
  - Número de issues abertas (tarefas pendentes)
  - Dias desde último contato
  - Taxa de conclusão de tarefas

**Engagement Score:**
- Baseado em:
  - Número de reuniões no mês
  - Frequência de atividades
  - Variedade de tipos de atividade

**Commercial Score:**
- Baseado em:
  - Atividades completadas
  - Oportunidades identificadas
  - Histórico de performance

**Health Status:**
- `excellent`: overall_score >= 80
- `good`: overall_score >= 60
- `warning`: overall_score >= 40
- `critical`: overall_score < 40

#### Atualização
- Calculado automaticamente pela Edge Function `calculate-health-scores`
- Pode ser recalculado manualmente chamando a função

---

### 8. **partner_alerts**
Alertas automáticos gerados pelo sistema baseados em métricas.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `partner_id` | UUID | NOT NULL | - | FK para partners |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `alert_type` | TEXT | NOT NULL | - | Tipo do alerta |
| `severity` | TEXT | NOT NULL | - | Severidade (low/medium/high/critical) |
| `title` | TEXT | NOT NULL | - | Título do alerta |
| `message` | TEXT | NOT NULL | - | Mensagem detalhada |
| `is_read` | BOOLEAN | NOT NULL | `false` | Alerta foi lido |
| `is_resolved` | BOOLEAN | NOT NULL | `false` | Alerta foi resolvido |
| `resolved_at` | TIMESTAMP WITH TIME ZONE | YES | NULL | Data de resolução |
| `resolved_by` | UUID | YES | NULL | Usuário que resolveu |
| `metadata` | JSONB | YES | `'{}'::jsonb` | Dados adicionais |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `partner_id` → `partners(id)` ON DELETE CASCADE
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE
- **Foreign Key:** `resolved_by` → `auth.users(id)` ON DELETE SET NULL

#### Triggers
- `update_partner_alerts_updated_at` BEFORE UPDATE

#### Tipos de Alertas

1. **no_contact**
   - Severidade: `medium` ou `high`
   - Disparado quando: `days_since_last_contact > 30`

2. **high_priority_issues**
   - Severidade: `high`
   - Disparado quando: Múltiplas tarefas de alta prioridade abertas

3. **health_critical**
   - Severidade: `critical`
   - Disparado quando: `health_status = 'critical'`

4. **low_engagement**
   - Severidade: `medium`
   - Disparado quando: `engagement_score < 40`

#### Regras de Negócio
- Alertas são criados automaticamente pela Edge Function
- Podem ser marcados como lidos sem serem resolvidos
- `is_resolved = true` remove o alerta da visualização ativa

---

### 9. **field_configs**
Configurações de campos dinâmicos/customizados por usuário.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `config` | JSONB | NOT NULL | - | Configuração dos campos |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Triggers
- `update_field_configs_updated_at` BEFORE UPDATE

#### Estrutura JSONB do campo `config`
Array de objetos representando campos customizados:
```json
[
  {
    "id": "custom_field_1",
    "partnerType": "payment",
    "category": "fees",
    "label": "MDR Pix Parcelado",
    "type": "number",
    "required": false,
    "enabled": true,
    "order": 100
  }
]
```

---

### 10. **stores**
Gerenciamento de lojas físicas, online e híbridas vinculadas aos parceiros.

#### Campos
| Campo | Tipo | Nullable | Default | Descrição |
|-------|------|----------|---------|-----------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | Primary Key |
| `user_id` | UUID | NOT NULL | - | FK para auth.users |
| `name` | TEXT | NOT NULL | - | Nome da loja |
| `store_type` | store_type (ENUM) | NOT NULL | - | Tipo de loja |
| `status` | store_status (ENUM) | NOT NULL | `'active'` | Status da loja |
| `description` | TEXT | YES | NULL | Descrição da loja |
| `address` | JSONB | YES | NULL | Endereço completo |
| `business_hours` | JSONB | YES | NULL | Horário de funcionamento |
| `contact_info` | JSONB | YES | NULL | Informações de contato |
| `logistic_partners` | TEXT[] | YES | NULL | Array de IDs de parceiros logísticos |
| `payment_partners` | TEXT[] | YES | NULL | Array de IDs de parceiros de pagamento |
| `marketplace_partners` | TEXT[] | YES | NULL | Array de IDs de parceiros marketplace |
| `metrics` | JSONB | YES | NULL | Métricas de performance |
| `settings` | JSONB | YES | `'{}'::jsonb` | Configurações específicas |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Data de criação |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | `now()` | Última atualização |

#### Constraints
- **Primary Key:** `id`
- **Foreign Key:** `user_id` → `auth.users(id)` ON DELETE CASCADE

#### Triggers
- `update_stores_updated_at` BEFORE UPDATE
  - Atualiza automaticamente `updated_at` quando o registro é modificado

#### Enums

**store_type:**
```sql
CREATE TYPE public.store_type AS ENUM ('physical', 'online', 'hybrid');
```

**store_status:**
```sql
CREATE TYPE public.store_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
```

#### Estrutura JSONB do campo `address`
```json
{
  "street": "Rua Exemplo, 123",
  "complement": "Sala 456",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "country": "Brasil",
  "coordinates": {
    "latitude": -23.5505,
    "longitude": -46.6333
  }
}
```

#### Estrutura JSONB do campo `business_hours`
```json
{
  "monday": { "open": "09:00", "close": "18:00" },
  "tuesday": { "open": "09:00", "close": "18:00" },
  "wednesday": { "open": "09:00", "close": "18:00" },
  "thursday": { "open": "09:00", "close": "18:00" },
  "friday": { "open": "09:00", "close": "18:00" },
  "saturday": { "open": "09:00", "close": "14:00" },
  "sunday": null
}
```

#### Estrutura JSONB do campo `contact_info`
```json
{
  "phone": "(11) 1234-5678",
  "whatsapp": "(11) 98765-4321",
  "email": "loja@exemplo.com",
  "website": "https://exemplo.com",
  "social_media": {
    "instagram": "@loja_exemplo",
    "facebook": "lojaexemplo"
  }
}
```

#### Estrutura JSONB do campo `metrics`
```json
{
  "monthly_revenue": 150000.00,
  "monthly_orders": 450,
  "average_ticket": 333.33,
  "conversion_rate": 3.2,
  "customer_satisfaction": 4.5,
  "last_updated": "2025-01-15T10:00:00Z"
}
```

#### Regras de Negócio
- Uma loja DEVE ter um tipo (`physical`, `online`, `hybrid`)
- Lojas podem ter múltiplos parceiros de cada categoria
- `logistic_partners`, `payment_partners`, `marketplace_partners` armazenam UUIDs dos parceiros vinculados
- `address` é obrigatório para lojas `physical` e `hybrid`
- `business_hours` é relevante principalmente para lojas físicas
- `metrics` é atualizado periodicamente (diariamente ou via API)

#### Relacionamento com Parceiros
```sql
-- Exemplo de query para buscar loja com parceiros
SELECT
  s.*,
  (SELECT json_agg(p.*)
   FROM partners p
   WHERE p.id = ANY(s.logistic_partners)) as logistic_partners_data,
  (SELECT json_agg(p.*)
   FROM partners p
   WHERE p.id = ANY(s.payment_partners)) as payment_partners_data
FROM stores s
WHERE s.user_id = auth.uid();
```

---

## 🔒 Políticas RLS (Row Level Security)

Todas as tabelas possuem RLS habilitado para garantir segurança dos dados.

### Função de Verificação de Role

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Políticas por Tabela

#### **user_roles**

1. **"Users can view their own roles"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid()`
   - **Descrição:** Usuários podem ver suas próprias roles

2. **"Admins can manage all roles"**
   - **Operação:** ALL (SELECT, INSERT, UPDATE, DELETE)
   - **Condição:** `has_role(auth.uid(), 'admin')`
   - **Descrição:** Admins podem gerenciar todas as roles

---

#### **partners**

1. **"Users can view their own partners"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

2. **"Users can create their own partners"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update their own partners"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

4. **"Users can delete their own partners"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

---

#### **partner_contacts**

1. **"Users can view their own partner contacts"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

2. **"Users can create their own partner contacts"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update their own partner contacts"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

4. **"Users can delete their own partner contacts"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

---

#### **partner_activities**

1. **"Users can view their own partner activities"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

2. **"Users can create their own partner activities"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update their own partner activities"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

4. **"Users can delete their own partner activities"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

---

#### **partner_tasks**

1. **"Users can view their own partner tasks"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(), 'admin')`
   - **Nota:** Usuários podem ver tarefas que criaram OU que foram atribuídas a eles

2. **"Users can create their own partner tasks"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update their own partner tasks"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid() OR assigned_to = auth.uid() OR has_role(auth.uid(), 'admin')`
   - **Nota:** Usuários podem atualizar tarefas que criaram OU que foram atribuídas a eles

4. **"Users can delete their own partner tasks"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

---

#### **partner_documents**

Mesmas políticas de `partner_contacts` (view, create, update, delete).

---

#### **partner_health_metrics**

Mesmas políticas de `partner_contacts` (view, create, update, delete).

---

#### **partner_alerts**

Mesmas políticas de `partner_contacts` (view, create, update, delete).

---

#### **field_configs**

1. **"Users can view own field configs"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid()`

2. **"Users can create own field configs"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update own field configs"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid()`

4. **"Users can delete own field configs"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid()`

5. **"Admins can manage field configs"**
   - **Operação:** ALL
   - **Condição:** `has_role(auth.uid(), 'admin')`

---

#### **stores**

1. **"Users can view their own stores"**
   - **Operação:** SELECT
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

2. **"Users can create their own stores"**
   - **Operação:** INSERT
   - **Condição:** `user_id = auth.uid()`

3. **"Users can update their own stores"**
   - **Operação:** UPDATE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

4. **"Users can delete their own stores"**
   - **Operação:** DELETE
   - **Condição:** `user_id = auth.uid() OR has_role(auth.uid(), 'admin')`

---

## ⚙️ Funções e Triggers

### 1. **update_updated_at_column()**

**Descrição:** Função trigger que atualiza automaticamente o campo `updated_at` quando um registro é modificado.

**Código SQL:**
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

**Tabelas que usam:**
- partners
- partner_contacts
- partner_activities
- partner_tasks
- partner_alerts
- field_configs

**Trigger:**
```sql
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

---

### 2. **has_role(_user_id, _role)**

**Descrição:** Função de segurança que verifica se um usuário possui uma role específica.

**Código SQL:**
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

**Uso:** Utilizada em políticas RLS para verificar permissões administrativas.

---

## 🚀 Edge Functions

### 1. **calculate-health-scores**

**Path:** `/functions/v1/calculate-health-scores`  
**Método:** POST  
**Auth:** Required (Bearer token)

**Descrição:** Calcula automaticamente os health scores de todos os parceiros do usuário autenticado.

**Funcionamento:**
1. Busca todos os parceiros do usuário
2. Para cada parceiro:
   - Calcula `performance_score` baseado em tarefas abertas e dias sem contato
   - Calcula `engagement_score` baseado em reuniões e atividades
   - Calcula `commercial_score` baseado em atividades completadas
   - Calcula `overall_score` como média ponderada (40%, 30%, 30%)
   - Define `health_status` baseado no overall_score
3. Atualiza/insere na tabela `partner_health_metrics`
4. Gera alertas automáticos baseados em condições:
   - Sem contato > 30 dias
   - Tarefas de alta prioridade abertas
   - Health score crítico

**Request:**
```bash
curl -X POST 'https://[project-ref].supabase.co/functions/v1/calculate-health-scores' \
  -H 'Authorization: Bearer [ACCESS_TOKEN]' \
  -H 'Content-Type: application/json'
```

**Response:**
```json
{
  "success": true,
  "partnersProcessed": 15,
  "alertsCreated": 3
}
```

**Chamada pelo Frontend:**
```typescript
const { data, error } = await supabase.functions.invoke('calculate-health-scores');
```

---

## 🏷️ Tipos Customizados (ENUMs)

### 1. **app_role**
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
```
- **Uso:** Gerenciamento de permissões
- **Valores:**
  - `admin`: Acesso total ao sistema
  - `moderator`: Permissões intermediárias (futuro)
  - `user`: Usuário padrão

---

### 2. **activity_type**
```sql
CREATE TYPE public.activity_type AS ENUM ('meeting', 'call', 'email', 'task', 'note');
```
- **Uso:** Classificação de atividades
- **Valores:**
  - `meeting`: Reunião presencial ou virtual
  - `call`: Ligação telefônica
  - `email`: Comunicação por email
  - `task`: Tarefa relacionada
  - `note`: Anotação/observação

---

### 3. **activity_status**
```sql
CREATE TYPE public.activity_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending');
```
- **Uso:** Status de atividades
- **Valores:**
  - `scheduled`: Agendada para o futuro
  - `completed`: Concluída
  - `cancelled`: Cancelada
  - `pending`: Pendente de agendamento

---

### 4. **task_priority**
```sql
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
```
- **Uso:** Priorização de tarefas
- **Valores:**
  - `low`: Baixa prioridade
  - `medium`: Média prioridade (default)
  - `high`: Alta prioridade
  - `urgent`: Urgente

---

### 5. **task_status**
```sql
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');
```
- **Uso:** Status de tarefas
- **Valores:**
  - `todo`: A fazer (default)
  - `in_progress`: Em andamento
  - `done`: Concluída
  - `cancelled`: Cancelada

---

### 6. **health_status**
```sql
CREATE TYPE public.health_status AS ENUM ('excellent', 'good', 'warning', 'critical');
```
- **Uso:** Classificação de saúde de parceiros
- **Valores:**
  - `excellent`: Overall score >= 80
  - `good`: Overall score >= 60
  - `warning`: Overall score >= 40
  - `critical`: Overall score < 40

---

### 7. **store_type**
```sql
CREATE TYPE public.store_type AS ENUM ('physical', 'online', 'hybrid');
```
- **Uso:** Classificação de tipo de loja
- **Valores:**
  - `physical`: Loja física com ponto de venda
  - `online`: Loja exclusivamente online (e-commerce)
  - `hybrid`: Loja com presença física e online

---

### 8. **store_status**
```sql
CREATE TYPE public.store_status AS ENUM ('active', 'inactive', 'maintenance', 'planned');
```
- **Uso:** Status operacional da loja
- **Valores:**
  - `active`: Loja em operação (default)
  - `inactive`: Loja temporariamente desativada
  - `maintenance`: Loja em manutenção
  - `planned`: Loja planejada/em construção

---

## 📈 Índices e Performance

### Índices Recomendados

```sql
-- partners
CREATE INDEX idx_partners_user_id ON public.partners(user_id);
CREATE INDEX idx_partners_type ON public.partners(type);

-- partner_contacts
CREATE INDEX idx_partner_contacts_partner_id ON public.partner_contacts(partner_id);
CREATE INDEX idx_partner_contacts_user_id ON public.partner_contacts(user_id);
CREATE INDEX idx_partner_contacts_is_primary ON public.partner_contacts(is_primary);

-- partner_activities
CREATE INDEX idx_partner_activities_partner_id ON public.partner_activities(partner_id);
CREATE INDEX idx_partner_activities_user_id ON public.partner_activities(user_id);
CREATE INDEX idx_partner_activities_scheduled_date ON public.partner_activities(scheduled_date);
CREATE INDEX idx_partner_activities_status ON public.partner_activities(status);

-- partner_tasks
CREATE INDEX idx_partner_tasks_partner_id ON public.partner_tasks(partner_id);
CREATE INDEX idx_partner_tasks_user_id ON public.partner_tasks(user_id);
CREATE INDEX idx_partner_tasks_assigned_to ON public.partner_tasks(assigned_to);
CREATE INDEX idx_partner_tasks_status ON public.partner_tasks(status);
CREATE INDEX idx_partner_tasks_priority ON public.partner_tasks(priority);
CREATE INDEX idx_partner_tasks_due_date ON public.partner_tasks(due_date);

-- partner_health_metrics
CREATE INDEX idx_partner_health_metrics_partner_id ON public.partner_health_metrics(partner_id);
CREATE INDEX idx_partner_health_metrics_health_status ON public.partner_health_metrics(health_status);

-- partner_alerts
CREATE INDEX idx_partner_alerts_partner_id ON public.partner_alerts(partner_id);
CREATE INDEX idx_partner_alerts_user_id ON public.partner_alerts(user_id);
CREATE INDEX idx_partner_alerts_is_read ON public.partner_alerts(is_read);
CREATE INDEX idx_partner_alerts_is_resolved ON public.partner_alerts(is_resolved);
CREATE INDEX idx_partner_alerts_severity ON public.partner_alerts(severity);

-- stores
CREATE INDEX idx_stores_user_id ON public.stores(user_id);
CREATE INDEX idx_stores_store_type ON public.stores(store_type);
CREATE INDEX idx_stores_status ON public.stores(status);
CREATE INDEX idx_stores_logistic_partners ON public.stores USING GIN (logistic_partners);
CREATE INDEX idx_stores_payment_partners ON public.stores USING GIN (payment_partners);
CREATE INDEX idx_stores_marketplace_partners ON public.stores USING GIN (marketplace_partners);
```

### Queries Otimizadas

**Buscar parceiros com health metrics:**
```sql
SELECT 
  p.*,
  h.overall_score,
  h.health_status,
  h.days_since_last_contact
FROM partners p
LEFT JOIN partner_health_metrics h ON h.partner_id = p.id
WHERE p.user_id = auth.uid()
ORDER BY h.overall_score DESC;
```

**Buscar atividades futuras com contatos:**
```sql
SELECT 
  a.*,
  p.name as partner_name,
  a.participants::jsonb as contacts
FROM partner_activities a
JOIN partners p ON p.id = a.partner_id
WHERE a.user_id = auth.uid()
  AND a.status = 'scheduled'
  AND a.scheduled_date >= CURRENT_DATE
ORDER BY a.scheduled_date ASC;
```

---

## 🔐 Segurança e Boas Práticas

### 1. **Sempre use RLS**
- Todas as tabelas DEVEM ter RLS habilitado
- Nunca desabilite RLS em produção
- Teste políticas cuidadosamente

### 2. **Validação de Dados**
- Use constraints no banco (NOT NULL, CHECK, UNIQUE)
- Valide no frontend com Zod
- Valide no backend com triggers se necessário

### 3. **Proteção contra Injeção SQL**
- Use sempre parametrização de queries
- Supabase client já faz isso automaticamente
- Evite concatenação de strings em queries

### 4. **Gestão de Roles**
- NUNCA armazene roles em localStorage
- Use a tabela `user_roles` dedicada
- Verifique permissões no servidor (RLS + Edge Functions)

### 5. **Auditoria**
- Campos `created_at` e `updated_at` em todas as tabelas
- Não delete dados críticos, use soft delete se necessário
- Logs de ações sensíveis

---

## 📝 Manutenção

### Backup
- Backups automáticos diários (Supabase)
- Exportação manual disponível via função `exportDatabase()`

### Migrations
- Todas as mudanças de schema devem ser versionadas
- Use migrations incrementais
- Teste em staging antes de produção

### Monitoring
- Monitore performance de queries lentas
- Acompanhe uso de storage
- Verifique logs de Edge Functions

---

## 📞 Suporte

Para dúvidas sobre a estrutura do banco de dados ou problemas de configuração:
1. Consulte este documento
2. Verifique logs no Supabase Dashboard
3. Teste queries no SQL Editor
4. Abra issue no repositório do projeto

---

**Última atualização:** 2025-01-01  
**Versão do Schema:** 1.0  
**Supabase Project:** jekodgwqmhskmshtvmfh
