import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PerformanceSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function PerformanceSection({ form }: PerformanceSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Indicadores de Performance
        </h3>
        <p className="text-sm text-muted-foreground">Últimos 3 meses - campos obrigatórios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mês 1 */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h4 className="font-medium">Mês 1</h4>
          
          <FormField
            control={form.control}
            name="performance.month1.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Aprovação (%) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 85.5" 
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
                <FormLabel>GMV (R$) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 150000" 
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
                <FormLabel>Transações *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 1500" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mês 2 */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h4 className="font-medium">Mês 2</h4>
          
          <FormField
            control={form.control}
            name="performance.month2.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Aprovação (%) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 87.2" 
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
                <FormLabel>GMV (R$) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 175000" 
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
                <FormLabel>Transações *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 1750" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mês 3 */}
        <div className="space-y-3 p-4 border rounded-lg">
          <h4 className="font-medium">Mês 3</h4>
          
          <FormField
            control={form.control}
            name="performance.month3.approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Aprovação (%) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 88.9" 
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
                <FormLabel>GMV (R$) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Ex: 200000" 
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
                <FormLabel>Transações *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 2000" 
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
