import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paymentMethodSchema, PaymentMethodFormData } from "@/lib/payment-method-schema";
import { PaymentType, PaymentMethod } from "@/types/payment-method";
import { IdentificationSection } from "./PaymentMethodForm/IdentificationSection";
import { FeesSection } from "./PaymentMethodForm/FeesSection";
import { SettlementSection } from "./PaymentMethodForm/SettlementSection";
import { TakeRateSection } from "./PaymentMethodForm/TakeRateSection";
import { PerformanceSection } from "./PaymentMethodForm/PerformanceSection";
import { PaymentTypesSection } from "./PaymentMethodForm/PaymentTypesSection";
import { AntiFraudSection } from "./PaymentMethodForm/AntiFraudSection";
import { ObservationsSection } from "./PaymentMethodForm/ObservationsSection";
import { ManageTypesDialog } from "./ManageTypesDialog";
import { useToast } from "@/hooks/use-toast";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentTypes: PaymentType[];
  onUpdateTypes: (types: PaymentType[]) => void;
  onAdd: (paymentMethod: PaymentMethod) => void;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  paymentTypes,
  onUpdateTypes,
  onAdd,
}: AddPaymentMethodDialogProps) {
  const [manageTypesOpen, setManageTypesOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: "",
      type: "",
      status: "Ativo",
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

  const onSubmit = (data: PaymentMethodFormData) => {
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      name: data.name,
      type: data.type,
      startDate: data.startDate,
      status: data.status,
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
      performance: {
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
      },
      acceptedPaymentMethods: {
        creditCard: {
          enabled: data.acceptedPaymentMethods.creditCard.enabled,
          brands: data.acceptedPaymentMethods.creditCard.brands,
        },
        debitCard: {
          enabled: data.acceptedPaymentMethods.debitCard.enabled,
          brands: data.acceptedPaymentMethods.debitCard.brands,
        },
        pix: {
          enabled: data.acceptedPaymentMethods.pix.enabled,
          normal: data.acceptedPaymentMethods.pix.normal,
          installment: data.acceptedPaymentMethods.pix.installment,
        },
        boleto: data.acceptedPaymentMethods.boleto,
        digitalWallet: {
          enabled: data.acceptedPaymentMethods.digitalWallet.enabled,
          wallets: data.acceptedPaymentMethods.digitalWallet.wallets,
        },
        bnpl: data.acceptedPaymentMethods.bnpl,
      },
      antiFraud: data.antiFraud && data.antiFraud.solution && data.antiFraud.minScore !== undefined
        ? {
            solution: data.antiFraud.solution,
            minScore: data.antiFraud.minScore,
          }
        : undefined,
      observations: data.observations,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(newPaymentMethod);
    
    toast({
      title: "Meio de pagamento cadastrado",
      description: `${data.name} foi adicionado com sucesso.`,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Meio de Pagamento</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="identification" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="identification">Identificação</TabsTrigger>
                  <TabsTrigger value="fees">Taxas</TabsTrigger>
                  <TabsTrigger value="settlement">Prazos</TabsTrigger>
                  <TabsTrigger value="takerate">Take Rate</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="payment-types">Meios</TabsTrigger>
                  <TabsTrigger value="antifraud">Antifraude</TabsTrigger>
                  <TabsTrigger value="observations">Obs.</TabsTrigger>
                </TabsList>

                <TabsContent value="identification" className="mt-6">
                  <IdentificationSection
                    form={form}
                    paymentTypes={paymentTypes}
                    onManageTypes={() => setManageTypesOpen(true)}
                  />
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
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Meio de Pagamento</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ManageTypesDialog
        open={manageTypesOpen}
        onOpenChange={setManageTypesOpen}
        types={paymentTypes}
        onUpdateTypes={onUpdateTypes}
      />
    </>
  );
}
