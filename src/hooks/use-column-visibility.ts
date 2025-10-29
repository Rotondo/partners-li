import { useState, useEffect } from "react";

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export function useColumnVisibility(
  tableType: 'payment' | 'logistic' | 'marketplace',
  defaultColumns: ColumnConfig[]
) {
  const storageKey = `columnVisibility_${tableType}`;
  
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    // Carregar do localStorage ou usar defaults
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultColumns;
      }
    }
    return defaultColumns;
  });

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(columns));
  }, [columns, storageKey]);

  const toggleColumn = (columnId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const resetColumns = () => {
    setColumns(defaultColumns);
  };

  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
  const hiddenColumns = columns.filter(col => !col.visible).sort((a, b) => a.order - b.order);

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    toggleColumn,
    resetColumns,
  };
}

