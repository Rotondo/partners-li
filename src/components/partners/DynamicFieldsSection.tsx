import { useEffect, useState } from "react";
import { FieldConfig } from "@/types/field-config";
import { DynamicField } from "./DynamicField";
import { getFieldConfigsByPartnerType } from "@/lib/db";

interface DynamicFieldsSectionProps {
  partnerType: 'logistic' | 'payment' | 'marketplace';
  category: string;
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function DynamicFieldsSection({ partnerType, category, values, onChange }: DynamicFieldsSectionProps) {
  const [categoryFields, setCategoryFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    getFieldConfigsByPartnerType(partnerType).then(configs => {
      const filtered = configs
        .filter(field => field.category === category)
        .sort((a, b) => a.order - b.order);
      setCategoryFields(filtered);
    });
  }, [partnerType, category]);

  if (categoryFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {category === 'identification' && 'Identificação'}
          {category === 'fees' && 'Estrutura de Taxas'}
          {category === 'settlement' && 'Prazos de Repasse'}
          {category === 'custom' && 'Campos Customizados'}
          {category === 'contact' && 'Contato'}
          {category !== 'identification' && category !== 'fees' && category !== 'settlement' && category !== 'custom' && category !== 'contact' && category}
        </h3>
      </div>

      {categoryFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id] || ''}
          onChange={(value) => onChange(field.id, value)}
        />
      ))}
    </div>
  );
}

