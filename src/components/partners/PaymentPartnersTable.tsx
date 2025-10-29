import { useState, useEffect } from "react";
import { Plus, Search, CreditCard, Settings2, Pencil, Trash2 } from "lucide-react";
import { PaymentPartner } from "@/types/partner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { AddPartnerDialog } from "./AddPartnerDialog";
import { useBlurSensitiveData } from "@/hooks/use-blur-sensitive";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { getAllPartners, savePartner, deletePartner } from "@/lib/db";

const DEFAULT_COLUMNS = [
  { id: 'name', label: 'Parceiro', visible: true, order: 1 },
  { id: 'mdrCredit', label: 'MDR Crédito', visible: true, order: 2 },
  { id: 'mdrDebit', label: 'MDR Débito', visible: true, order: 3 },
  { id: 'mdrPix', label: 'MDR PIX', visible: true, order: 4 },
  { id: 'settlement', label: 'Liquidação', visible: true, order: 5 },
  { id: 'takeRate', label: 'Take Rate', visible: true, order: 6 },
  { id: 'status', label: 'Status', visible: true, order: 7 },
];

export const PaymentPartnersTable = () => {
  const [partners, setPartners] = useState<PaymentPartner[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PaymentPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<PaymentPartner | null>(null);
  const { blurClass, isBlurActive } = useBlurSensitiveData();
  
  const { columns, visibleColumns, toggleColumn, resetColumns } = useColumnVisibility('payment', DEFAULT_COLUMNS);

  // Carregar parceiros do localStorage ao montar
  useEffect(() => {
    const allPartners = getAllPartners();
    const paymentPartners = allPartners.filter(
      (p): p is PaymentPartner => 'fees' in p
    );
    setPartners(paymentPartners);
  }, []);

  const filteredPartners = partners.filter((partner) =>
    partner.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPartner = (partner: PaymentPartner) => {
    // Salvar no banco de dados
    savePartner(partner);
    // Atualizar o estado
    setPartners([...partners, partner]);
    setEditingPartner(null);
  };

  const handleEditPartner = (partner: PaymentPartner) => {
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDeletePartner = (partner: PaymentPartner) => {
    deletePartner(partner.id);
    setPartners(partners.filter(p => p.id !== partner.id));
    setDeletingPartner(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPartner(null);
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
          <h2 className="text-3xl font-bold tracking-tight">Parceiros de Pagamento</h2>
          <p className="text-muted-foreground">
            Gerencie seus parceiros e soluções de pagamento
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Colunas Exibidas</Label>
                  <div className="space-y-2">
                    {columns.map((column) => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={column.id}
                          checked={column.visible}
                          onCheckedChange={() => toggleColumn(column.id)}
                        />
                        <label
                          htmlFor={column.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={resetColumns}
                >
                  Restaurar Padrão
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Parceiro
          </Button>
        </div>
      </div>

      <AddPartnerDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        onAdd={handleAddPartner}
        initialPartner={editingPartner}
      />

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deletingPartner} onOpenChange={() => setDeletingPartner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {deletingPartner?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingPartner && handleDeletePartner(deletingPartner)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar parceiros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPartners.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum parceiro de pagamento</h3>
          <p className="text-muted-foreground mt-2">
            Adicione seu primeiro parceiro de pagamento para começar
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead key={column.id}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className={isBlurActive ? 'blur-table-row' : ''}>
                  {visibleColumns.map((column) => {
                    switch (column.id) {
                      case 'name':
                        return (
                          <TableCell key={column.id} className="font-medium">
                            {partner.name}
                          </TableCell>
                        );
                      case 'mdrCredit':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.fees.mdrCreditVista}%
                          </TableCell>
                        );
                      case 'mdrDebit':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.fees.mdrDebit}%
                          </TableCell>
                        );
                      case 'mdrPix':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.fees.mdrPix}%
                          </TableCell>
                        );
                      case 'settlement':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            D+{partner.settlement.credit}
                          </TableCell>
                        );
                      case 'takeRate':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.takeRate}%
                          </TableCell>
                        );
                      case 'status':
                        return (
                          <TableCell key={column.id}>
                            <Badge variant={getStatusBadgeVariant(partner.status)}>
                              {partner.status}
                            </Badge>
                          </TableCell>
                        );
                      default:
                        return null;
                    }
                  })}
                  {/* Coluna de ações */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPartner(partner)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingPartner(partner)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
