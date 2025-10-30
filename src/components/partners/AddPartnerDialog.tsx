import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { partnerSchema, PartnerFormData } from "@/lib/partner-schema";
import { PaymentPartner } from "@/types/partner";
import { IdentificationSection } from "./PartnerForm/IdentificationSection";
import { FeesSection } from "./PartnerForm/FeesSection";
import { SettlementSection } from "./PartnerForm/SettlementSection";
import { TakeRateSection } from "./PartnerForm/TakeRateSection";
import { PerformanceSection } from "./PartnerForm/PerformanceSection";
import { PaymentTypesSection } from "./PartnerForm/PaymentTypesSection";
import { AntiFraudSection } from "./PartnerForm/AntiFraudSection";
import { ObservationsSection } from "./PartnerForm/ObservationsSection";
import { DynamicFieldsSection } from "./DynamicFieldsSection";
import { useToast } from "@/hooks/use-toast";

interface AddPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (partner: PaymentPartner) => void;
}

export function AddPartnerDialog({
  open,
  onOpenChange,
  onAdd,
}: AddPartnerDialogProps) {
  const { toast } = useToast();
  const [contactFields, setContactFields] = useState<Record<string, any>>({});
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      status: "active",
      startDate: new Date(),
      fees: {
        mdrCreditVista: 0,
        mdrDebit: 0,
        mdrPix: 0,
        anticipationRate: 0,
        chargebackFee: 0,
      },
      settlement: {
        credit: 0,
        debit: 0,
        pix: 0,
      },
      takeRate: 0,
      performance: {
        month1: { approval: 0, gmv: 0, transactions: 0 },
        month2: { approval: 0, gmv: 0, transactions: 0 },
        month3: { approval: 0, gmv: 0, transactions: 0 },
      },
      acceptedPaymentMethods: {
        creditCard: { enabled: false, brands: [] },
        debitCard: { enabled: false, brands: [] },
        pix: { enabled: false, normal: false, installment: false },
        boleto: false,
        digitalWallet: { enabled: false, wallets: [] },
        bnpl: false,
      },
    },
  });

  const onSubmit = (data: PartnerFormData) => {
    const newPartner: PaymentPartner = {
      id: crypto.randomUUID(),
      name: data.name,
      category: 'payment',
      status: data.status,
      startDate: data.startDate,
      categories: ['payment'],
      fees: {
        mdrCreditVista: data.fees.mdrCreditVista,
        mdrDebit: data.fees.mdrDebit,
        mdrPix: data.fees.mdrPix,
        anticipationRate: data.fees.anticipationRate,
        chargebackFee: data.fees.chargebackFee,
      },
      settlement: {
        credit: data.settlement.credit,
        debit: data.settlement.debit,
        pix: data.settlement.pix,
      },
      takeRate: data.takeRate,
      performance: data.performance ? {
        month1: {
          approval: data.performance.month1.approval,
          gmv: data.performance.month1.gmv,
          transactions: data.performance.month1.transactions,
        },
        month2: {
          approval: data.performance.month2.approval,
          gmv: data.performance.month2.gmv,
          transactions: data.performance.month2.transactions,
        },
        month3: {
          approval: data.performance.month3.approval,
          gmv: data.performance.month3.gmv,
          transactions: data.performance.month3.transactions,
        },
      } : undefined,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Salvar customFields e contactFields separadamente no banco se necessário

    onAdd(newPartner);
    
    toast({
      title: "Parceiro cadastrado",
      description: `${data.name} foi adicionado com sucesso.`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Parceiro de Pagamento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="identification" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
                <TabsTrigger value="identification">Identificação</TabsTrigger>
                <TabsTrigger value="fees">Taxas</TabsTrigger>
                <TabsTrigger value="settlement">Prazos</TabsTrigger>
                <TabsTrigger value="takerate">Take Rate</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="payment-types">Meios</TabsTrigger>
                <TabsTrigger value="antifraud">Antifraude</TabsTrigger>
                <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
                <TabsTrigger value="observations">Obs.</TabsTrigger>
              </TabsList>

              <TabsContent value="identification" className="mt-6">
                <IdentificationSection form={form} />
              </TabsContent>

              <TabsContent value="fees" className="mt-6">
                <FeesSection form={form} />
              </TabsContent>

              <TabsContent value="settlement" className="mt-6">
                <SettlementSection form={form} />
              </TabsContent>

              <TabsContent value="takerate" className="mt-6">
                <TakeRateSection form={form} />
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <PerformanceSection form={form} />
              </TabsContent>

              <TabsContent value="payment-types" className="mt-6">
                <PaymentTypesSection form={form} />
              </TabsContent>

              <TabsContent value="antifraud" className="mt-6">
                <AntiFraudSection form={form} />
              </TabsContent>

              <TabsContent value="observations" className="mt-6">
                <ObservationsSection form={form} />
              </TabsContent>

              {/* Campos Personalizados - Unificados */}
              <TabsContent value="personalizado" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Campos de Contato</h3>
                    <DynamicFieldsSection
                      partnerType="payment"
                      category="contact"
                      values={contactFields}
                      onChange={(fieldId, value) => setContactFields({ ...contactFields, [fieldId]: value })}
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Campos Customizados</h3>
                    <DynamicFieldsSection
                      partnerType="payment"
                      category="custom"
                      values={customFields}
                      onChange={(fieldId, value) => setCustomFields({ ...customFields, [fieldId]: value })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Parceiro</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

