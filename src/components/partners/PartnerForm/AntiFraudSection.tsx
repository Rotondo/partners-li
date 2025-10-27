import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AntiFraudSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function AntiFraudSection({ form }: AntiFraudSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-yellow-600">🟡</span>
          Ferramentas de Antifraude
        </h3>
        <p className="text-sm text-muted-foreground">Campos opcionais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="antiFraud.solution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solução Utilizada</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: ClearSale, Konduto..." 
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Nome da solução de antifraude
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
              <FormLabel>Score Mínimo de Aprovação</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 70" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Score mínimo para aprovação automática
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

