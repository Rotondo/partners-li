import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentMethodSchema, PaymentMethodFormData } from "@/lib/payment-method-schema";
import { PaymentMethod } from "@/types/payment-method";
import { toast } from "sonner";
import { CompanyDataSection } from "./PaymentMethodForm/CompanyDataSection";
import { ContactSection } from "./PaymentMethodForm/ContactSection";
import { DocumentationSection } from "./PaymentMethodForm/DocumentationSection";
import { CreditCardFeesSection } from "./PaymentMethodForm/CreditCardFeesSection";
import { OtherFeesSection } from "./PaymentMethodForm/OtherFeesSection";
import { SettlementSection } from "./PaymentMethodForm/SettlementSection";
import { PerformanceSection } from "./PaymentMethodForm/PerformanceSection";
import { IntegrationSection } from "./PaymentMethodForm/IntegrationSection";
import { OnboardingSection } from "./PaymentMethodForm/OnboardingSection";
import { SupportSection } from "./PaymentMethodForm/SupportSection";
import { ComplianceSection } from "./PaymentMethodForm/ComplianceSection";
import { ObservationsSection } from "./PaymentMethodForm/ObservationsSection";
import { EvaluationSection } from "./PaymentMethodForm/EvaluationSection";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (method: PaymentMethod) => void;
}

export function AddPaymentMethodDialog({ open, onOpenChange, onAdd }: AddPaymentMethodDialogProps) {
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      company: { tradeName: "", solutionType: "Gateway de Pagamento" },
      status: "Em Negociação",
      startDate: new Date(),
      creditCard: { feesByRevenue: [], maxInstallments: 12, interestBearer: "Lojista", installmentTable: [], acceptedBrands: [] },
      debitCard: { baseRate: 0, settlementDays: 0, acceptedBrands: [] },
      pix: { baseRate: 0, settlementDays: 0, availability: "D+0" },
      boleto: { baseRate: 0, settlementDays: 0, defaultDueDays: 3, customDueDateAllowed: true },
      chargeback: { feePerChargeback: 0, hasGuarantee: false },
      settlement: { creditCardDefault: 30, creditCardParcelledDefault: 30, debitCardDefault: 1, pixDefault: 0, boletoDefault: 2 },
      platformSplit: { model: "Percentual sobre MDR" },
      integration: { types: [], checkoutTypes: [], hasFraudPrevention: false, hasRiskScore: false, has3DS: false, hasTokenization: false, isPCICompliant: false, hasWebhooks: false },
      status10: "Em Negociação",
      nextSteps: { steps: [] },
      metadata: { createdAt: new Date(), updatedAt: new Date() },
    },
  });

  const onSubmit = (data: PaymentMethodFormData) => {
    const newMethod: PaymentMethod = { id: crypto.randomUUID(), ...data } as PaymentMethod;
    onAdd(newMethod);
    toast.success("Meio de pagamento cadastrado com sucesso!");
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Meio de Pagamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="company">Empresa</TabsTrigger>
                <TabsTrigger value="fees">Taxas</TabsTrigger>
                <TabsTrigger value="settlement">Prazos</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="integration">Integração</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[500px] mt-4">
                <div className="p-4 space-y-6">
                  <TabsContent value="company" className="space-y-6">
                    <CompanyDataSection form={form} />
                    <ContactSection form={form} />
                    <DocumentationSection form={form} />
                  </TabsContent>
                  <TabsContent value="fees" className="space-y-6">
                    <CreditCardFeesSection form={form} />
                    <OtherFeesSection form={form} />
                  </TabsContent>
                  <TabsContent value="settlement">
                    <SettlementSection form={form} />
                  </TabsContent>
                  <TabsContent value="performance">
                    <PerformanceSection form={form} />
                  </TabsContent>
                  <TabsContent value="integration" className="space-y-6">
                    <IntegrationSection form={form} />
                    <OnboardingSection form={form} />
                    <SupportSection form={form} />
                  </TabsContent>
                  <TabsContent value="compliance">
                    <ComplianceSection form={form} />
                  </TabsContent>
                  <TabsContent value="evaluation" className="space-y-6">
                    <ObservationsSection form={form} />
                    <EvaluationSection form={form} />
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
