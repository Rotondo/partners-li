import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AntiFraudSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function AntiFraudSection({ form }: AntiFraudSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-yellow-500">🟡</span>
          Antifraude
        </h3>
        <p className="text-sm text-muted-foreground">Campos opcionais</p>
      </div>

      <FormField
        control={form.control}
        name="antiFraud.solution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solução de Antifraude</FormLabel>
            <FormControl>
              <Input placeholder="Ex: ClearSale, Konduto, Sift..." {...field} />
            </FormControl>
            <FormDescription>
              Nome da solução de antifraude utilizada
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="antiFraud.minScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Score Mínimo</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="Ex: 75" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
              />
            </FormControl>
            <FormDescription>
              Score mínimo de aprovação (0-100)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
