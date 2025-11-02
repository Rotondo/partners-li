import { useEffect, useState } from "react";
import { Truck, CreditCard, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPartners, filterPartnersByCategory } from "@/lib/db";

export const PartnersOverview = () => {
  const [counts, setCounts] = useState({
    logistic: 0,
    payment: 0,
    marketplace: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllPartners()
      .then(partners => {
        // ✅ Use helper function for consistent category filtering
        const logistic = filterPartnersByCategory(partners, 'logistic').length;
        const payment = filterPartnersByCategory(partners, 'payment').length;
        const marketplace = filterPartnersByCategory(partners, 'marketplace').length;

        setCounts({ logistic, payment, marketplace });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar overview:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral de Parceiros</h2>
        <p className="text-muted-foreground">
          Visão consolidada dos seus parceiros logísticos, de pagamento e marketplaces
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parceiros Logísticos
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : counts.logistic}
            </div>
            <p className="text-xs text-muted-foreground">
              {counts.logistic === 0 ? "Nenhum parceiro cadastrado" : `${counts.logistic} parceiro(s) ativo(s)`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parceiros de Pagamento
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : counts.payment}
            </div>
            <p className="text-xs text-muted-foreground">
              {counts.payment === 0 ? "Nenhum parceiro cadastrado" : `${counts.payment} parceiro(s) ativo(s)`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Marketplaces
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : counts.marketplace}
            </div>
            <p className="text-xs text-muted-foreground">
              {counts.marketplace === 0 ? "Nenhum parceiro cadastrado" : `${counts.marketplace} parceiro(s) ativo(s)`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Para começar a gerenciar seus parceiros:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Use o menu lateral para acessar cada categoria de parceiros</li>
              <li>Clique em "Adicionar Parceiro" para cadastrar novos parceiros</li>
              <li>Mantenha as informações atualizadas para uma gestão eficiente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

