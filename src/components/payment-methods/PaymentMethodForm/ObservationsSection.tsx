import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ObservationsSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function ObservationsSection({ form }: ObservationsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">📝 Observações</h3>
        <p className="text-sm text-muted-foreground">Campo opcional para anotações adicionais</p>
      </div>

      <FormField
        control={form.control}
        name="observations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações Gerais</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Campo livre para informações adicionais, contextos especiais ou observações estratégicas..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Utilize este espaço para registrar informações relevantes sobre o parceiro
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
