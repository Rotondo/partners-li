import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DynamicField } from "../DynamicField";
import { getFieldConfigsByPartnerType } from "@/lib/db";
import { useState, useEffect } from "react";
import { FieldConfig } from "@/types/field-config";

interface FeesSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function FeesSection({ form }: FeesSectionProps) {
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [feeFields, setFeeFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    getFieldConfigsByPartnerType('payment').then(configs => {
      const filtered = configs
        .filter(f => f.category === 'fees')
        .sort((a, b) => a.order - b.order);
      setFeeFields(filtered);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Estrutura de Taxas
        </h3>
        <p className="text-sm text-muted-foreground">Campos obrigatórios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fees.mdrCreditVista"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MDR Crédito à Vista (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 2.5" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fees.mdrDebit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MDR Débito (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 1.5" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fees.mdrPix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MDR Pix (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 0.99" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fees.anticipationRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa Antecipação (% a.m.) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 3.5" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fees.chargebackFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa Chargeback (R$) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 15.00" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Campos dinâmicos de taxas (MDR PIX parcelado, etc) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feeFields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            value={customFields[field.id] || ''}
            onChange={(value) => setCustomFields({ ...customFields, [field.id]: value })}
          />
        ))}
      </div>
    </div>
  );
}

