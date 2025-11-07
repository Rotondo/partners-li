import { Partner } from '@/types/partner';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

interface PartnerSelectorProps {
  partners: Partner[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelection?: number;
}

export function PartnerSelector({ 
  partners, 
  selectedIds, 
  onSelectionChange,
  maxSelection = 5 
}: PartnerSelectorProps) {
  
  const handleToggle = (partnerId: string) => {
    if (selectedIds.includes(partnerId)) {
      onSelectionChange(selectedIds.filter(id => id !== partnerId));
    } else if (selectedIds.length < maxSelection) {
      onSelectionChange([...selectedIds, partnerId]);
    }
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline',
      paused: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente',
      paused: 'Pausado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Selecione os Parceiros ({selectedIds.length}/{maxSelection})
        </h3>
        {selectedIds.length > 0 && (
          <button
            onClick={() => onSelectionChange([])}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {partners.map((partner) => {
          const isSelected = selectedIds.includes(partner.id);
          const isDisabled = !isSelected && selectedIds.length >= maxSelection;

          return (
            <Card
              key={partner.id}
              className={`p-3 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-accent' 
                  : isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => !isDisabled && handleToggle(partner.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {partner.logoUrl ? (
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name}
                        className="w-8 h-8 rounded object-contain bg-background"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <h4 className="font-medium text-sm truncate">{partner.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(partner.status)} className="text-xs">
                      {getStatusLabel(partner.status)}
                    </Badge>
                    {partner.isImportant && (
                      <Badge variant="outline" className="text-xs">
                        Prioritário
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {partners.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum parceiro disponível
        </p>
      )}
    </div>
  );
}
