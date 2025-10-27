import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SettlementSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function SettlementSection({ form }: SettlementSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Prazos de Repasse (Liquidação)
        </h3>
        <p className="text-sm text-muted-foreground">Dias úteis para liquidação dos valores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="settlement.credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liquidação Crédito (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 30" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settlement.debit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liquidação Débito (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 1" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settlement.pix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liquidação Pix (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 0" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

