import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChecklistField } from "../shared/ChecklistField";

interface ObservationsSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function ObservationsSection({ form }: ObservationsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Observações Estratégicas</h3>
        <p className="text-sm text-muted-foreground">Diferenciais, limitações e casos de uso</p>
      </div>

      <FormField
        control={form.control}
        name="observations.competitiveDifferentials"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Diferenciais Competitivos"
              options={[]}
              value={field.value || []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Digite um diferencial..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observations.knownLimitations"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Limitações Conhecidas"
              options={[]}
              value={field.value || []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Digite uma limitação..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="observations.recommendedUseCases"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Casos de Uso Recomendados"
              options={[]}
              value={field.value || []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Digite um caso de uso..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
