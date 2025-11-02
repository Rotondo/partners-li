import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  initialMethod?: PaymentMethod | null;
}

export function AddPaymentMethodDialog({ open, onOpenChange, onAdd, initialMethod }: AddPaymentMethodDialogProps) {
  const isEditing = !!initialMethod;
  
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: initialMethod ? {
      company: initialMethod.company || { tradeName: "", solutionType: "Gateway de Pagamento" },
      status: initialMethod.status || "Em Negociação",
      startDate: initialMethod.startDate || new Date(),
      creditCard: initialMethod.creditCard || { feesByRevenue: [], maxInstallments: 12, interestBearer: "Lojista", installmentTable: [], acceptedBrands: [] },
      debitCard: initialMethod.debitCard || { baseRate: 0, settlementDays: 0, acceptedBrands: [] },
      pix: initialMethod.pix || { baseRate: 0, settlementDays: 0, availability: "D+0" },
      boleto: initialMethod.boleto || { baseRate: 0, settlementDays: 0, defaultDueDays: 3, customDueDateAllowed: true },
      chargeback: initialMethod.chargeback || { feePerChargeback: 0, hasGuarantee: false },
      settlement: initialMethod.settlement || { creditCardDefault: 30, creditCardParcelledDefault: 30, debitCardDefault: 1, pixDefault: 0, boletoDefault: 2 },
      platformSplit: initialMethod.platformSplit || { model: "Percentual sobre MDR" },
      integration: initialMethod.integration || { 
        types: [], 
        checkoutTypes: [], 
        hasFraudPrevention: false, 
        hasRiskScore: false, 
        has3DS: false, 
        hasTokenization: false, 
        isPCICompliant: false, 
        hasWebhooks: false,
        webhookEvents: []
      },
      onboarding: initialMethod.onboarding || {
        averageApprovalTime: "",
        requiredDocuments: [],
        requiresSSL: false,
        hasSandbox: false,
        apiCredentials: [],
        integrationComplexity: "Média (requer customização)"
      },
      support: initialMethod.support || {
        channels: [],
        businessDays: "",
        businessHours: "",
        has24x7Support: false,
        slaLevels: {
          critical: "",
          high: "",
          medium: "",
          low: ""
        }
      },
      compliance: initialMethod.compliance || { certifications: [], servesBrazilWide: true },
      observations: initialMethod.observations || { competitiveDifferentials: [], knownLimitations: [], recommendedUseCases: [] },
      status10: initialMethod.status10 || "Em Negociação",
      evaluationScores: initialMethod.evaluationScores || {},
      evaluationNotes: initialMethod.evaluationNotes || {},
      nextSteps: initialMethod.nextSteps || { steps: [] },
      metadata: initialMethod.metadata || { createdAt: new Date(), updatedAt: new Date() },
    } : {
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
      integration: { 
        types: [], 
        checkoutTypes: [], 
        hasFraudPrevention: false, 
        hasRiskScore: false, 
        has3DS: false, 
        hasTokenization: false, 
        isPCICompliant: false, 
        hasWebhooks: false,
        webhookEvents: []
      },
      onboarding: {
        averageApprovalTime: "",
        requiredDocuments: [],
        requiresSSL: false,
        hasSandbox: false,
        apiCredentials: [],
        integrationComplexity: "Média (requer customização)"
      },
      support: {
        channels: [],
        businessDays: "",
        businessHours: "",
        has24x7Support: false,
        slaLevels: {
          critical: "",
          high: "",
          medium: "",
          low: ""
        }
      },
      compliance: { certifications: [], servesBrazilWide: true },
      observations: { competitiveDifferentials: [], knownLimitations: [], recommendedUseCases: [] },
      status10: "Em Negociação",
      evaluationScores: {},
      evaluationNotes: {},
      nextSteps: { steps: [] },
      metadata: { createdAt: new Date(), updatedAt: new Date() },
    },
  });

  useEffect(() => {
    if (open && initialMethod) {
      form.reset({
        company: initialMethod.company || { tradeName: "", solutionType: "Gateway de Pagamento" },
        status: initialMethod.status || "Em Negociação",
        startDate: initialMethod.startDate || new Date(),
        creditCard: initialMethod.creditCard || { feesByRevenue: [], maxInstallments: 12, interestBearer: "Lojista", installmentTable: [], acceptedBrands: [] },
        debitCard: initialMethod.debitCard || { baseRate: 0, settlementDays: 0, acceptedBrands: [] },
        pix: initialMethod.pix || { baseRate: 0, settlementDays: 0, availability: "D+0" },
        boleto: initialMethod.boleto || { baseRate: 0, settlementDays: 0, defaultDueDays: 3, customDueDateAllowed: true },
        chargeback: initialMethod.chargeback || { feePerChargeback: 0, hasGuarantee: false },
        settlement: initialMethod.settlement || { creditCardDefault: 30, creditCardParcelledDefault: 30, debitCardDefault: 1, pixDefault: 0, boletoDefault: 2 },
        platformSplit: initialMethod.platformSplit || { model: "Percentual sobre MDR" },
        integration: initialMethod.integration || { 
          types: [], 
          checkoutTypes: [], 
          hasFraudPrevention: false, 
          hasRiskScore: false, 
          has3DS: false, 
          hasTokenization: false, 
          isPCICompliant: false, 
          hasWebhooks: false,
          webhookEvents: []
        },
        onboarding: initialMethod.onboarding || {
          averageApprovalTime: "",
          requiredDocuments: [],
          requiresSSL: false,
          hasSandbox: false,
          apiCredentials: [],
          integrationComplexity: "Média (requer customização)"
        },
        support: initialMethod.support || {
          channels: [],
          businessDays: "",
          businessHours: "",
          has24x7Support: false,
          slaLevels: {
            critical: "",
            high: "",
            medium: "",
            low: ""
          }
        },
        compliance: initialMethod.compliance || { certifications: [], servesBrazilWide: true },
        observations: initialMethod.observations || { competitiveDifferentials: [], knownLimitations: [], recommendedUseCases: [] },
        status10: initialMethod.status10 || "Em Negociação",
        evaluationScores: initialMethod.evaluationScores || {},
        evaluationNotes: initialMethod.evaluationNotes || {},
        nextSteps: initialMethod.nextSteps || { steps: [] },
        metadata: initialMethod.metadata || { createdAt: new Date(), updatedAt: new Date() },
      });
    } else if (open && !initialMethod) {
      form.reset();
    }
  }, [open, initialMethod, form]);

  const onSubmit = (data: PaymentMethodFormData) => {
    const method: PaymentMethod = { 
      id: initialMethod?.id || crypto.randomUUID(), 
      ...data 
    } as PaymentMethod;
    onAdd(method);
    if (!isEditing) {
      toast.success("Meio de pagamento cadastrado com sucesso!");
      form.reset();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Meio de Pagamento" : "Cadastrar Novo Meio de Pagamento"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="mt-4 space-y-6">
                  <TabsContent value="company" className="space-y-6 mt-0">
                    <CompanyDataSection form={form} />
                    <ContactSection form={form} />
                    <DocumentationSection form={form} />
                  </TabsContent>
                  <TabsContent value="fees" className="space-y-6 mt-0">
                    <CreditCardFeesSection form={form} />
                    <OtherFeesSection form={form} />
                  </TabsContent>
                  <TabsContent value="settlement" className="mt-0">
                    <SettlementSection form={form} />
                  </TabsContent>
                  <TabsContent value="performance" className="mt-0">
                    <PerformanceSection form={form} />
                  </TabsContent>
                  <TabsContent value="integration" className="space-y-6 mt-0">
                    <IntegrationSection form={form} />
                    <OnboardingSection form={form} />
                    <SupportSection form={form} />
                  </TabsContent>
                  <TabsContent value="compliance" className="space-y-6 mt-0">
                    <ComplianceSection form={form} />
                  </TabsContent>
                  <TabsContent value="evaluation" className="space-y-6 mt-0">
                    <ObservationsSection form={form} />
                    <EvaluationSection form={form} />
                  </TabsContent>
              </div>
            </Tabs>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEditing ? "Atualizar" : "Cadastrar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
