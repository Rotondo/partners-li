import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentationSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function DocumentationSection({ form }: DocumentationSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Documentação</h3>
        <p className="text-sm text-muted-foreground">Links para documentação oficial</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="documentation.apiDocsUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link da Documentação Técnica (API)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://docs.exemplo.com/api" {...field} />
              </FormControl>
              <FormDescription>URL da documentação para integração</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentation.publicFeesUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de Taxas Públicas</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://exemplo.com/taxas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentation.termsOfServiceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de Termos de Uso</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://exemplo.com/termos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentation.lastFeesUpdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data do Último Update de Taxas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
