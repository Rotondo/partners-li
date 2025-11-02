import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChecklistField } from "../shared/ChecklistField";
import { SUPPORT_CHANNELS } from "@/types/payment-method";

interface SupportSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function SupportSection({ form }: SupportSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Suporte e SLA</h3>
        <p className="text-sm text-muted-foreground">Canais de atendimento e prazos de resposta</p>
      </div>

      <FormField
        control={form.control}
        name="support.channels"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Canais de Suporte *"
              options={SUPPORT_CHANNELS}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outro canal..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="support.businessDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias de Atendimento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Segunda a Sexta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="support.businessHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Atendimento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 9h às 18h" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="support.has24x7Support"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="!mt-0">Suporte 24/7</FormLabel>
          </FormItem>
        )}
      />

      <div>
        <h4 className="text-md font-medium mb-3">SLA de Resposta por Prioridade</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="support.slaLevels.critical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crítico</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1 hora" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="support.slaLevels.high"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alto</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 4 horas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="support.slaLevels.medium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médio</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 1 dia útil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="support.slaLevels.low"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baixo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 3 dias úteis" {...field} />
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
