import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface ComparisonCellProps {
  value: any;
  type: 'text' | 'number' | 'percentage' | 'date' | 'badge' | 'tags' | 'boolean' | 'currency' | 'days';
  isHighlighted?: 'best' | 'worst' | null;
}

export function ComparisonCell({ value, type, isHighlighted }: ComparisonCellProps) {
  // Valor vazio
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  // Background baseado no highlight
  const bgClass = isHighlighted === 'best' 
    ? 'bg-green-50 dark:bg-green-950/20' 
    : isHighlighted === 'worst'
    ? 'bg-red-50 dark:bg-red-950/20'
    : '';

  const renderContent = () => {
    switch (type) {
      case 'text':
        return <span className="font-medium">{value}</span>;

      case 'number':
        return <span className="font-medium tabular-nums">{value.toLocaleString('pt-BR')}</span>;

      case 'percentage':
        return (
          <span className="font-medium tabular-nums">
            {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
          </span>
        );

      case 'currency':
        return (
          <span className="font-medium tabular-nums">
            {typeof value === 'number' 
              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
              : value
            }
          </span>
        );

      case 'days':
        return (
          <span className="font-medium tabular-nums">
            {value} {value === 1 ? 'dia' : 'dias'}
          </span>
        );

      case 'date':
        return (
          <span className="font-medium tabular-nums">
            {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        );

      case 'badge':
        const statusVariants: Record<string, any> = {
          active: 'default',
          inactive: 'secondary',
          pending: 'outline',
          paused: 'destructive',
          fixed: 'default',
          variable: 'secondary',
          api: 'default',
          manual: 'outline',
        };
        
        const statusLabels: Record<string, string> = {
          active: 'Ativo',
          inactive: 'Inativo',
          pending: 'Pendente',
          paused: 'Pausado',
          fixed: 'Fixo',
          variable: 'Variável',
          api: 'API',
          manual: 'Manual',
        };

        return (
          <Badge variant={statusVariants[value] || 'outline'} className="text-xs">
            {statusLabels[value] || value}
          </Badge>
        );

      case 'tags':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {value.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{value.length - 3}
                </Badge>
              )}
            </div>
          );
        }
        return <span className="text-sm">{value}</span>;

      case 'boolean':
        return value ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <X className="w-5 h-5 text-muted-foreground" />
        );

      default:
        return <span className="text-sm">{String(value)}</span>;
    }
  };

  return (
    <div className={`px-4 py-3 ${bgClass} transition-colors`}>
      {renderContent()}
    </div>
  );
}
