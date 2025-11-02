import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChecklistField } from "../shared/ChecklistField";

interface OnboardingSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

const REQUIRED_DOCUMENTS = [
  "CNPJ",
  "Contrato Social",
  "Comprovante de Endereço",
  "RG/CPF dos Sócios",
  "Extratos Bancários"
];

const API_CREDENTIALS = [
  "Public Key",
  "Secret Key",
  "Merchant ID",
  "Token de API"
];

export function OnboardingSection({ form }: OnboardingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Onboarding e Cadastramento</h3>
        <p className="text-sm text-muted-foreground">Processo de integração e requisitos</p>
      </div>

      <FormField
        control={form.control}
        name="onboarding.averageApprovalTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempo Médio de Aprovação</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 3-5 dias úteis" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="onboarding.requiredDocuments"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Documentação Necessária"
              options={REQUIRED_DOCUMENTS}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outro documento..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="onboarding.requiresSSL"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Certificado SSL Obrigatório</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onboarding.hasSandbox"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Ambiente de Testes (Sandbox)</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="onboarding.apiCredentials"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Credenciais de API"
              options={API_CREDENTIALS}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Outra credencial..."
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="onboarding.integrationComplexity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complexidade de Integração *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Baixa (plug-and-play)">Baixa (plug-and-play)</SelectItem>
                <SelectItem value="Média (requer customização)">Média (requer customização)</SelectItem>
                <SelectItem value="Alta (desenvolvimento extenso)">Alta (desenvolvimento extenso)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
