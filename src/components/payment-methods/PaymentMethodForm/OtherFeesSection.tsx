import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DynamicFeeTable } from "../shared/DynamicFeeTable";

interface OtherFeesSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function OtherFeesSection({ form }: OtherFeesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Outras Taxas e Custos</h3>
        <p className="text-sm text-muted-foreground">Taxas adicionais e políticas</p>
      </div>

      {/* Débito */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Cartão de Débito</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="debitCard.baseRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Base (%)</FormLabel>
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
            name="debitCard.fixedFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Fixa (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="debitCard.settlementDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo (D+)</FormLabel>
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

      {/* Pix */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Pix</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pix.baseRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Base (%)</FormLabel>
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
            name="pix.fixedFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Fixa (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pix.settlementDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo (D+)</FormLabel>
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

      {/* Boleto */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Boleto Bancário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="boleto.baseRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Base (%)</FormLabel>
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
            name="boleto.fixedFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa Fixa (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boleto.settlementDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo (D+)</FormLabel>
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
          <FormField
            control={form.control}
            name="boleto.defaultDueDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo de Vencimento Padrão</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Chargeback */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Chargeback</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="chargeback.feePerChargeback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa por Chargeback (R$)</FormLabel>
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
        </div>
      </div>

      {/* Outras Taxas */}
      <div>
        <h4 className="text-md font-medium mb-3">Outras Taxas (Mensalidade, Setup, etc.)</h4>
        <DynamicFeeTable
          form={form}
          name="otherFees"
          columns={[
            { key: "type", label: "Tipo de Taxa", type: "text" },
            { key: "amount", label: "Valor (R$)", type: "number" },
            { key: "periodicity", label: "Periodicidade", type: "text" },
            { key: "notes", label: "Observações", type: "text" },
          ]}
        />
      </div>
    </div>
  );
}
