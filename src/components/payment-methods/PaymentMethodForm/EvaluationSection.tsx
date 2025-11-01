import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RatingField } from "../shared/RatingField";
import { ChecklistField } from "../shared/ChecklistField";

interface EvaluationSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function EvaluationSection({ form }: EvaluationSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Avaliação Estratégica</h3>
        <p className="text-sm text-muted-foreground">Notas e próximos passos</p>
      </div>

      <FormField
        control={form.control}
        name="status10"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status Atual *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Em Teste (Pilot)">Em Teste (Pilot)</SelectItem>
                <SelectItem value="Em Negociação">Em Negociação</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Em Homologação">Em Homologação</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Descontinuado">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h4 className="text-md font-medium mb-4">Avaliação Geral (0-10)</h4>
        <div className="space-y-4">
          <RatingField
            form={form}
            scoreName="evaluationScores.costBenefit"
            notesName="evaluationNotes.costBenefit"
            label="Custo-Benefício"
          />
          <RatingField
            form={form}
            scoreName="evaluationScores.integrationEase"
            notesName="evaluationNotes.integrationEase"
            label="Facilidade de Integração"
          />
          <RatingField
            form={form}
            scoreName="evaluationScores.approvalPerformance"
            notesName="evaluationNotes.approvalPerformance"
            label="Performance (Aprovação)"
          />
          <RatingField
            form={form}
            scoreName="evaluationScores.support"
            notesName="evaluationNotes.support"
            label="Suporte"
          />
          <RatingField
            form={form}
            scoreName="evaluationScores.documentation"
            notesName="evaluationNotes.documentation"
            label="Documentação"
          />
          <RatingField
            form={form}
            scoreName="evaluationScores.reliability"
            notesName="evaluationNotes.reliability"
            label="Confiabilidade"
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="nextSteps.steps"
        render={({ field }) => (
          <FormItem>
            <ChecklistField
              label="Próximos Passos"
              options={[
                "Concluir integração técnica",
                "Revisar contrato comercial",
                "Fazer testes em produção",
                "Monitorar performance por 30 dias"
              ]}
              value={field.value}
              onChange={field.onChange}
              allowCustom={true}
              customPlaceholder="Adicionar próximo passo..."
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
