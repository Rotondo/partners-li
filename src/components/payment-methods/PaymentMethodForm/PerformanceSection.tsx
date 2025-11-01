import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DynamicFeeTable } from "../shared/DynamicFeeTable";

interface PerformanceSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function PerformanceSection({ form }: PerformanceSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Performance e Indicadores</h3>
        <p className="text-sm text-muted-foreground">Taxas de aprovação e conversão</p>
      </div>

      <div>
        <h4 className="text-md font-medium mb-3">Taxas de Aprovação por Meio de Pagamento</h4>
        <DynamicFeeTable
          form={form}
          name="performance.approvalRates"
          columns={[
            { key: "paymentMethod", label: "Meio de Pagamento", type: "text" },
            { key: "averageRate", label: "Taxa Média (%)", type: "number" },
            { key: "source", label: "Fonte/Período", type: "text" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="performance.averageICP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ICP Médio Histórico (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 75.5"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="performance.marketBenchmarkICP"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benchmark do Mercado (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 70.0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
