/**
 * local-db.ts
 * Generic localStorage CRUD utility for local-only mode.
 * All data is stored as JSON in localStorage under prefixed keys.
 */

const PREFIX = 'prm_';

function key(table: string): string {
  return PREFIX + table;
}

export function ldbGetAll<T>(table: string): T[] {
  try {
    const raw = localStorage.getItem(key(table));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ldbSetAll<T>(table: string, items: T[]): void {
  localStorage.setItem(key(table), JSON.stringify(items));
}

export function ldbFind<T>(table: string, predicate: (item: T) => boolean): T[] {
  return ldbGetAll<T>(table).filter(predicate);
}

export function ldbFindOne<T>(table: string, predicate: (item: T) => boolean): T | null {
  return ldbGetAll<T>(table).find(predicate) ?? null;
}

/** Insert a new record with auto-generated id and timestamps */
export function ldbInsert<T extends { id?: string }>(
  table: string,
  item: Omit<T, 'id'> & { id?: string }
): T {
  const now = new Date().toISOString();
  const record = {
    ...item,
    id: (item as any).id || crypto.randomUUID(),
    created_at: (item as any).created_at || now,
    updated_at: (item as any).updated_at || now,
  } as T;
  const all = ldbGetAll<T>(table);
  all.unshift(record);
  ldbSetAll(table, all);
  return record;
}

/**
 * Upsert a record by id (default) or by a custom conflict key.
 * If a record with the same conflictKey value exists, update it; otherwise insert.
 */
export function ldbUpsert<T extends { id: string }>(
  table: string,
  item: T,
  conflictKey: keyof T = 'id'
): T {
  const now = new Date().toISOString();
  const record = { ...item, updated_at: now } as T;
  const all = ldbGetAll<T>(table);
  const idx = all.findIndex(r => (r as any)[conflictKey] === (item as any)[conflictKey]);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...record };
    ldbSetAll(table, all);
    return all[idx];
  } else {
    record.id = record.id || crypto.randomUUID() as any;
    (record as any).created_at = (record as any).created_at || now;
    all.unshift(record);
    ldbSetAll(table, all);
    return record;
  }
}

export function ldbDelete(table: string, id: string): void {
  const all = ldbGetAll<{ id: string }>(table);
  ldbSetAll(table, all.filter(r => r.id !== id));
}

export function ldbDeleteWhere<T>(table: string, predicate: (item: T) => boolean): void {
  const all = ldbGetAll<T>(table);
  ldbSetAll(table, all.filter(item => !predicate(item)));
}

export function ldbGetJson<T>(k: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + k);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function ldbSetJson<T>(k: string, value: T): void {
  localStorage.setItem(PREFIX + k, JSON.stringify(value));
}
