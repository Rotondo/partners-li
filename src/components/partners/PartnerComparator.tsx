import { useState, useMemo, useEffect } from 'react';
import { Partner, PartnerCategory } from '@/types/partner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PartnerSelector } from './PartnerSelector';
import { AttributeSelector } from './AttributeSelector';
import { ComparisonCell } from './ComparisonCell';
import { 
  getAttributesByCategory, 
  DEFAULT_ATTRIBUTES_BY_CATEGORY,
  ComparatorAttribute 
} from '@/lib/partner-comparator-config';
import { Building2, RotateCcw } from 'lucide-react';

interface PartnerComparatorProps {
  partners: Partner[];
  initialCategory?: PartnerCategory | 'all';
}

export function PartnerComparator({ partners, initialCategory = 'all' }: PartnerComparatorProps) {
  const [category, setCategory] = useState<PartnerCategory | 'all'>(initialCategory);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>([]);

  // Filtrar parceiros pela categoria
  const filteredPartners = useMemo(() => {
    if (category === 'all') return partners;
    return partners.filter(p => p.categories.includes(category));
  }, [partners, category]);

  // Obter atributos disponíveis para a categoria
  const availableAttributes = useMemo(() => {
    return getAttributesByCategory(category);
  }, [category]);

  // Parceiros selecionados
  const selectedPartners = useMemo(() => {
    return filteredPartners.filter(p => selectedPartnerIds.includes(p.id));
  }, [filteredPartners, selectedPartnerIds]);

  // Atributos selecionados com suas configs
  const selectedAttributes = useMemo(() => {
    return availableAttributes.filter(attr => selectedAttributeIds.includes(attr.id));
  }, [availableAttributes, selectedAttributeIds]);

  // Resetar para atributos padrão quando categoria mudar
  useEffect(() => {
    const defaultAttrs = DEFAULT_ATTRIBUTES_BY_CATEGORY[category] || [];
    setSelectedAttributeIds(defaultAttrs);
    setSelectedPartnerIds([]);
  }, [category]);

  // Calcular highlights (melhor/pior) para cada atributo
  const getHighlight = (attr: ComparatorAttribute, value: any, allValues: any[]) => {
    if (!attr.highlight || value === null || value === undefined) return null;
    
    const numericValues = allValues
      .filter(v => typeof v === 'number')
      .filter(v => !isNaN(v));
    
    if (numericValues.length === 0) return null;

    const best = attr.highlight === 'lower' 
      ? Math.min(...numericValues)
      : Math.max(...numericValues);

    return value === best ? 'best' : null;
  };

  const handleReset = () => {
    setSelectedPartnerIds([]);
    const defaultAttrs = DEFAULT_ATTRIBUTES_BY_CATEGORY[category] || [];
    setSelectedAttributeIds(defaultAttrs);
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Comparador de Parceiros</h2>
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="payment">Pagamento</SelectItem>
                <SelectItem value="logistic">Logística</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Seletores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PartnerSelector
            partners={filteredPartners}
            selectedIds={selectedPartnerIds}
            onSelectionChange={setSelectedPartnerIds}
          />

          <AttributeSelector
            attributes={availableAttributes}
            selectedIds={selectedAttributeIds}
            onSelectionChange={setSelectedAttributeIds}
          />
        </div>
      </Card>

      {/* Tabela de Comparação */}
      {selectedPartners.length > 0 && selectedAttributes.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left text-sm font-medium min-w-[200px]">
                    Atributo
                  </th>
                  {selectedPartners.map((partner) => (
                    <th key={partner.id} className="px-4 py-3 text-center min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        {partner.logoUrl ? (
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name}
                            className="w-12 h-12 rounded object-contain bg-background"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-background flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-sm">{partner.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedAttributes.map((attr, idx) => {
                  const values = selectedPartners.map(p => attr.getValue(p));
                  
                  return (
                    <tr key={attr.id} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="sticky left-0 z-10 px-4 py-3 text-sm font-medium bg-background border-r">
                        {attr.label}
                      </td>
                      {selectedPartners.map((partner, pIdx) => {
                        const value = values[pIdx];
                        const highlight = getHighlight(attr, value, values);
                        
                        return (
                          <td key={partner.id} className="text-center border-r last:border-r-0">
                            <ComparisonCell 
                              value={value}
                              type={attr.type}
                              isHighlighted={highlight as 'best' | 'worst' | null}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhuma comparação ativa</p>
            <p className="text-sm">
              Selecione ao menos 1 parceiro e 1 atributo para começar a comparação
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
