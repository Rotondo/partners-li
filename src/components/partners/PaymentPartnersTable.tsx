import { useState, useEffect } from "react";
import { Plus, Search, CreditCard } from "lucide-react";
import { PaymentPartner } from "@/types/partner";
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
import { AddPartnerDialog } from "./AddPartnerDialog";
import { useBlurSensitiveData } from "@/hooks/use-blur-sensitive";
import { getAllPartners, savePartner } from "@/lib/db";
import { toast } from "sonner";

export const PaymentPartnersTable = () => {
  const [partners, setPartners] = useState<PaymentPartner[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { blurClass, isBlurActive } = useBlurSensitiveData();

  useEffect(() => {
    setIsLoading(true);
    getAllPartners()
      .then(allPartners => {
        const paymentPartners = allPartners.filter(p => 
          p.categories.includes('payment') || (p as any).category === 'payment'
        );
        setPartners(paymentPartners as PaymentPartner[]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar parceiros:', error);
        toast.error("Erro ao carregar parceiros de pagamento");
        setIsLoading(false);
      });
  }, []);

  const filteredPartners = partners.filter((partner) =>
    partner.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPartner = async (partner: PaymentPartner) => {
    try {
      await savePartner(partner);
      const allPartners = await getAllPartners();
      const paymentPartners = allPartners.filter(p => 
        p.categories.includes('payment') || (p as any).category === 'payment'
      );
      setPartners(paymentPartners as PaymentPartner[]);
      toast.success("Parceiro adicionado com sucesso!");
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error);
      toast.error("Erro ao salvar parceiro");
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
          <h2 className="text-3xl font-bold tracking-tight">Parceiros de Pagamento</h2>
          <p className="text-muted-foreground">
            Gerencie seus parceiros e soluções de pagamento
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Parceiro
        </Button>
      </div>

      <AddPartnerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddPartner}
      />

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
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum parceiro de pagamento</h3>
          <p className="text-muted-foreground mt-2">
            Adicione seu primeiro parceiro de pagamento para começar
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceiro</TableHead>
                <TableHead>MDR Crédito</TableHead>
                <TableHead>MDR Débito</TableHead>
                <TableHead>MDR PIX</TableHead>
                <TableHead>Liquidação</TableHead>
                <TableHead>Take Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className={isBlurActive ? 'blur-table-row' : ''}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell className={isBlurActive ? 'sensitive-data' : ''}>{partner.fees.mdrCreditVista}%</TableCell>
                  <TableCell className={isBlurActive ? 'sensitive-data' : ''}>{partner.fees.mdrDebit}%</TableCell>
                  <TableCell className={isBlurActive ? 'sensitive-data' : ''}>{partner.fees.mdrPix}%</TableCell>
                  <TableCell className={isBlurActive ? 'sensitive-data' : ''}>D+{partner.settlement.credit}</TableCell>
                  <TableCell className={isBlurActive ? 'sensitive-data' : ''}>{partner.takeRate}%</TableCell>
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
