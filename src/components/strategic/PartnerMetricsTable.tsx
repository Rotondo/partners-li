import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { GartnerQuadrant, QUADRANTS } from "@/types/strategic-analysis";

interface PartnerMetricsTableProps {
  data: GartnerQuadrant[];
  onViewDetails?: (partnerId: string) => void;
}

export function PartnerMetricsTable({ data, onViewDetails }: PartnerMetricsTableProps) {
  const getQuadrantBadgeVariant = (quadrant: GartnerQuadrant['quadrant']) => {
    switch (quadrant) {
      case 'leader': return 'default';
      case 'challenger': return 'secondary';
      case 'niche': return 'outline';
      case 'laggard': return 'destructive';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas Detalhadas por Parceiro</CardTitle>
        <CardDescription>
          Visão completa de performance e rebates gerados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceiro</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Lojas</TableHead>
                <TableHead className="text-right">GMV Total</TableHead>
                <TableHead className="text-right">Rebate Total</TableHead>
                <TableHead className="text-right">Rebate/Loja</TableHead>
                <TableHead className="text-center">Fit</TableHead>
                <TableHead className="text-center">Quadrante</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              ) : (
                data.map((partner) => (
                  <TableRow key={partner.partnerId}>
                    <TableCell className="font-medium">{partner.partnerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {partner.category === 'logistic' ? 'Logística' :
                         partner.category === 'payment' ? 'Pagamento' : 'Marketplace'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{partner.totalStores}</TableCell>
                    <TableCell className="text-right">{formatCurrency(partner.totalGMV)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(partner.totalRebate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(partner.avgRebatePerStore)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{partner.fitScore.toFixed(0)}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getQuadrantBadgeVariant(partner.quadrant)}>
                        {QUADRANTS[partner.quadrant].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails && onViewDetails(partner.partnerId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
