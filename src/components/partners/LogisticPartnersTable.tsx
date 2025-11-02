import { useState, useEffect } from "react";
import { Plus, Search, Truck } from "lucide-react";
import { LogisticPartner, Partner } from "@/types/partner";
import { getAllPartners, savePartner, filterPartnersByCategory } from "@/lib/db";
import { toast } from "sonner";
import { PartnerDetailView } from "./PartnerDetailView";
import { ErrorState } from "@/components/ui/error-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const LogisticPartnersTable = () => {
  const [partners, setPartners] = useState<LogisticPartner[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<LogisticPartner>>({
    category: 'logistic',
    status: 'active',
    coverage: [],
    deliveryTime: 0,
    capacity: 0,
    pricingModel: 'fixed',
    integrationType: 'api',
  });

  useEffect(() => {
    setIsLoading(true);
    getAllPartners()
      .then(allPartners => {
        // ✅ Use helper function for consistent category filtering
        const logisticPartners = filterPartnersByCategory(allPartners, 'logistic');
        setPartners(logisticPartners as LogisticPartner[]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar parceiros:', error);
        toast.error("Erro ao carregar parceiros logísticos");
        setIsLoading(false);
      });
  }, []);

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(search.toLowerCase())
  );

  const loadPartners = async () => {
    try {
      const allPartners = await getAllPartners();
      // ✅ Use helper function for consistent category filtering
      const logisticPartners = filterPartnersByCategory(allPartners, 'logistic');
      setPartners(logisticPartners as LogisticPartner[]);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      toast.error("Erro ao carregar parceiros logísticos");
    }
  };

  const handleRowClick = (partner: LogisticPartner) => {
    setSelectedPartner(partner as Partner);
    setDetailViewOpen(true);
  };

  const handleAddPartner = async () => {
    if (!newPartner.name || !newPartner.startDate) return;

    const partner: LogisticPartner = {
      id: crypto.randomUUID(),
      name: newPartner.name,
      categories: ['logistic'],
      category: 'logistic',
      status: newPartner.status || 'active',
      startDate: newPartner.startDate,
      coverage: newPartner.coverage || [],
      deliveryTime: newPartner.deliveryTime || 0,
      capacity: newPartner.capacity || 0,
      pricingModel: newPartner.pricingModel || 'fixed',
      integrationType: newPartner.integrationType || 'api',
      notes: newPartner.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await savePartner(partner);
      const allPartners = await getAllPartners();
      const logisticPartners = filterPartnersByCategory(allPartners, 'logistic');
      setPartners(logisticPartners as LogisticPartner[]);
      
      setIsDialogOpen(false);
      setNewPartner({
        category: 'logistic',
        status: 'active',
        coverage: [],
        deliveryTime: 0,
        capacity: 0,
        pricingModel: 'fixed',
        integrationType: 'api',
      });
      
      toast.success("Parceiro logístico adicionado com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error("Erro ao salvar parceiro logístico");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'paused':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parceiros Logísticos</h2>
          <p className="text-muted-foreground">
            Gerencie seus parceiros de logística e delivery
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Parceiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Parceiro Logístico</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo parceiro de logística
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Parceiro *</Label>
                <Input
                  id="name"
                  value={newPartner.name || ""}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Ex: Correios, JADLog..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPartner.startDate?.toISOString().split('T')[0] || ""}
                  onChange={(e) => setNewPartner({ ...newPartner, startDate: new Date(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newPartner.status}
                  onValueChange={(value) => setNewPartner({ ...newPartner, status: value as "active" | "inactive" | "pending" | "paused" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Em Homologação</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coverage">Cobertura (Estados)</Label>
                <Input
                  id="coverage"
                  placeholder="Ex: SP, RJ, MG (separado por vírgula)"
                  onChange={(e) => setNewPartner({ ...newPartner, coverage: e.target.value.split(',').map(s => s.trim()) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="deliveryTime">Prazo de Entrega (dias)</Label>
                  <Input
                    id="deliveryTime"
                    type="number"
                    value={newPartner.deliveryTime || ""}
                    onChange={(e) => setNewPartner({ ...newPartner, deliveryTime: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacidade Diária</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newPartner.capacity || ""}
                    onChange={(e) => setNewPartner({ ...newPartner, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pricingModel">Modelo de Preço</Label>
                  <Select
                    value={newPartner.pricingModel}
                    onValueChange={(value) => setNewPartner({ ...newPartner, pricingModel: value as "fixed" | "variable" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixo</SelectItem>
                      <SelectItem value="variable">Variável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="integrationType">Tipo de Integração</Label>
                  <Select
                    value={newPartner.integrationType}
                    onValueChange={(value) => setNewPartner({ ...newPartner, integrationType: value as "api" | "manual" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newPartner.notes || ""}
                  onChange={(e) => setNewPartner({ ...newPartner, notes: e.target.value })}
                  placeholder="Notas adicionais sobre o parceiro"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPartner}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar parceiros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 border rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando parceiros...</p>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum parceiro logístico</h3>
          <p className="text-muted-foreground mt-2">
            Adicione seu primeiro parceiro logístico para começar
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceiro</TableHead>
                <TableHead>Cobertura</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Integração</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow 
                  key={partner.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(partner)}
                >
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>
                    {partner.coverage.length > 0 ? (
                      <Badge variant="secondary">{partner.coverage.length} estados</Badge>
                    ) : (
                      <span className="text-muted-foreground">Não informado</span>
                    )}
                  </TableCell>
                  <TableCell>{partner.deliveryTime} dias</TableCell>
                  <TableCell>{partner.capacity.toLocaleString('pt-BR')}/dia</TableCell>
                  <TableCell className="capitalize">{partner.integrationType}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(partner.status)}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PartnerDetailView
        partner={selectedPartner}
        open={detailViewOpen}
        onOpenChange={setDetailViewOpen}
        onUpdate={loadPartners}
      />
    </div>
  );
};

