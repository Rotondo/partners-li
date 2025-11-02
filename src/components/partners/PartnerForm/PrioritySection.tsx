import { UseFormReturn } from "react-hook-form";
import { PartnerFormData } from "@/lib/partner-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PrioritySectionProps {
  form: UseFormReturn<PartnerFormData>;
}

export function PrioritySection({ form }: PrioritySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-yellow-500">⭐</span>
          Priorização e Análise Pareto
        </h3>
        <p className="text-sm text-muted-foreground">
          Marque parceiros importantes e defina ranking para análise de foco (80/20)
        </p>
      </div>

      <FormField
        control={form.control}
        name="isImportant"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="font-semibold">
                Parceiro Importante
              </FormLabel>
              <FormDescription>
                Marque este parceiro como importante para o negócio
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priorityRank"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ranking de Prioridade</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="Ex: 1 (1º lugar), 2 (2º lugar), 3..."
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Posição no ranking (1 = 1º lugar, 2 = 2º lugar, etc). Não limitado ao top 3.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="paretoFocus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foco da Análise Pareto</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a métrica de foco" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="gmv">GMV (Gross Merchandise Value)</SelectItem>
                <SelectItem value="rebate">Rebate</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Métrica principal usada para análise de Pareto (80/20): foco em GMV ou Rebate
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

