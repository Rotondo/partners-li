import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GartnerQuadrantChart } from "./GartnerQuadrantChart";
import { PartnerMetricsTable } from "./PartnerMetricsTable";
import { StoreRevenueBreakdown } from "./StoreRevenueBreakdown";
import { Partner, PartnerCategory } from "@/types/partner";
import { Store } from "@/types/store";
import { StorePartnerMetrics } from "@/types/strategic-analysis";
import { calculateGartnerPosition, calculateStoreRevenueBreakdown } from "@/lib/strategic-analysis";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";

interface StrategicDashboardProps {
  partners: Partner[];
  stores: Store[];
  storeMetrics: StorePartnerMetrics[];
}

export function StrategicDashboard({ partners, stores, storeMetrics }: StrategicDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory | 'all'>('all');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  // Filtrar parceiros por categoria
  const filteredPartners = useMemo(() => {
    if (selectedCategory === 'all') return partners;
    return partners.filter(p => p.categories.includes(selectedCategory));
  }, [partners, selectedCategory]);

  // Calcular posições no quadrante
  const quadrantData = useMemo(() => {
    return calculateGartnerPosition(filteredPartners, stores, storeMetrics);
  }, [filteredPartners, stores, storeMetrics]);

  // Calcular breakdown da loja selecionada
  const storeBreakdown = useMemo(() => {
    if (!selectedStoreId) return [];
    const store = stores.find(s => s.id === selectedStoreId);
    if (!store) return [];
    return calculateStoreRevenueBreakdown(store, partners, storeMetrics);
  }, [selectedStoreId, stores, partners, storeMetrics]);

  // Métricas resumidas
  const summary = useMemo(() => {
    const totalRebate = storeMetrics.reduce((sum, m) => sum + m.rebateGenerated, 0);
    const totalGMV = storeMetrics.reduce((sum, m) => sum + m.monthlyGMV, 0);
    const uniqueStores = new Set(storeMetrics.map(m => m.storeId)).size;
    const avgRebatePerStore = uniqueStores > 0 ? totalRebate / uniqueStores : 0;
    const avgROI = storeMetrics.length > 0 
      ? storeMetrics.reduce((sum, m) => sum + m.roi, 0) / storeMetrics.length 
      : 0;

    return {
      totalRebate,
      totalGMV,
      uniqueStores,
      avgRebatePerStore,
      avgROI,
      activePartners: filteredPartners.length
    };
  }, [storeMetrics, filteredPartners]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as PartnerCategory | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="logistic">Logística</SelectItem>
                  <SelectItem value="payment">Pagamento</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rebate Total</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalRebate)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rebate/Loja</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.avgRebatePerStore)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI Médio</p>
                <p className="text-2xl font-bold">{summary.avgROI.toFixed(2)}x</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parceiros Ativos</p>
                <p className="text-2xl font-bold">{summary.activePartners}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="quadrant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quadrant">Quadrante</TabsTrigger>
          <TabsTrigger value="partners">Por Parceiro</TabsTrigger>
          <TabsTrigger value="stores">Por Loja</TabsTrigger>
        </TabsList>

        <TabsContent value="quadrant">
          <GartnerQuadrantChart data={quadrantData} />
        </TabsContent>

        <TabsContent value="partners">
          <PartnerMetricsTable data={quadrantData} />
        </TabsContent>

        <TabsContent value="stores">
          <StoreRevenueBreakdown
            stores={stores}
            selectedStoreId={selectedStoreId}
            onStoreChange={setSelectedStoreId}
            breakdownData={storeBreakdown}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
