import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { savePartnerMonthlyMetric, getPartnerMonthlyMetrics } from "@/lib/db";
import { toast } from "sonner";
import { NewPartnerMonthlyMetric } from "@/types/partner-metrics";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const monthlyMetricSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  month: z.number().int().min(1).max(12),
  gmvShare: z.number().min(0).max(100, "Share de GMV não pode ser maior que 100%"),
  rebateShare: z.number().min(0).max(100, "Share de rebate não pode ser maior que 100%"),
  gmvAmount: z.number().min(0, "Valor deve ser positivo"),
  rebateAmount: z.number().min(0, "Valor deve ser positivo"),
  notes: z.string().optional(),
});

type MonthlyMetricFormData = z.infer<typeof monthlyMetricSchema>;

interface MonthlyMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  partnerName: string;
  onSave?: () => void;
}

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export function MonthlyMetricsDialog({
  open,
  onOpenChange,
  partnerId,
  partnerName,
  onSave,
}: MonthlyMetricsDialogProps) {
  const [existingMetrics, setExistingMetrics] = useState<any[]>([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const form = useForm<MonthlyMetricFormData>({
    resolver: zodResolver(monthlyMetricSchema),
    defaultValues: {
      year: currentYear,
      month: currentMonth,
      gmvShare: 0,
      rebateShare: 0,
      gmvAmount: 0,
      rebateAmount: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (open && partnerId) {
      loadExistingMetrics();
      // Reset form to current month/year
      form.reset({
        year: currentYear,
        month: currentMonth,
        gmvShare: 0,
        rebateShare: 0,
        gmvAmount: 0,
        rebateAmount: 0,
        notes: "",
      });
    }
  }, [open, partnerId]);

  const loadExistingMetrics = async () => {
    try {
      const metrics = await getPartnerMonthlyMetrics(partnerId);
      setExistingMetrics(metrics);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
    }
  };

  const onSubmit = async (data: MonthlyMetricFormData) => {
    try {
      const metric: NewPartnerMonthlyMetric = {
        partnerId,
        year: data.year,
        month: data.month,
        gmvShare: data.gmvShare,
        rebateShare: data.rebateShare,
        gmvAmount: data.gmvAmount,
        rebateAmount: data.rebateAmount,
        notes: data.notes,
      };

      await savePartnerMonthlyMetric(metric);
      toast.success(`Métricas de ${MONTHS[data.month - 1].label}/${data.year} salvas com sucesso!`);
      
      await loadExistingMetrics();
      onSave?.();
      
      // Reset form for next entry
      const nextMonth = data.month === 12 ? 1 : data.month + 1;
      const nextYear = data.month === 12 ? data.year + 1 : data.year;
      form.reset({
        year: nextYear,
        month: nextMonth,
        gmvShare: 0,
        rebateShare: 0,
        gmvAmount: 0,
        rebateAmount: 0,
        notes: "",
      });
    } catch (error) {
      console.error("Erro ao salvar métrica:", error);
      toast.error("Erro ao salvar métrica mensal");
    }
  };

  const getExistingMetric = (year: number, month: number) => {
    return existingMetrics.find(m => m.year === year && m.month === month);
  };

  const handleMonthYearChange = (field: 'year' | 'month', value: number) => {
    const currentYear = form.getValues('year');
    const currentMonth = form.getValues('month');
    
    if (field === 'month') {
      form.setValue('month', value);
    } else {
      form.setValue('year', value);
    }

    // Load existing data if metric exists
    const existing = getExistingMetric(
      field === 'year' ? value : currentYear,
      field === 'month' ? value : currentMonth
    );
    
    if (existing) {
      form.reset({
        year: existing.year,
        month: existing.month,
        gmvShare: existing.gmvShare,
        rebateShare: existing.rebateShare,
        gmvAmount: existing.gmvAmount,
        rebateAmount: existing.rebateAmount,
        notes: existing.notes || "",
      });
    }
  };

  // Generate year options (last 3 years and next 1 year)
  const yearOptions = [];
  for (let i = currentYear - 3; i <= currentYear + 1; i++) {
    yearOptions.push(i);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Métricas Mensais - {partnerName}</DialogTitle>
          <DialogDescription>
            Registre mensalmente o share de GMV e rebate, além dos valores absolutos transacionados.
            Esses dados são essenciais para análise de Pareto (80/20).
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano *</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        handleMonthYearChange('year', parseInt(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês *</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        handleMonthYearChange('month', parseInt(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o mês" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gmvShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share de GMV (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Ex: 25.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual de participação no GMV total do mês
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rebateShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share de Rebate (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Ex: 30.2"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Percentual de participação no rebate total do mês
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gmvAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor GMV (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 125000.50"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor absoluto de GMV transacionado no mês
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rebateAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Rebate (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 3750.25"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor absoluto de rebate gerado no mês
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anotações sobre este mês (ex: campanha especial, mudanças de estratégia, etc)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {existingMetrics.length > 0 && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="text-sm font-semibold mb-2">Métricas Já Cadastradas</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {existingMetrics.slice(0, 5).map((metric) => (
                    <div key={metric.id} className="flex justify-between">
                      <span>
                        {MONTHS[metric.month - 1].label}/{metric.year}
                      </span>
                      <span>
                        GMV: {metric.gmvShare.toFixed(1)}% | Rebate: {metric.rebateShare.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  {existingMetrics.length > 5 && (
                    <p className="text-xs italic">... e mais {existingMetrics.length - 5} meses</p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Métrica</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

