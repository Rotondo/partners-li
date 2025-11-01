import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DynamicField } from "../DynamicField";
import { getFieldConfigsByPartnerType } from "@/lib/db";
import { useState, useEffect } from "react";
import { FieldConfig } from "@/types/field-config";

interface IdentificationSectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function IdentificationSection({ form }: IdentificationSectionProps) {
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [identificationFields, setIdentificationFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    getFieldConfigsByPartnerType('payment').then(configs => {
      const filtered = configs
        .filter(f => f.category === 'identification' && f.id !== 'name')
        .sort((a, b) => a.order - b.order);
      setIdentificationFields(filtered);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Identificação
        </h3>
        <p className="text-sm text-muted-foreground">Campos obrigatórios</p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-2">Nome do Parceiro *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Stripe, PagSeguro, Stone..." {...field} />
            </FormControl>
            <FormMessage className="mt-1" />
          </FormItem>
        )}
      />

      {/* Campos dinâmicos de identificação (URL, etc) */}
      {identificationFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={customFields[field.id] || ''}
          onChange={(value) => setCustomFields({ ...customFields, [field.id]: value })}
        />
      ))}

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="mb-2">Data de Início da Parceria *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
            <FormMessage className="mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-2">Status *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="pending">Em Homologação</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="mt-1" />
          </FormItem>
        )}
      />
    </div>
  );
}

