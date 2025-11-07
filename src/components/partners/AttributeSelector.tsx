import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ComparatorAttribute } from '@/lib/partner-comparator-config';

interface AttributeSelectorProps {
  attributes: ComparatorAttribute[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function AttributeSelector({ 
  attributes, 
  selectedIds, 
  onSelectionChange 
}: AttributeSelectorProps) {
  
  const handleToggle = (attrId: string) => {
    if (selectedIds.includes(attrId)) {
      onSelectionChange(selectedIds.filter(id => id !== attrId));
    } else {
      onSelectionChange([...selectedIds, attrId]);
    }
  };

  const handleSelectAll = (category: string) => {
    const categoryAttrs = attributes
      .filter(attr => attr.category === category)
      .map(attr => attr.id);
    
    const allSelected = categoryAttrs.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      // Desmarcar todos dessa categoria
      onSelectionChange(selectedIds.filter(id => !categoryAttrs.includes(id)));
    } else {
      // Marcar todos dessa categoria
      const newSelection = [...new Set([...selectedIds, ...categoryAttrs])];
      onSelectionChange(newSelection);
    }
  };

  // Agrupar por categoria
  const grouped = attributes.reduce((acc, attr) => {
    if (!acc[attr.category]) acc[attr.category] = [];
    acc[attr.category].push(attr);
    return acc;
  }, {} as Record<string, ComparatorAttribute[]>);

  const categoryLabels: Record<string, string> = {
    shared: 'Atributos Comuns',
    logistic: 'Logística',
    payment: 'Pagamento',
    marketplace: 'Marketplace',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Selecione os Atributos ({selectedIds.length})
        </h3>
        {selectedIds.length > 0 && (
          <button
            onClick={() => onSelectionChange([])}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Limpar todos
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={Object.keys(grouped)} className="w-full">
        {Object.entries(grouped).map(([category, attrs]) => {
          const categoryAttrs = attrs.map(a => a.id);
          const allSelected = categoryAttrs.every(id => selectedIds.includes(id));
          const someSelected = categoryAttrs.some(id => selectedIds.includes(id));

          return (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  {categoryLabels[category] || category}
                  <span className="text-xs text-muted-foreground">
                    ({attrs.filter(a => selectedIds.includes(a.id)).length}/{attrs.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {/* Select All */}
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Checkbox
                      id={`select-all-${category}`}
                      checked={allSelected}
                      onCheckedChange={() => handleSelectAll(category)}
                      className={someSelected && !allSelected ? 'opacity-50' : ''}
                    />
                    <Label 
                      htmlFor={`select-all-${category}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
                    </Label>
                  </div>

                  {/* Individual attributes */}
                  {attrs.map((attr) => (
                    <div key={attr.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`attr-${attr.id}`}
                        checked={selectedIds.includes(attr.id)}
                        onCheckedChange={() => handleToggle(attr.id)}
                      />
                      <Label 
                        htmlFor={`attr-${attr.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {attr.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
