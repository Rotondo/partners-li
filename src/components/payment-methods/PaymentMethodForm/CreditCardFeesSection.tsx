import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicFeeTable } from "../shared/DynamicFeeTable";
import { ChecklistField } from "../shared/ChecklistField";
import { CARD_BRANDS } from "@/types/payment-method";

interface CreditCardFeesSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function CreditCardFeesSection({ form }: CreditCardFeesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Cartão de Crédito</h3>
        <p className="text-sm text-muted-foreground">Estrutura de taxas e parcelamento</p>
      </div>

      <div>
        <h4 className="text-md font-medium mb-3">Estrutura de Taxas por Faturamento</h4>
        <DynamicFeeTable
          form={form}
          name="creditCard.feesByRevenue"
          columns={[
            { key: "condition", label: "Condição de Faturamento", type: "text" },
            { key: "baseRate", label: "Taxa Base (%)", type: "number" },
            { key: "fixedFee", label: "Taxa Fixa (R$)", type: "number" },
            { key: "settlementDays", label: "Prazo (D+)", type: "number" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="creditCard.maxInstallments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Máximo de Parcelas</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditCard.additionalRatePerInstallment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa Adicional por Parcela (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditCard.interestBearer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quem arca com juros *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Lojista">Lojista</SelectItem>
                  <SelectItem value="Comprador">Comprador</SelectItem>
                  <SelectItem value="Dividido">Dividido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditCard.interestPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentual de Juros</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 2,99% a.m." {...field} />
              </FormControl>
              <FormDescription>Descrição do percentual aplicado</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h4 className="text-md font-medium mb-3">Tabela de Parcelamento (2x-12x)</h4>
        <DynamicFeeTable
          form={form}
          name="creditCard.installmentTable"
          columns={[
            { key: "installments", label: "Parcelas", type: "number" },
            { key: "additionalRate", label: "Taxa Adicional (%)", type: "number" },
            { key: "accumulatedRate", label: "Taxa Acumulada (%)", type: "number" },
          ]}
        />
      </div>

      <FormField
        control={form.control}
        name="creditCard.acceptedBrands"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Bandeiras Aceitas *"
              options={CARD_BRANDS}
              value={field.value}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outra bandeira..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
