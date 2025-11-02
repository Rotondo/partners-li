import { useState, useEffect } from "react";
import { Plus, Search, CreditCard, Settings2, Pencil, Trash2, AlertCircle, Database } from "lucide-react";
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
import { getAllPartners, savePartner, deletePartner, filterPartnersByCategory } from "@/lib/db";
import { toast } from "sonner";
import { ErrorState } from "@/components/ui/error-alert";
import { seedLegacyPaymentPartnersFromGranular } from "@/lib/seedLegacyPaymentPartners";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<PaymentPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<PaymentPartner | null>(null);
  const { blurClass, isBlurActive } = useBlurSensitiveData();
  const [isSeedingData, setIsSeedingData] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [showSeedDialog, setShowSeedDialog] = useState(false);
  
  const { columns, visibleColumns, toggleColumn, resetColumns } = useColumnVisibility('payment', DEFAULT_COLUMNS);

  const loadPartnersData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allPartners = await getAllPartners();
      const paymentPartners = filterPartnersByCategory(allPartners, 'payment');
      setPartners(paymentPartners as PaymentPartner[]);
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error);
      setError('Não foi possível carregar os parceiros de pagamento. Verifique sua conexão e tente novamente.');
      toast.error("Erro ao carregar parceiros de pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartnersData();
  }, []);

  const filteredPartners = partners.filter((partner) =>
    partner.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPartner = async (partner: PaymentPartner) => {
    try {
      await savePartner(partner);
      await loadPartnersData();
      toast.success("Parceiro adicionado com sucesso!");
      setEditingPartner(null);
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error("Erro ao salvar parceiro");
    }
  };

  const handleEditPartner = (partner: PaymentPartner) => {
    setEditingPartner(partner);
    setIsDialogOpen(true);
  };

  const handleDeletePartner = async (partner: PaymentPartner) => {
    try {
      await deletePartner(partner.id);
      await loadPartnersData();
      toast.success("Parceiro excluído com sucesso!");
      setDeletingPartner(null);
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error);
      toast.error("Erro ao excluir parceiro");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPartner(null);
  };

  const handleConfirmSeed = async () => {
    setShowSeedDialog(false);
    setIsSeedingData(true);
    setSeedProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSeedProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const ids = await seedLegacyPaymentPartnersFromGranular();
      
      clearInterval(progressInterval);
      setSeedProgress(100);
      
      toast.success(`${ids.length} parceiros cadastrados com sucesso!`);
      
      await loadPartnersData();
    } catch (error) {
      console.error('Erro ao cadastrar parceiros:', error);
      toast.error("Erro ao cadastrar parceiros iniciais");
    } finally {
      setTimeout(() => {
        setIsSeedingData(false);
        setSeedProgress(0);
      }, 500);
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
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Parceiros de Pagamento
            {partners.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {partners.length} {partners.length === 1 ? 'parceiro' : 'parceiros'}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Gerencie seus parceiros e soluções de pagamento (visão simplificada)
          </p>
        </div>
        <div className="flex gap-2">
          {partners.length < 3 && !isSeedingData && (
            <Button 
              onClick={() => setShowSeedDialog(true)} 
              variant="outline"
              className="gap-2"
            >
              <Database className="h-4 w-4" />
              Cadastrar Parceiros Iniciais (Resumo)
            </Button>
          )}
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

      {/* Seed Confirmation Dialog */}
      <AlertDialog open={showSeedDialog} onOpenChange={setShowSeedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastrar Parceiros Iniciais</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Isso irá adicionar 6 parceiros de pagamento pré-configurados à visão resumida:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Mercado Pago</li>
                <li>APP MAX</li>
                <li>Pagar.me</li>
                <li>PagBank</li>
                <li>PagHiper</li>
                <li>PayPal</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Os parceiros existentes não serão afetados.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSeed}>
              Confirmar Cadastro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {isSeedingData && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cadastrando parceiros...</span>
                <span className="font-medium">{seedProgress}%</span>
              </div>
              <Progress value={seedProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar parceiros..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {!isSeedingData && partners.length === 0 && !isLoading && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                  Nenhum parceiro cadastrado
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Você ainda não tem parceiros de pagamento na visão resumida. 
                  Clique no botão "Cadastrar Parceiros Iniciais (Resumo)" para adicionar 6 parceiros pré-configurados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error ? (
        <ErrorState
          title="Erro ao Carregar Parceiros"
          message={error}
          onRetry={loadPartnersData}
        />
      ) : isLoading ? (
        <div className="text-center py-12 border rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando parceiros...</p>
        </div>
      ) : filteredPartners.length === 0 ? (
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
                <TableHead>Ações</TableHead>
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
                            {partner.fees?.creditCard?.vista?.mdr || 0}%
                          </TableCell>
                        );
                      case 'mdrDebit':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.fees?.debitCard?.mdr || 0}%
                          </TableCell>
                        );
                      case 'mdrPix':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            {partner.fees?.pix?.mdr || 0}%
                          </TableCell>
                        );
                      case 'settlement':
                        return (
                          <TableCell key={column.id} className={isBlurActive ? 'sensitive-data' : ''}>
                            D+{partner.settlement?.credit || 0}
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
