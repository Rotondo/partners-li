import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TakeRateSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function TakeRateSection({ form }: TakeRateSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Take Rate da Plataforma
        </h3>
        <p className="text-sm text-muted-foreground mb-4">% repassado à plataforma sobre o GMV</p>
      </div>

      <div className="max-w-md">
        <FormField
          control={form.control}
          name="takeRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2">Take Rate (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ex: 15.0" 
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage className="mt-1" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

