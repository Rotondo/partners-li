import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PerformanceSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function PerformanceSection({ form }: PerformanceSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Indicadores de Performance
        </h3>
        <p className="text-sm text-muted-foreground">Métricas dos últimos 3 meses</p>
      </div>

      {/* Mês 1 */}
      <div className="space-y-4 border-b pb-4">
        <h4 className="font-medium">Mês 1</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="performance.month1.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aprovação (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month1.gmv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GMV (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month1.transactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transações</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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

      {/* Mês 2 */}
      <div className="space-y-4 border-b pb-4">
        <h4 className="font-medium">Mês 2</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="performance.month2.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aprovação (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month2.gmv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GMV (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month2.transactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transações</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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

      {/* Mês 3 */}
      <div className="space-y-4">
        <h4 className="font-medium">Mês 3</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="performance.month3.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aprovação (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month3.gmv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GMV (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="performance.month3.transactions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transações</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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
    </div>
  );
}

