import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ObservationsSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function ObservationsSection({ form }: ObservationsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          Observações Gerais
        </h3>
        <p className="text-sm text-muted-foreground">Campo para informações adicionais</p>
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Informações complementares, contextos especiais ou observações estratégicas sobre o parceiro..."
                rows={8}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

