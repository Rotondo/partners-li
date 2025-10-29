import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SOLUTION_TYPES } from "@/types/payment-method";

interface CompanyDataSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function CompanyDataSection({ form }: CompanyDataSectionProps) {
  const solutionType = form.watch("company.solutionType");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Dados Cadastrais
        </h3>
        <p className="text-sm text-muted-foreground">Informações básicas do parceiro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="company.tradeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Comercial *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: PagSeguro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.legalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão Social</FormLabel>
              <FormControl>
                <Input placeholder="Ex: PagSeguro Internet S.A." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input placeholder="00.000.000/0000-00" {...field} />
              </FormControl>
              <FormDescription>Apenas números ou formatado</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website Oficial</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company.solutionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Solução *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SOLUTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {solutionType === "Outro" && (
          <FormField
            control={form.control}
            name="company.solutionTypeOther"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especifique o Tipo *</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva o tipo de solução" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
