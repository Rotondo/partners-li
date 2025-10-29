import { useState } from "react";
import { Plus, Search, ShoppingBag } from "lucide-react";
import { MarketplacePartner, MARKETPLACE_CATEGORIES } from "@/types/partner";
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
import { Checkbox } from "@/components/ui/checkbox";

export const MarketplacePartnersTable = () => {
  const [partners, setPartners] = useState<MarketplacePartner[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<MarketplacePartner>>({
    category: 'marketplace',
    status: 'active',
    commission: 0,
    supportedCategories: [],
    monthlyReach: 0,
    integrationType: 'api',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredPartners = partners.filter((partner) =>
    partner.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.startDate) return;

    const partner: MarketplacePartner = {
      id: Date.now().toString(),
      name: newPartner.name,
      categories: ['marketplace'],
      category: 'marketplace',
      status: newPartner.status || 'active',
      startDate: newPartner.startDate,
      commission: newPartner.commission || 0,
      supportedCategories: selectedCategories,
      monthlyReach: newPartner.monthlyReach || 0,
      integrationType: newPartner.integrationType || 'api',
      avgConversionRate: newPartner.avgConversionRate,
      notes: newPartner.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPartners([...partners, partner]);
    setIsDialogOpen(false);
    setNewPartner({
      category: 'marketplace',
      status: 'active',
      commission: 0,
      supportedCategories: [],
      monthlyReach: 0,
      integrationType: 'api',
    });
    setSelectedCategories([]);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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
          <h2 className="text-3xl font-bold tracking-tight">Parceiros de Marketplace</h2>
          <p className="text-muted-foreground">
            Gerencie suas integrações com marketplaces
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
              <DialogTitle>Adicionar Marketplace</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo parceiro de marketplace
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Marketplace *</Label>
                <Input
                  id="name"
                  value={newPartner.name || ""}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Ex: Mercado Livre, Amazon..."
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
                  onValueChange={(value) => setNewPartner({ ...newPartner, status: value as any })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="commission">Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    value={newPartner.commission || ""}
                    onChange={(e) => setNewPartner({ ...newPartner, commission: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="monthlyReach">Alcance Mensal</Label>
                  <Input
                    id="monthlyReach"
                    type="number"
                    value={newPartner.monthlyReach || ""}
                    onChange={(e) => setNewPartner({ ...newPartner, monthlyReach: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="integrationType">Tipo de Integração</Label>
                  <Select
                    value={newPartner.integrationType}
                    onValueChange={(value) => setNewPartner({ ...newPartner, integrationType: value as any })}
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
                <div className="grid gap-2">
                  <Label htmlFor="conversionRate">Taxa de Conversão (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    step="0.01"
                    value={newPartner.avgConversionRate || ""}
                    onChange={(e) => setNewPartner({ ...newPartner, avgConversionRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Categorias Suportadas</Label>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 max-h-48 overflow-y-auto">
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newPartner.notes || ""}
                  onChange={(e) => setNewPartner({ ...newPartner, notes: e.target.value })}
                  placeholder="Notas adicionais sobre o marketplace"
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
          placeholder="Buscar marketplaces..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPartners.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum marketplace cadastrado</h3>
          <p className="text-muted-foreground mt-2">
            Adicione seu primeiro marketplace para começar
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marketplace</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Categorias</TableHead>
                <TableHead>Alcance Mensal</TableHead>
                <TableHead>Taxa Conversão</TableHead>
                <TableHead>Integração</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.commission}%</TableCell>
                  <TableCell>
                    {partner.supportedCategories.length > 0 ? (
                      <Badge variant="secondary">
                        {partner.supportedCategories.length} categorias
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Nenhuma</span>
                    )}
                  </TableCell>
                  <TableCell>{partner.monthlyReach.toLocaleString('pt-BR')} usuários</TableCell>
                  <TableCell>
                    {partner.avgConversionRate ? `${partner.avgConversionRate}%` : '-'}
                  </TableCell>
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
    </div>
  );
};

