// Types for CRM/PRM functionality

export type ActivityType = 'meeting' | 'call' | 'email' | 'task' | 'note';
export type ActivityStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending';
export type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

// Partner Contact
export interface PartnerContact {
  id: string;
  partner_id: string;
  user_id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Participant in an activity
export interface ActivityParticipant {
  name: string;
  role?: string;
  contact_id?: string;
}

// Partner Activity (Pipeline/CRM)
export interface PartnerActivity {
  id: string;
  partner_id: string;
  user_id: string;
  activity_type: ActivityType;
  status: ActivityStatus;
  
  title: string;
  scheduled_date?: Date;
  completed_date?: Date;
  
  participants: ActivityParticipant[];
  
  what_discussed?: string;
  opportunities?: string;
  next_steps?: string;
  notes?: string;
  
  created_at: Date;
  updated_at: Date;
}

// Partner Health Metrics
export interface PartnerHealthMetrics {
  id: string;
  partner_id: string;
  user_id: string;
  
  overall_score?: number; // 0-100
  health_status: HealthStatus;
  
  performance_score?: number; // 0-100
  engagement_score?: number; // 0-100
  commercial_score?: number; // 0-100
  
  last_activity_date?: Date;
  days_since_last_contact: number;
  meetings_this_month: number;
  open_issues_count: number;
  
  calculated_at: Date;
  created_at: Date;
}

// Partner Task
export interface PartnerTask {
  id: string;
  partner_id: string;
  activity_id?: string;
  user_id: string;
  assigned_to?: string;
  
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  
  due_date?: Date;
  completed_date?: Date;
  
  created_at: Date;
  updated_at: Date;
}

// Partner Document
export interface PartnerDocument {
  id: string;
  partner_id: string;
  user_id: string;
  
  file_name: string;
  file_type?: string;
  file_size?: number;
  storage_path: string;
  
  document_type?: string;
  description?: string;
  
  created_at: Date;
}

// Helper types for creating new records (without auto-generated fields)
export type NewPartnerContact = Omit<PartnerContact, 'id' | 'created_at' | 'updated_at'>;
export type NewPartnerActivity = Omit<PartnerActivity, 'id' | 'created_at' | 'updated_at'>;
export type NewPartnerHealthMetrics = Omit<PartnerHealthMetrics, 'id' | 'calculated_at' | 'created_at'>;
export type NewPartnerTask = Omit<PartnerTask, 'id' | 'created_at' | 'updated_at'>;
export type NewPartnerDocument = Omit<PartnerDocument, 'id' | 'created_at'>;
