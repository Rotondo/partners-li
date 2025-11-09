export type ExpectationCategory = 'general' | 'marketplace' | 'logistic' | 'payment';
export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type UpdateType = 'progress' | 'data' | 'conclusion' | 'next_steps' | 'blocker';
export type MilestonePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ExpectationMilestone {
  id: string;
  user_id: string;
  category: ExpectationCategory;
  deadline_days: number;
  title: string;
  opportunities_risks?: string;
  status: MilestoneStatus;
  progress_percentage: number;
  priority: MilestonePriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface MilestoneUpdate {
  id: string;
  milestone_id: string;
  user_id: string;
  update_type: UpdateType;
  content: string;
  data_points?: Record<string, any>;
  attachments?: Array<{ name: string; url: string }>;
  created_at: string;
}

export interface MilestoneCheckbox {
  id: string;
  milestone_id: string;
  label: string;
  is_checked: boolean;
  checked_at?: string;
  checked_by?: string;
  created_at: string;
  updated_at: string;
}
