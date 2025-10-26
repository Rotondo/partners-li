import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

const stores: any[] = [];

export const StoresOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lojas</h2>
          <p className="text-muted-foreground mt-1">Monitore o desempenho de suas lojas</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Cadastrar Loja
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma loja cadastrada.</p>
          <p className="text-sm text-muted-foreground mt-2">Clique em "Cadastrar Loja" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.map((store, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">{store.status}</Badge>
                      <div className="flex gap-1">
                        {store.paymentMethods.map((method, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    store.trend === "up" ? "text-success" : "text-destructive"
                  }`}>
                    {store.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {store.trendValue}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="text-xl font-bold text-foreground mt-1">{store.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transações</p>
                    <p className="text-xl font-bold text-foreground mt-1">
                      {store.transactions.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Médio</p>
                    <p className="text-xl font-bold text-foreground mt-1">{store.avgTicket}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
