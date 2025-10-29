import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ContactSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function ContactSection({ form }: ContactSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Contatos</h3>
        <p className="text-sm text-muted-foreground">Informações de contato do parceiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contact.accountManager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gerente de Conta</FormLabel>
              <FormControl>
                <Input placeholder="Nome do gerente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact.businessEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail Comercial</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone/WhatsApp</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact.supportChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Canal de Suporte Técnico</FormLabel>
              <FormControl>
                <Input placeholder="URL ou telefone de suporte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact.responseSLA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SLA de Resposta</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 24h, 2 dias úteis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
