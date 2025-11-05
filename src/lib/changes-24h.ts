export interface Change {
  type: 'feat' | 'fix' | 'chore' | 'docs' | 'refactor';
  scope?: string;
  title: string;
}

export function getChangesFromChangelog(): Change[] {
  // Parse CHANGELOG.md for last 24h section
  // For now, return hardcoded from Sprint 6
  return [
    { type: 'feat', scope: 'legal', title: 'Sistema completo de contratos com versões e signatários' },
    { type: 'feat', scope: 'financial', title: 'Métricas mensais e relatório financeiro' },
    { type: 'feat', scope: 'storage', title: 'Upload de documentos com Storage integrado' },
    { type: 'feat', scope: 'admin', title: 'Configurações de campos persistidas no Supabase' },
    { type: 'feat', scope: 'ui', title: 'Sidebar móvel recolhível com painel de novidades' },
  ];
}

export function getChangesFromCache(): Change[] {
  // Fallback: try to read from .cache/last-24h.json
  // For now, return empty or same as changelog
  try {
    // In production, this would read from a generated cache file
    return getChangesFromChangelog();
  } catch {
    return [];
  }
}

export function getRecentChanges(): Change[] {
  const changes = getChangesFromChangelog();
  return changes.length > 0 ? changes : getChangesFromCache();
}
