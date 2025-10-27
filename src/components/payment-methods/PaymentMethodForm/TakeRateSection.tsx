import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TakeRateSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function TakeRateSection({ form }: TakeRateSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Take Rate da Plataforma
        </h3>
        <p className="text-sm text-muted-foreground">Campo obrigatório</p>
      </div>

      <FormField
        control={form.control}
        name="takeRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>% Repassado à Plataforma *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="Ex: 15.5" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormDescription>
              Porcentagem do GMV que a plataforma recebe como receita
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
