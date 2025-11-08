import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { Store, Plus, Search, MapPin, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store as StoreType, STORE_STATUSES, STORE_TYPES } from "@/types/store";
import { toast } from "sonner";

export default function Stores() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement getAllStores() from db.ts
      // const data = await getAllStores();
      // setStores(data);

      // Mock data for now
      setStores([]);
      toast.info("Módulo de Lojas em desenvolvimento");
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
      toast.error("Erro ao carregar lojas");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = STORE_STATUSES.find((s) => s.value === status);
    return (
      <Badge variant={statusConfig?.variant || "default"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = STORE_TYPES.find((t) => t.value === type);
    return (
      <Badge variant="outline">
        {type === 'physical' && <Building2 className="mr-1 h-3 w-3" />}
        {type === 'online' && <Globe className="mr-1 h-3 w-3" />}
        {type === 'hybrid' && <MapPin className="mr-1 h-3 w-3" />}
        {typeConfig?.label || type}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton 
        onClick={() => setMobileMenuOpen(true)} 
        isOpen={mobileMenuOpen} 
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Store className="h-8 w-8" />
                  Gestão de Lojas
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie suas lojas físicas, e-commerce e canais de venda
                </p>
              </div>
              <Button size="lg" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Nova Loja
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
                <p className="text-xs text-muted-foreground">
                  {stores.filter((s) => s.status === 'active').length} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lojas Físicas</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.filter((s) => s.store_type === 'physical').length}
                </div>
                <p className="text-xs text-muted-foreground">Pontos de venda</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">E-commerce</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.filter((s) => s.store_type === 'online').length}
                </div>
                <p className="text-xs text-muted-foreground">Lojas online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Híbridas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.filter((s) => s.store_type === 'hybrid').length}
                </div>
                <p className="text-xs text-muted-foreground">Omnichannel</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar lojas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stores Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lojas Cadastradas</CardTitle>
              <CardDescription>
                Lista completa de todas as lojas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando lojas...</p>
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma loja cadastrada</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Comece cadastrando sua primeira loja
                  </p>
                  <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeira Loja
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Parceiros</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{getTypeBadge(store.store_type)}</TableCell>
                        <TableCell>{getStatusBadge(store.status)}</TableCell>
                        <TableCell>
                          {store.address ? `${store.address.city}, ${store.address.state}` : '—'}
                        </TableCell>
                        <TableCell>
                          {(store.logistic_partners?.length || 0) +
                            (store.payment_partners?.length || 0) +
                            (store.marketplace_partners?.length || 0)}{' '}
                          parceiros
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled>
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Store className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Módulo em Desenvolvimento
                  </p>
                  <p className="text-sm text-blue-700">
                    O módulo de gestão de lojas está sendo implementado. Em breve você poderá:
                    cadastrar lojas, vincular parceiros logísticos e de pagamento,
                    acompanhar métricas de performance por loja, e muito mais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
