
-- Enum types
CREATE TYPE public.pipeline_stage AS ENUM ('prospeccao', 'avaliacao', 'negociacao', 'contrato', 'ativo', 'inativo', 'recusado');
CREATE TYPE public.partnership_model AS ENUM ('comissao', 'fixo_mensal', 'hibrido', 'permuta', 'gratuito');
CREATE TYPE public.meeting_type AS ENUM ('reuniao', 'call', 'email', 'evento', 'outro');
CREATE TYPE public.meeting_outcome AS ENUM ('positivo', 'neutro', 'negativo', 'pendente');
CREATE TYPE public.stage_side AS ENUM ('above', 'below');

-- maturity_levels
CREATE TABLE public.maturity_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  color_hex TEXT NOT NULL DEFAULT '#94A3B8',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ecosystem_stages
CREATE TABLE public.ecosystem_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  side stage_side NOT NULL DEFAULT 'above',
  icon_name TEXT DEFAULT 'Circle',
  color_hex TEXT NOT NULL DEFAULT '#00C07F',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partner_stage_maturity
CREATE TABLE public.partner_stage_maturity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL,
  stage_id UUID NOT NULL REFERENCES public.ecosystem_stages(id) ON DELETE CASCADE,
  maturity_level_id UUID NOT NULL REFERENCES public.maturity_levels(id) ON DELETE RESTRICT,
  services_at_this_level TEXT[] DEFAULT '{}',
  is_highlighted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partner_contacts
CREATE TABLE public.partner_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  linkedin_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partner_pipeline
CREATE TABLE public.partner_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL,
  stage pipeline_stage NOT NULL DEFAULT 'prospeccao',
  entered_stage_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  owner_id TEXT,
  notes TEXT,
  next_action TEXT,
  next_action_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partner_meetings
CREATE TABLE public.partner_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type meeting_type NOT NULL DEFAULT 'reuniao',
  title TEXT NOT NULL,
  summary TEXT,
  participants TEXT[] DEFAULT '{}',
  attendees_internal TEXT[] DEFAULT '{}',
  outcome meeting_outcome NOT NULL DEFAULT 'pendente',
  follow_up_required BOOLEAN NOT NULL DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- partner_contracts
CREATE TABLE public.partner_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL,
  partnership_model partnership_model NOT NULL DEFAULT 'gratuito',
  commission_pct DECIMAL(5,2),
  monthly_fee_brl DECIMAL(10,2),
  hybrid_description TEXT,
  contract_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  contract_end_date DATE,
  auto_renewal BOOLEAN NOT NULL DEFAULT false,
  partner_page_url TEXT,
  legal_contract_signed BOOLEAN NOT NULL DEFAULT false,
  contract_notes TEXT,
  alert_days_before_expiry INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed maturity levels
INSERT INTO public.maturity_levels (code, name, description, order_index, color_hex) VALUES
  ('M1', 'Operação Mínima', 'Loja no ar com o essencial funcionando', 1, '#94A3B8'),
  ('M2', 'Operação Estruturada', 'Processos básicos organizados e integrados', 2, '#60A5FA'),
  ('M3', 'Operação em Escala', 'Crescendo com consistência e dados', 3, '#34D399'),
  ('M4', 'Operação Otimizada', 'Alta eficiência e automação relevante', 4, '#00C07F'),
  ('M5', 'Operação Avançada', 'Enterprise: resiliência, governança e inovação', 5, '#A78BFA');

-- Seed ecosystem stages
INSERT INTO public.ecosystem_stages (name, description, order_index, side, icon_name, color_hex) VALUES
  ('Estratégia e Planejamento', 'Definição de objetivos e planejamento estratégico', 1, 'above', 'Target', '#6366F1'),
  ('Criação da Loja / Tecnologia', 'Setup técnico e desenvolvimento da loja', 2, 'below', 'Code', '#06B6D4'),
  ('Catálogo e Conteúdo', 'Gestão de produtos, fotos e descrições', 3, 'above', 'Package', '#F59E0B'),
  ('Aquisição de Clientes / Marketing', 'Tráfego pago, SEO e estratégias de aquisição', 4, 'below', 'Megaphone', '#EC4899'),
  ('Conversão e Experiência', 'Otimização de checkout e UX', 5, 'above', 'ShoppingCart', '#00C07F'),
  ('Pagamentos e Segurança', 'Gateways, antifraude e compliance', 6, 'below', 'CreditCard', '#22C55E'),
  ('Operação e Gestão', 'ERP, gestão de pedidos e processos internos', 7, 'above', 'Settings', '#8B5CF6'),
  ('Logística e Entrega', 'Fulfillment, frete e last-mile', 8, 'below', 'Truck', '#14B8A6'),
  ('Atendimento e Pós-venda', 'SAC, suporte e experiência pós-compra', 9, 'above', 'Headphones', '#F97316'),
  ('Retenção e Expansão', 'CRM, fidelização e growth', 10, 'below', 'TrendingUp', '#3B82F6'),
  ('Dados e BI (Transversal)', 'Analytics, BI e inteligência de dados', 11, 'above', 'BarChart3', '#22D3EE'),
  ('Marketplaces e Omnichannel (Transversal)', 'Integração com marketplaces e canais', 12, 'below', 'Globe', '#A855F7');
