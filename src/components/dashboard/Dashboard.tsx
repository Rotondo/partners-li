import { useEffect, useState } from "react";
import { Users, Truck, CreditCard, ShoppingBag, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPartners, filterPartnersByCategory } from "@/lib/db";
import { Partner } from "@/types/partner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAllPartners();
      setPartners(data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const logisticPartners = filterPartnersByCategory(partners, 'logistic');
  const paymentPartners = filterPartnersByCategory(partners, 'payment');
  const marketplacePartners = filterPartnersByCategory(partners, 'marketplace');
  const totalPartners = partners.length;

  // Chart data
  const distributionData = [
    { name: 'Logística', value: logisticPartners.length, color: '#3B82F6' },
    { name: 'Pagamento', value: paymentPartners.length, color: '#10B981' },
    { name: 'Marketplace', value: marketplacePartners.length, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  // Recent partners (last 5)
  const recentPartners = partners.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Visão geral dos seus parceiros e métricas principais
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/partners')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Parceiros</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPartners}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPartners === 0 ? "Nenhum parceiro cadastrado" : "Parceiros cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/partners/logistics')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logística</CardTitle>
            <Truck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{logisticPartners.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPartners > 0
                ? `${((logisticPartners.length / totalPartners) * 100).toFixed(0)}% do total`
                : "Adicione parceiros"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/partners/payment')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamento</CardTitle>
            <CreditCard className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paymentPartners.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPartners > 0
                ? `${((paymentPartners.length / totalPartners) * 100).toFixed(0)}% do total`
                : "Adicione parceiros"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/partners/marketplace')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingBag className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{marketplacePartners.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPartners > 0
                ? `${((marketplacePartners.length / totalPartners) * 100).toFixed(0)}% do total`
                : "Adicione parceiros"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Distribuição por Categoria
            </CardTitle>
            <CardDescription>
              Proporção de parceiros por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Nenhum parceiro cadastrado ainda
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/partners')}
                  >
                    Adicionar Primeiro Parceiro
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Parceiros Recentes
            </CardTitle>
            <CardDescription>
              Últimos 5 parceiros adicionados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPartners.length > 0 ? (
              <div className="space-y-4">
                {recentPartners.map((partner) => {
                  const category = partner.categories[0];
                  const Icon =
                    category === 'logistic' ? Truck :
                    category === 'payment' ? CreditCard :
                    ShoppingBag;
                  const color =
                    category === 'logistic' ? 'text-blue-500' :
                    category === 'payment' ? 'text-green-500' :
                    'text-orange-500';

                  return (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate('/partners')}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${color}`} />
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {category === 'logistic' ? 'Logística' :
                             category === 'payment' ? 'Pagamento' :
                             'Marketplace'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[268px] flex items-center justify-center text-center">
                <div>
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Seus novos parceiros aparecerão aqui
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {totalPartners === 0 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-start">
              <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Comece adicionando seus parceiros
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Cadastre seus parceiros de logística, pagamento e marketplaces para ter uma visão completa do seu ecossistema de negócios.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/partners')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar Parceiros
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                  >
                    Configurar Campos
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
