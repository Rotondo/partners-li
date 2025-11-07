export interface ChangelogItem {
  type: 'feat' | 'fix' | 'chore' | 'docs' | 'refactor' | 'style' | 'test';
  scope?: string;
  title: string;
  description?: string;
}

/**
 * Extrai mudanças das últimas 24h do CHANGELOG.md
 */
export async function getChangesFromChangelog(): Promise<ChangelogItem[]> {
  try {
    const response = await fetch('/CHANGELOG.md');
    if (!response.ok) return [];
    
    const content = await response.text();
    const lines = content.split('\n');
    
    const changes: ChangelogItem[] = [];
    let inLast24h = false;
    
    for (const line of lines) {
      // Detecta seção "Últimas 24 horas"
      if (line.match(/##\s+Últimas 24 horas/i)) {
        inLast24h = true;
        continue;
      }
      
      // Para quando encontrar próxima seção
      if (inLast24h && line.startsWith('##') && !line.match(/Últimas 24 horas/i)) {
        break;
      }
      
      // Parse de linhas no formato: - **feat(scope)**: descrição
      if (inLast24h && line.trim().startsWith('-')) {
        const match = line.match(/\*\*([a-z]+)\(([^)]+)\)\*\*:\s*(.+)/i);
        if (match) {
          const [, type, scope, title] = match;
          changes.push({
            type: type.toLowerCase() as ChangelogItem['type'],
            scope,
            title: title.trim(),
          });
        } else {
          // Formato alternativo: - **feat**: descrição
          const simpleMatch = line.match(/\*\*([a-z]+)\*\*:\s*(.+)/i);
          if (simpleMatch) {
            const [, type, title] = simpleMatch;
            changes.push({
              type: type.toLowerCase() as ChangelogItem['type'],
              title: title.trim(),
            });
          }
        }
      }
    }
    
    return changes.slice(0, 5); // Máximo 5 itens
  } catch (error) {
    console.error('Erro ao carregar CHANGELOG:', error);
    return [];
  }
}

/**
 * Formata tipo de mudança para exibição
 */
export function formatChangeType(type: string): { label: string; color: string } {
  const types: Record<string, { label: string; color: string }> = {
    feat: { label: 'Nova Feature', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    fix: { label: 'Correção', color: 'bg-red-500/10 text-red-700 dark:text-red-400' },
    chore: { label: 'Manutenção', color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
    docs: { label: 'Documentação', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    refactor: { label: 'Refatoração', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
    style: { label: 'Estilo', color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
    test: { label: 'Testes', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
  };
  
  return types[type] || { label: type, color: 'bg-gray-500/10 text-gray-700' };
}
