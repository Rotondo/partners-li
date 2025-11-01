import { Partner } from "@/types/partner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PartnerInfoTabProps {
  partner: Partner;
}

export const PartnerInfoTab = ({ partner }: PartnerInfoTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{partner.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{partner.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Data de Início</p>
              <p className="font-medium">
                {format(new Date(partner.startDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categorias</p>
              <p className="font-medium">
                {partner.categories.map(cat => {
                  if (cat === "logistic") return "Logística";
                  if (cat === "payment") return "Pagamento";
                  if (cat === "marketplace") return "Marketplace";
                  return cat;
                }).join(", ")}
              </p>
            </div>
          </div>

          {partner.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Observações</p>
              <p className="font-medium">{partner.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {partner.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Dados de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">MDR Crédito</p>
                <p className="font-medium">{partner.payment.fees.mdrCreditVista}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MDR Débito</p>
                <p className="font-medium">{partner.payment.fees.mdrDebit}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MDR PIX</p>
                <p className="font-medium">{partner.payment.fees.mdrPix}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Liquidação Crédito</p>
                <p className="font-medium">{partner.payment.settlement.credit} dias</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Liquidação Débito</p>
                <p className="font-medium">{partner.payment.settlement.debit} dias</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Liquidação PIX</p>
                <p className="font-medium">{partner.payment.settlement.pix} dias</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Take Rate</p>
              <p className="font-medium">{partner.payment.takeRate}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {partner.logistic && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Logísticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prazo de Entrega</p>
                <p className="font-medium">{partner.logistic.deliveryTime} dias úteis</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacidade Diária</p>
                <p className="font-medium">{partner.logistic.capacity} encomendas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Modelo de Preço</p>
                <p className="font-medium capitalize">{partner.logistic.pricingModel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Integração</p>
                <p className="font-medium uppercase">{partner.logistic.integrationType}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Cobertura</p>
              <p className="font-medium">{partner.logistic.coverage.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {partner.marketplace && (
        <Card>
          <CardHeader>
            <CardTitle>Dados de Marketplace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Comissão</p>
                <p className="font-medium">{partner.marketplace.commission}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alcance Mensal</p>
                <p className="font-medium">{partner.marketplace.monthlyReach.toLocaleString()} usuários</p>
              </div>
            </div>

            {partner.marketplace.avgConversionRate && (
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="font-medium">{partner.marketplace.avgConversionRate}%</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Categorias Suportadas</p>
              <p className="font-medium">{partner.marketplace.supportedCategories.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
