-- Create ENUMs for activity and task management
CREATE TYPE activity_type AS ENUM ('meeting', 'call', 'email', 'task', 'note');
CREATE TYPE activity_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending');
CREATE TYPE health_status AS ENUM ('excellent', 'good', 'warning', 'critical');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'cancelled');

-- 1. Partner Contacts Table
CREATE TABLE public.partner_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on partner_contacts
ALTER TABLE public.partner_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_contacts
CREATE POLICY "Users can view their own partner contacts"
  ON public.partner_contacts FOR SELECT
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own partner contacts"
  ON public.partner_contacts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner contacts"
  ON public.partner_contacts FOR UPDATE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own partner contacts"
  ON public.partner_contacts FOR DELETE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on partner_contacts
CREATE TRIGGER update_partner_contacts_updated_at
  BEFORE UPDATE ON public.partner_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Partner Activities Table (Pipeline/CRM)
CREATE TABLE public.partner_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  activity_type activity_type NOT NULL,
  status activity_status DEFAULT 'pending' NOT NULL,
  
  title TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  
  participants JSONB DEFAULT '[]'::jsonb,
  
  what_discussed TEXT,
  opportunities TEXT,
  next_steps TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on partner_activities
ALTER TABLE public.partner_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_activities
CREATE POLICY "Users can view their own partner activities"
  ON public.partner_activities FOR SELECT
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own partner activities"
  ON public.partner_activities FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner activities"
  ON public.partner_activities FOR UPDATE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own partner activities"
  ON public.partner_activities FOR DELETE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on partner_activities
CREATE TRIGGER update_partner_activities_updated_at
  BEFORE UPDATE ON public.partner_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Partner Health Metrics Table
CREATE TABLE public.partner_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  health_status health_status NOT NULL,
  
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  commercial_score INTEGER CHECK (commercial_score >= 0 AND commercial_score <= 100),
  
  last_activity_date DATE,
  days_since_last_contact INTEGER DEFAULT 0,
  meetings_this_month INTEGER DEFAULT 0,
  open_issues_count INTEGER DEFAULT 0,
  
  calculated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  UNIQUE(partner_id)
);

-- Enable RLS on partner_health_metrics
ALTER TABLE public.partner_health_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_health_metrics
CREATE POLICY "Users can view their own partner health metrics"
  ON public.partner_health_metrics FOR SELECT
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own partner health metrics"
  ON public.partner_health_metrics FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner health metrics"
  ON public.partner_health_metrics FOR UPDATE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own partner health metrics"
  ON public.partner_health_metrics FOR DELETE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- 4. Partner Tasks Table
CREATE TABLE public.partner_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.partner_activities(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  assigned_to UUID,
  
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium' NOT NULL,
  status task_status DEFAULT 'todo' NOT NULL,
  
  due_date DATE,
  completed_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on partner_tasks
ALTER TABLE public.partner_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_tasks
CREATE POLICY "Users can view their own partner tasks"
  ON public.partner_tasks FOR SELECT
  USING ((user_id = auth.uid()) OR (assigned_to = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own partner tasks"
  ON public.partner_tasks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner tasks"
  ON public.partner_tasks FOR UPDATE
  USING ((user_id = auth.uid()) OR (assigned_to = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own partner tasks"
  ON public.partner_tasks FOR DELETE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on partner_tasks
CREATE TRIGGER update_partner_tasks_updated_at
  BEFORE UPDATE ON public.partner_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Partner Documents Table
CREATE TABLE public.partner_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  
  document_type TEXT,
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on partner_documents
ALTER TABLE public.partner_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_documents
CREATE POLICY "Users can view their own partner documents"
  ON public.partner_documents FOR SELECT
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own partner documents"
  ON public.partner_documents FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own partner documents"
  ON public.partner_documents FOR UPDATE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own partner documents"
  ON public.partner_documents FOR DELETE
  USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_partner_contacts_partner_id ON public.partner_contacts(partner_id);
CREATE INDEX idx_partner_contacts_user_id ON public.partner_contacts(user_id);

CREATE INDEX idx_partner_activities_partner_id ON public.partner_activities(partner_id);
CREATE INDEX idx_partner_activities_user_id ON public.partner_activities(user_id);
CREATE INDEX idx_partner_activities_scheduled_date ON public.partner_activities(scheduled_date);
CREATE INDEX idx_partner_activities_status ON public.partner_activities(status);

CREATE INDEX idx_partner_health_metrics_partner_id ON public.partner_health_metrics(partner_id);

CREATE INDEX idx_partner_tasks_partner_id ON public.partner_tasks(partner_id);
CREATE INDEX idx_partner_tasks_user_id ON public.partner_tasks(user_id);
CREATE INDEX idx_partner_tasks_assigned_to ON public.partner_tasks(assigned_to);
CREATE INDEX idx_partner_tasks_status ON public.partner_tasks(status);
CREATE INDEX idx_partner_tasks_due_date ON public.partner_tasks(due_date);

CREATE INDEX idx_partner_documents_partner_id ON public.partner_documents(partner_id);