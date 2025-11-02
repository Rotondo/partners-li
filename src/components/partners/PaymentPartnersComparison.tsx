import { useState, useMemo } from "react";
import { PaymentPartner } from "@/types/partner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingDown, TrendingUp, DollarSign, Clock, Shield } from "lucide-react";

interface PaymentPartnersComparisonProps {
  partners: PaymentPartner[];
}

export function PaymentPartnersComparison({ partners }: PaymentPartnersComparisonProps) {
  const [sortBy, setSortBy] = useState<'name' | 'takeRate' | 'pixFee' | 'creditFee'>('takeRate');

  // Análise comparativa
  const analysis = useMemo(() => {
    if (partners.length === 0) return null;

    const pixFees = partners
      .map(p => ({ name: p.name, fee: p.fees?.pix?.mdr || 999 }))
      .filter(p => p.fee < 999);

    const creditFees = partners
      .map(p => ({ name: p.name, fee: p.fees?.creditCard?.vista?.mdr || 999 }))
      .filter(p => p.fee < 999);

    const chargebackFees = partners
      .map(p => ({ name: p.name, fee: p.fees?.chargebackFee || 999 }))
      .filter(p => p.fee === 0);

    const takeRates = partners.map(p => ({ name: p.name, rate: p.takeRate || 999 }));

    return {
      cheapestPix: pixFees.length > 0 ? pixFees.reduce((min, p) => p.fee < min.fee ? p : min) : null,
      cheapestCredit: creditFees.length > 0 ? creditFees.reduce((min, p) => p.fee < min.fee ? p : min) : null,
      noChargebackFee: chargebackFees,
      lowestTakeRate: takeRates.reduce((min, p) => p.rate < min.rate ? p : min),
      averageTakeRate: takeRates.reduce((sum, p) => sum + p.rate, 0) / takeRates.length,
    };
  }, [partners]);

  const sortedPartners = useMemo(() => {
    return [...partners].sort((a, b) => {
      const aPayment = a;
      const bPayment = b;

      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'takeRate':
          return (aPayment?.takeRate || 999) - (bPayment?.takeRate || 999);
        case 'pixFee':
          return (aPayment?.fees.pix?.mdr || 999) - (bPayment?.fees.pix?.mdr || 999);
        case 'creditFee':
          return (aPayment?.fees.creditCard?.vista?.mdr || 999) - (bPayment?.fees.creditCard?.vista?.mdr || 999);
        default:
          return 0;
      }
    });
  }, [partners, sortBy]);

  const formatFee = (fee: number | undefined) => {
    if (fee === undefined) return 'N/A';
    if (fee === 0) return 'Grátis';
    return `${fee.toFixed(2)}%`;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    if (value === 0) return 'Grátis';
    return `R$ ${value.toFixed(2)}`;
  };

  const getBestBadge = (partnerName: string, category: 'pix' | 'credit' | 'chargeback' | 'takeRate') => {
    if (!analysis) return null;

    const isBest =
      (category === 'pix' && analysis.cheapestPix?.name === partnerName) ||
      (category === 'credit' && analysis.cheapestCredit?.name === partnerName) ||
      (category === 'chargeback' && analysis.noChargebackFee.some(p => p.name === partnerName)) ||
      (category === 'takeRate' && analysis.lowestTakeRate.name === partnerName);

    if (isBest) {
      return (
        <Badge variant="default" className="ml-2 bg-green-600">
          <Trophy className="w-3 h-3 mr-1" />
          Melhor
        </Badge>
      );
    }

    return null;
  };

  if (partners.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Parceiros</CardTitle>
          <CardDescription>
            Nenhum parceiro de pagamento cadastrado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cadastre parceiros de pagamento para ver a comparação detalhada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Análise Rápida */}
      {analysis && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menor Taxa Pix</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFee(analysis.cheapestPix?.fee)}</div>
              <p className="text-xs text-muted-foreground">{analysis.cheapestPix?.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menor Taxa Crédito</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFee(analysis.cheapestCredit?.fee)}</div>
              <p className="text-xs text-muted-foreground">{analysis.cheapestCredit?.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Taxa Chargeback</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.noChargebackFee.length}</div>
              <p className="text-xs text-muted-foreground">
                {analysis.noChargebackFee.map(p => p.name).join(', ') || 'Nenhum'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.averageTakeRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Média do mercado</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela Comparativa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Comparação Detalhada</CardTitle>
              <CardDescription>
                Compare taxas, prazos e diferenciais de cada parceiro
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Nome
              </Button>
              <Button
                variant={sortBy === 'takeRate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('takeRate')}
              >
                Taxa Geral
              </Button>
              <Button
                variant={sortBy === 'pixFee' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('pixFee')}
              >
                Pix
              </Button>
              <Button
                variant={sortBy === 'creditFee' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('creditFee')}
              >
                Crédito
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Parceiro</TableHead>
                  <TableHead>Pix</TableHead>
                  <TableHead>Crédito Vista</TableHead>
                  <TableHead>Crédito 2-6x</TableHead>
                  <TableHead>Crédito 7-12x</TableHead>
                  <TableHead>Débito</TableHead>
                  <TableHead>Boleto</TableHead>
                  <TableHead>Chargeback</TableHead>
                  <TableHead>Liquidação</TableHead>
                  <TableHead className="w-[100px]">Taxa Geral</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPartners.map((partner) => {
                  const payment = partner;
                  if (!payment) return null;

                  return (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.name}
                        {getBestBadge(partner.name, 'takeRate')}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.pix?.mdr)}
                        {getBestBadge(partner.name, 'pix')}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.creditCard?.vista?.mdr)}
                        {getBestBadge(partner.name, 'credit')}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.creditCard?.installments2to6?.mdr)}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.creditCard?.installments7to12?.mdr)}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.debitCard?.mdr)}
                      </TableCell>
                      <TableCell>
                        {formatFee(payment.fees.boleto?.mdr)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(payment.fees.chargebackFee)}
                        {getBestBadge(partner.name, 'chargeback')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">
                            {payment.settlement.pix ? `Pix: D+${payment.settlement.pix}` : ''}
                            {payment.settlement.credit ? ` | Créd: D+${payment.settlement.credit}` : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.takeRate.toFixed(2)}%</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diferenciais Competitivos */}
      <Card>
        <CardHeader>
          <CardTitle>Diferenciais de Cada Parceiro</CardTitle>
          <CardDescription>
            Características únicas e vantagens competitivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPartners.map((partner) => {
              const payment = partner;
              if (!payment || !payment.competitiveAdvantages) return null;

              return (
                <div key={partner.id} className="border-b pb-4 last:border-0">
                  <h4 className="font-semibold mb-2">{partner.name}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {payment.competitiveAdvantages.map((advantage, index) => (
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                  {payment.notes && (
                    <p className="mt-2 text-sm italic text-muted-foreground">
                      💡 {payment.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
