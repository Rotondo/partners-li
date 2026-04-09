import { Partner } from "@/types/partner";
import { FieldConfig, DEFAULT_FIELD_CONFIGS } from "@/types/field-config";
import { toast } from "sonner";
import {
  PartnerContact,
  PartnerActivity,
  PartnerHealthMetrics,
  PartnerTask,
  PartnerDocument,
  NewPartnerContact,
  NewPartnerActivity,
  NewPartnerHealthMetrics,
  NewPartnerTask,
  NewPartnerDocument,
} from "@/types/crm";
import {
  PartnerMonthlyMetric,
  NewPartnerMonthlyMetric,
} from "@/types/partner-metrics";
import {
  ldbGetAll,
  ldbSetAll,
  ldbFind,
  ldbFindOne,
  ldbInsert,
  ldbUpsert,
  ldbDelete,
  ldbDeleteWhere,
  ldbGetJson,
  ldbSetJson,
} from "./local-db";

const LOCAL_USER_ID = 'local';

const DB_KEYS = {
  PARTNERS: 'partners',
  FIELD_CONFIGS: 'fieldConfigs',
  BLUR_ACTIVE: 'blurActive',
} as const;

// ==================== HELPERS ====================

export function partnerHasCategory(partner: Partner, category: 'logistic' | 'payment' | 'marketplace'): boolean {
  if (partner.categories && Array.isArray(partner.categories)) {
    return partner.categories.includes(category);
  }
  const legacyCategory = (partner as any).category;
  if (legacyCategory) {
    return legacyCategory === category;
  }
  return false;
}

export function filterPartnersByCategory(partners: Partner[], category: 'logistic' | 'payment' | 'marketplace'): Partner[] {
  return partners.filter(p => partnerHasCategory(p, category));
}

// ==================== PARTNERS ====================

export async function savePartner(partner: Partner): Promise<void> {
  const now = new Date().toISOString();
  const all = ldbGetAll<any>('partners');
  const idx = all.findIndex((r: any) => r.id === partner.id);
  const record = {
    id: partner.id,
    user_id: LOCAL_USER_ID,
    name: partner.name,
    type: partner.categories?.[0] || 'logistic',
    data: { ...partner, customFields: partner.customFields || {}, contactFields: partner.contactFields || {} },
    is_important: partner.isImportant || false,
    priority_rank: partner.priorityRank || null,
    pareto_focus: partner.paretoFocus || null,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partners', all);
}

export async function getAllPartners(): Promise<Partner[]> {
  const all = ldbGetAll<any>('partners');
  return all.map((row: any) => {
    const partner = { ...row.data } as Partner;
    if (row.is_important !== undefined) partner.isImportant = row.is_important;
    if (row.priority_rank != null) partner.priorityRank = row.priority_rank;
    if (row.pareto_focus) partner.paretoFocus = row.pareto_focus;
    return partner;
  });
}

export async function getPartnerById(id: string): Promise<Partner | undefined> {
  const partners = await getAllPartners();
  return partners.find(p => p.id === id);
}

export async function deletePartner(id: string): Promise<void> {
  ldbDelete('partners', id);
}

export async function clearDatabase(): Promise<void> {
  ldbSetAll('partners', []);
  ldbSetAll('payment_methods', []);
  ldbSetAll('partner_contacts', []);
  ldbSetAll('partner_activities', []);
  ldbSetAll('partner_health_metrics', []);
  ldbSetAll('partner_tasks', []);
  ldbSetAll('partner_documents', []);
  ldbSetAll('partner_monthly_metrics', []);
  toast.success("Dados removidos com sucesso");
}

// ==================== FIELD CONFIGS ====================

export function saveFieldConfigs(configs: FieldConfig[]): void {
  localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(configs));
}

export function getFieldConfigs(): FieldConfig[] {
  const data = localStorage.getItem(DB_KEYS.FIELD_CONFIGS);
  if (data) {
    return JSON.parse(data);
  }
  return DEFAULT_FIELD_CONFIGS;
}

