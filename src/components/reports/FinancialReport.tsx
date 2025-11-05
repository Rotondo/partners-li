import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign } from "lucide-react";
import { getFinancialSummary, PartnerFinancialSummary } from "@/lib/partner-metrics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const FinancialReport = () => {
  const [summary, setSummary] = useState<PartnerFinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    const data = await getFinancialSummary();
    setSummary(data);
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const exportToCSV = () => {
    if (summary.length === 0) {
      toast.error("Nenhum dado para exportar");
      return;
    }

    const headers = [
      'Parceiro',
      'GMV Total',
      'Rebate Total',
      'GMV Share Médio',
      'Rebate Share Médio',
      'Meses com Dados'
    ];

    const rows = summary.map(item => [
      item.partnerName,
      item.totalGmv.toFixed(2),
      item.totalRebate.toFixed(2),
      (item.avgGmvShare * 100).toFixed(2) + '%',
      (item.avgRebateShare * 100).toFixed(2) + '%',
      item.monthCount.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Relatório exportado com sucesso!");
  };

  const totals = summary.reduce((acc, item) => ({
    gmv: acc.gmv + item.totalGmv,
    rebate: acc.rebate + item.totalRebate,
  }), { gmv: 0, rebate: 0 });

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Carregando relatório financeiro...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              GMV Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.gmv)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os parceiros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rebate Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.rebate)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os parceiros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Relatório Financeiro por Parceiro</CardTitle>
              <CardDescription>
                Resumo de GMV e Rebate com médias de participação
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {summary.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma métrica financeira cadastrada ainda
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione métricas mensais nos parceiros para gerar o relatório
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead className="text-right">GMV Total</TableHead>
                  <TableHead className="text-right">Rebate Total</TableHead>
                  <TableHead className="text-right">GMV Share Médio</TableHead>
                  <TableHead className="text-right">Rebate Share Médio</TableHead>
                  <TableHead className="text-center">Meses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((item) => (
                  <TableRow key={item.partnerId}>
                    <TableCell className="font-medium">{item.partnerName}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.totalGmv)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.totalRebate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(item.avgGmvShare)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercentage(item.avgRebateShare)}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.monthCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
