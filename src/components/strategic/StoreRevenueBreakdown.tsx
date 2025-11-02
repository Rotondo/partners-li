import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Store } from "@/types/store";
import { StoreRevenueBreakdownItem } from "@/types/strategic-analysis";

interface StoreRevenueBreakdownProps {
  stores: Store[];
  selectedStoreId: string;
  onStoreChange: (storeId: string) => void;
  breakdownData: StoreRevenueBreakdownItem[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export function StoreRevenueBreakdown({
  stores,
  selectedStoreId,
  onStoreChange,
  breakdownData
}: StoreRevenueBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const pieData = breakdownData.map((item, index) => ({
    name: item.partnerName,
    value: item.rebate,
    fill: COLORS[index % COLORS.length]
  }));

  const totalRebate = breakdownData.reduce((sum, item) => sum + item.rebate, 0);
  const totalGMV = breakdownData.reduce((sum, item) => sum + item.gmv, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown de Receita por Loja</CardTitle>
        <CardDescription>
          Análise detalhada de rebates e contribuição por parceiro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de Loja */}
        <div>
          <label className="text-sm font-medium mb-2 block">Selecione a Loja</label>
          <Select value={selectedStoreId} onValueChange={onStoreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma loja" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {breakdownData.length > 0 ? (
          <>
            {/* Cards Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">GMV Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalGMV)}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Rebate Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRebate)}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">% Rebate Médio</p>
                <p className="text-2xl font-bold">
                  {totalGMV > 0 ? ((totalRebate / totalGMV) * 100).toFixed(2) : 0}%
                </p>
              </div>
            </div>

            {/* Gráfico de Pizza */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela Detalhada */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parceiro</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">GMV</TableHead>
                    <TableHead className="text-right">Receita Parceiro</TableHead>
                    <TableHead className="text-right">Rebate</TableHead>
                    <TableHead className="text-center">% Rebate</TableHead>
                    <TableHead className="text-center">ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breakdownData.map((item) => (
                    <TableRow key={item.partnerId}>
                      <TableCell className="font-medium">{item.partnerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.category === 'logistic' ? 'Logística' :
                           item.category === 'payment' ? 'Pagamento' : 'Marketplace'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.gmv)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.partnerRevenue)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.rebate)}
                      </TableCell>
                      <TableCell className="text-center">{item.rebatePercentage.toFixed(2)}%</TableCell>
                      <TableCell className="text-center">{item.roi.toFixed(2)}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Selecione uma loja para ver o breakdown de receita
          </div>
        )}
      </CardContent>
    </Card>
  );
}