export function getFieldConfigsByPartnerType(type: 'logistic' | 'payment' | 'marketplace'): FieldConfig[] {
  const configs = getFieldConfigs();
  return configs.filter(f => {
    const isMainType = f.partnerType === type;
    const isInPartnerTypes = f.partnerTypes?.includes(type);
    return (isMainType || isInPartnerTypes) && f.enabled;
  });
}

// ==================== EXPORT/IMPORT ====================

export function exportDatabase(): string {
  const data = {
    partners: ldbGetAll('partners'),
    fieldConfigs: getFieldConfigs(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importDatabase(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    if (data.partners) ldbSetAll('partners', data.partners);
    if (data.fieldConfigs) localStorage.setItem(DB_KEYS.FIELD_CONFIGS, JSON.stringify(data.fieldConfigs));
  } catch (error) {
    console.error('Erro ao importar banco de dados:', error);
    throw new Error('Dados inválidos');
  }
}

// ==================== PAYMENT METHODS ====================

export async function savePaymentMethod(paymentMethod: any): Promise<void> {
  const now = new Date().toISOString();
  const all = ldbGetAll<any>('payment_methods');
  const idx = all.findIndex((r: any) => r.id === paymentMethod.id);
  const record = {
    id: paymentMethod.id || crypto.randomUUID(),
    user_id: LOCAL_USER_ID,
    data: paymentMethod,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('payment_methods', all);
}

export async function getAllPaymentMethods(): Promise<any[]> {
  return ldbGetAll<any>('payment_methods').map((row: any) => row.data);
}

export async function getPaymentMethodById(id: string): Promise<any | undefined> {
  const row = ldbFindOne<any>('payment_methods', (r: any) => r.id === id);
  return row?.data;
}

export async function deletePaymentMethod(id: string): Promise<void> {
  ldbDelete('payment_methods', id);
}

// ==================== PARTNER CONTACTS ====================

export async function savePartnerContact(contact: NewPartnerContact & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const id = contact.id || crypto.randomUUID();
  const all = ldbGetAll<any>('partner_contacts');
  const idx = all.findIndex((r: any) => r.id === id);
  const record = { ...contact, id, user_id: LOCAL_USER_ID, created_at: idx >= 0 ? all[idx].created_at : now, updated_at: now };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partner_contacts', all);
}

export async function getPartnerContacts(partnerId: string): Promise<PartnerContact[]> {
  const rows = ldbFind<any>('partner_contacts', (r: any) => r.partner_id === partnerId);
  rows.sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  return rows.map((row: any) => ({
    ...row,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerContact(id: string): Promise<void> {
  ldbDelete('partner_contacts', id);
}

// ==================== PARTNER ACTIVITIES ====================

export async function savePartnerActivity(activity: NewPartnerActivity & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const id = activity.id || crypto.randomUUID();
  const all = ldbGetAll<any>('partner_activities');
  const idx = all.findIndex((r: any) => r.id === id);
  const record = {
    ...activity,
    id,
    user_id: LOCAL_USER_ID,
    participants: activity.participants || [],
    scheduled_date: activity.scheduled_date instanceof Date ? activity.scheduled_date.toISOString() : activity.scheduled_date,
    completed_date: activity.completed_date instanceof Date ? activity.completed_date.toISOString() : activity.completed_date,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partner_activities', all);
}

export async function getPartnerActivities(partnerId?: string): Promise<PartnerActivity[]> {
  let rows = ldbGetAll<any>('partner_activities');
  if (partnerId) {
    rows = rows.filter((r: any) => r.partner_id === partnerId);
  }
  rows.sort((a: any, b: any) => {
    const da = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
    const db2 = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
    return db2 - da;
  });
  return rows.map((row: any) => ({
    ...row,
    participants: row.participants || [],
    scheduled_date: row.scheduled_date ? new Date(row.scheduled_date) : undefined,
    completed_date: row.completed_date ? new Date(row.completed_date) : undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerActivity(id: string): Promise<void> {
  ldbDelete('partner_activities', id);
}

// ==================== PARTNER HEALTH METRICS ====================

export async function savePartnerHealthMetrics(metrics: NewPartnerHealthMetrics & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const all = ldbGetAll<any>('partner_health_metrics');
  const idx = all.findIndex((r: any) => r.partner_id === metrics.partner_id);
  const record = {
    ...metrics,
    id: metrics.id || (idx >= 0 ? all[idx].id : crypto.randomUUID()),
    user_id: LOCAL_USER_ID,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partner_health_metrics', all);
}

export async function getPartnerHealthMetrics(partnerId: string): Promise<PartnerHealthMetrics | null> {
  const row = ldbFindOne<any>('partner_health_metrics', (r: any) => r.partner_id === partnerId);
  if (!row) return null;
  return {
    ...row,
    last_activity_date: row.last_activity_date ? new Date(row.last_activity_date) : undefined,
    calculated_at: new Date(row.calculated_at || row.created_at),
    created_at: new Date(row.created_at),
  };
}

export async function getAllPartnerHealthMetrics(): Promise<PartnerHealthMetrics[]> {
  const rows = ldbGetAll<any>('partner_health_metrics');
  rows.sort((a: any, b: any) => (b.overall_score || 0) - (a.overall_score || 0));
  return rows.map((row: any) => ({
    ...row,
    last_activity_date: row.last_activity_date ? new Date(row.last_activity_date) : undefined,
    calculated_at: new Date(row.calculated_at || row.created_at),
    created_at: new Date(row.created_at),
  }));
}

// ==================== PARTNER TASKS ====================

export async function savePartnerTask(task: NewPartnerTask & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const id = task.id || crypto.randomUUID();
  const all = ldbGetAll<any>('partner_tasks');
  const idx = all.findIndex((r: any) => r.id === id);
  const record = {
    ...task,
    id,
    user_id: LOCAL_USER_ID,
    due_date: task.due_date instanceof Date ? task.due_date.toISOString() : task.due_date,
    completed_date: task.completed_date instanceof Date ? task.completed_date.toISOString() : task.completed_date,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partner_tasks', all);
}

export async function getPartnerTasks(partnerId?: string): Promise<PartnerTask[]> {
  let rows = ldbGetAll<any>('partner_tasks');
  if (partnerId) {
    rows = rows.filter((r: any) => r.partner_id === partnerId);
  }
  rows.sort((a: any, b: any) => {
    const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const db2 = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return da - db2;
  });
  return rows.map((row: any) => ({
    ...row,
    due_date: row.due_date ? new Date(row.due_date) : undefined,
    completed_date: row.completed_date ? new Date(row.completed_date) : undefined,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }));
}

export async function deletePartnerTask(id: string): Promise<void> {
  ldbDelete('partner_tasks', id);
}

// ==================== PARTNER DOCUMENTS ====================

export async function savePartnerDocument(document: NewPartnerDocument & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const record = {
    ...document,
    id: document.id || crypto.randomUUID(),
    user_id: LOCAL_USER_ID,
    created_at: now,
  };
  const all = ldbGetAll<any>('partner_documents');
  all.unshift(record);
  ldbSetAll('partner_documents', all);
}

export async function getPartnerDocuments(partnerId: string): Promise<PartnerDocument[]> {
  const rows = ldbFind<any>('partner_documents', (r: any) => r.partner_id === partnerId);
  return rows.map((row: any) => ({
    ...row,
    created_at: new Date(row.created_at),
  }));
}

export async function deletePartnerDocument(id: string): Promise<void> {
  ldbDelete('partner_documents', id);
}

// ==================== PARTNER MONTHLY METRICS ====================

export async function savePartnerMonthlyMetric(metric: NewPartnerMonthlyMetric & { id?: string }): Promise<void> {
  const now = new Date().toISOString();
  const all = ldbGetAll<any>('partner_monthly_metrics');
  const idx = all.findIndex((r: any) =>
    r.partner_id === metric.partnerId && r.year === metric.year && r.month === metric.month
  );
  const record = {
    id: metric.id || (idx >= 0 ? all[idx].id : crypto.randomUUID()),
    partner_id: metric.partnerId,
    user_id: LOCAL_USER_ID,
    year: metric.year,
    month: metric.month,
    gmv_share: metric.gmvShare,
    rebate_share: metric.rebateShare,
    gmv_amount: metric.gmvAmount,
    rebate_amount: metric.rebateAmount,
    notes: metric.notes,
    created_at: idx >= 0 ? all[idx].created_at : now,
    updated_at: now,
  };
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.unshift(record);
  }
  ldbSetAll('partner_monthly_metrics', all);

  try {
    const { autoUpdateSinglePartnerPriority } = await import('./partner-priority-auto');
    await autoUpdateSinglePartnerPriority(metric.partnerId);
  } catch (err) {
    console.warn('Erro ao atualizar prioridades automaticamente:', err);
  }
}

export async function getPartnerMonthlyMetrics(partnerId: string): Promise<PartnerMonthlyMetric[]> {
  const rows = ldbFind<any>('partner_monthly_metrics', (r: any) => r.partner_id === partnerId);
  rows.sort((a: any, b: any) => b.year !== a.year ? b.year - a.year : b.month - a.month);
  return rows.map((row: any) => ({
    id: row.id,
    partnerId: row.partner_id,
    userId: row.user_id,
    year: row.year,
    month: row.month,
    gmvShare: Number(row.gmv_share) || 0,
    rebateShare: Number(row.rebate_share) || 0,
    gmvAmount: Number(row.gmv_amount) || 0,
    rebateAmount: Number(row.rebate_amount) || 0,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function getAllPartnersMonthlyMetrics(year?: number, month?: number): Promise<PartnerMonthlyMetric[]> {
  let rows = ldbGetAll<any>('partner_monthly_metrics');
  if (year) rows = rows.filter((r: any) => r.year === year);
  if (month) rows = rows.filter((r: any) => r.month === month);
  rows.sort((a: any, b: any) => b.year !== a.year ? b.year - a.year : b.month - a.month);
  return rows.map((row: any) => ({
    id: row.id,
    partnerId: row.partner_id,
    userId: row.user_id,
    year: row.year,
    month: row.month,
    gmvShare: Number(row.gmv_share) || 0,
    rebateShare: Number(row.rebate_share) || 0,
    gmvAmount: Number(row.gmv_amount) || 0,
    rebateAmount: Number(row.rebate_amount) || 0,
    notes: row.notes,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}

export async function deletePartnerMonthlyMetric(id: string): Promise<void> {
  ldbDelete('partner_monthly_metrics', id);
}

// ==================== CALENDAR SYNC (stubbed for local mode) ====================

export interface CalendarSyncConfig {
  id: string;
  user_id: string;
  calendar_url: string | null;
  enabled: boolean;
  sync_interval_minutes: number;
  last_sync_at: Date | null;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expires_at: Date | null;
  google_calendar_id: string;
  connected_via_oauth: boolean;
  created_at: Date;
  updated_at: Date;
}

export async function saveCalendarSyncConfig(_config: Partial<CalendarSyncConfig>): Promise<CalendarSyncConfig> {
  const now = new Date();
  const existing = ldbGetJson<CalendarSyncConfig | null>('calendar_sync', null);
  const record: CalendarSyncConfig = {
    id: existing?.id || crypto.randomUUID(),
    user_id: LOCAL_USER_ID,
    calendar_url: null,
    enabled: false,
    sync_interval_minutes: 15,
    last_sync_at: null,
    google_access_token: null,
    google_refresh_token: null,
    google_token_expires_at: null,
    google_calendar_id: 'primary',
    connected_via_oauth: false,
    ...existing,
    ..._config,
    created_at: existing?.created_at || now,
    updated_at: now,
  };
  ldbSetJson('calendar_sync', record);
  return record;
}

export async function getCalendarSyncConfig(): Promise<CalendarSyncConfig | null> {
  return ldbGetJson<CalendarSyncConfig | null>('calendar_sync', null);
}

export async function deleteCalendarSyncConfig(): Promise<void> {
  localStorage.removeItem('prm_calendar_sync');
}

export async function syncCalendarNow(): Promise<{ imported: number; skipped: number }> {
  toast.error("Sincronização de calendário não disponível no modo local");
  return { imported: 0, skipped: 0 };
}
