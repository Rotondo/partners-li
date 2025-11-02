import { useState, useEffect } from "react";
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
import { toast as sonnerToast } from "sonner";

interface AddPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (partner: PaymentPartner) => void;
  onEdit?: (partner: PaymentPartner) => void;
  initialPartner?: PaymentPartner | null; // Partner para edição
}

export function AddPartnerDialog({
  open,
  onOpenChange,
  onAdd,
  onEdit,
  initialPartner,
}: AddPartnerDialogProps) {
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [savedPartnerId, setSavedPartnerId] = useState<string | null>(null);
  
  const isEditing = !!initialPartner;

  const getDefaultValues = (): PartnerFormData => {
    if (initialPartner) {
      return {
        name: initialPartner.name,
        status: initialPartner.status,
        startDate: initialPartner.startDate,
        fees: initialPartner.fees,
        settlement: initialPartner.settlement,
        takeRate: initialPartner.takeRate,
        performance: initialPartner.performance || {
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
        notes: initialPartner.notes,
      };
    }
    
    return {
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
    };
  };

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: getDefaultValues(),
  });

  // Resetar formulário quando initialPartner mudar
  useEffect(() => {
    if (initialPartner) {
      form.reset(getDefaultValues());
    } else {
      form.reset();
    }
  }, [initialPartner, open]);

  const onSubmit = (data: PartnerFormData) => {
    const newPartner: PaymentPartner = {
      id: initialPartner?.id || Date.now().toString(),
      name: data.name,
      category: 'payment',
      status: data.status,
      startDate: data.startDate,
      categories: ['payment'], // Adicionar campo obrigatório
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
      // ✅ Save custom and contact fields from DynamicFieldsSection
      customFields: Object.keys(customFields).length > 0 ? customFields : undefined,
      contactFields: Object.keys(contactFields).length > 0 ? contactFields : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(newPartner);
    setSavedPartnerId(newPartner.id);
    
    // Mostrar toast
    const message = isEditing 
      ? `${data.name} foi atualizado com sucesso!` 
      : `${data.name} foi adicionado com sucesso!`;
    
    sonnerToast.success(message, {
      duration: 3000,
    });

    // Fechar o dialog após salvar
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Parceiro de Pagamento" : "Adicionar Novo Parceiro de Pagamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="identification" className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
                <TabsTrigger value="identification">Identificação</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
                <TabsTrigger value="fees">Taxas</TabsTrigger>
                <TabsTrigger value="settlement">Prazos</TabsTrigger>
                <TabsTrigger value="takerate">Take Rate</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="payment-types">Meios</TabsTrigger>
                <TabsTrigger value="antifraud">Antifraude</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
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

              {/* Campo customizado */}
              <TabsContent value="custom" className="mt-6">
                <DynamicFieldsSection
                  partnerType="payment"
                  category="custom"
                  values={customFields}
                  onChange={(fieldId, value) => setCustomFields({ ...customFields, [fieldId]: value })}
                />
              </TabsContent>

              {/* Campo de contato/URL */}
              <TabsContent value="contact" className="mt-6">
                <DynamicFieldsSection
                  partnerType="payment"
                  category="contact"
                  values={customFields}
                  onChange={(fieldId, value) => setCustomFields({ ...customFields, [fieldId]: value })}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              {savedPartnerId && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSavedPartnerId(null);
                  }}
                >
                  Cadastrar Novo
                </Button>
              )}
              <Button type="submit">
                {savedPartnerId ? "Atualizar Parceiro" : "Salvar Parceiro"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

