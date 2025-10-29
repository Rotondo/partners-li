import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ChecklistField } from "../shared/ChecklistField";
import { CERTIFICATIONS, RESTRICTED_SECTORS } from "@/types/payment-method";

interface ComplianceSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function ComplianceSection({ form }: ComplianceSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Compliance e Regulação</h3>
        <p className="text-sm text-muted-foreground">Certificações e restrições</p>
      </div>

      <FormField
        control={form.control}
        name="compliance.certifications"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Certificações *"
              options={CERTIFICATIONS}
              value={field.value}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outra certificação..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="compliance.servesBrazilWide"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="!mt-0">Atende Todo o Brasil</FormLabel>
          </FormItem>
        )}
      />

      {!form.watch("compliance.servesBrazilWide") && (
        <FormField
          control={form.control}
          name="compliance.restrictedRegions"
          render={({ field }) => (
            <FormItem>
              <ChecklistField
                label="Regiões com Restrição"
                options={[]}
                value={field.value || []}
                onChange={field.onChange}
                allowCustom={true}
                customPlaceholder="Digite a região..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="compliance.restrictedSectors"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Setores com Restrição"
              options={RESTRICTED_SECTORS}
              value={field.value || []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outro setor..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
