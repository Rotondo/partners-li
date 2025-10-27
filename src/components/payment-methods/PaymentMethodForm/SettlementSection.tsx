import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SettlementSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function SettlementSection({ form }: SettlementSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Prazos de Repasse
        </h3>
        <p className="text-sm text-muted-foreground">Campos obrigatórios - informe em dias (D+)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="settlement.credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crédito (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 30" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Dias para repasse</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settlement.debit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Débito (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 1" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Dias para repasse</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settlement.pix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pix (D+) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ex: 1" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>Dias para repasse</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
