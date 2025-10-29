import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ChecklistField } from "../shared/ChecklistField";
import { INTEGRATION_TYPES, CHECKOUT_TYPES, WEBHOOK_EVENTS } from "@/types/payment-method";

interface IntegrationSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function IntegrationSection({ form }: IntegrationSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Integração e Tecnologia</h3>
        <p className="text-sm text-muted-foreground">Tipos de integração e recursos técnicos</p>
      </div>

      <FormField
        control={form.control}
        name="integration.types"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Tipo de Integração *"
              options={INTEGRATION_TYPES}
              value={field.value}
              onChange={field.onChange}
              allowCustom={false}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="integration.checkoutTypes"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Tipos de Checkout Disponíveis *"
              options={CHECKOUT_TYPES}
              value={field.value}
              onChange={field.onChange}
              allowCustom={false}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h4 className="text-md font-medium mb-3">Ferramentas de Segurança</h4>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="integration.hasFraudPrevention"
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
                <FormLabel className="!mt-0">Antifraude Próprio</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="integration.hasRiskScore"
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
                <FormLabel className="!mt-0">Score de Risco</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="integration.has3DS"
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
                <FormLabel className="!mt-0">3D Secure (3DS)</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="integration.hasTokenization"
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
                <FormLabel className="!mt-0">Tokenização</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="integration.isPCICompliant"
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
                <FormLabel className="!mt-0">PCI-DSS Compliance</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="integration.hasWebhooks"
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
            <FormLabel className="!mt-0">Webhooks Disponíveis</FormLabel>
          </FormItem>
        )}
      />

      {form.watch("integration.hasWebhooks") && (
        <FormField
          control={form.control}
          name="integration.webhookEvents"
          render={({ field }) => (
            <FormItem>
              <ChecklistField
                label="Eventos Notificados"
                options={WEBHOOK_EVENTS}
                value={field.value || []}
                onChange={field.onChange}
                allowCustom={true}
                customPlaceholder="Outro evento..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
