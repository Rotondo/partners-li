import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Search, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Contract {
  id: string;
  partner_id: string;
  title: string;
  status: string;
  contract_value: number | null;
  currency: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  partner?: {
    name: string;
  };
}

export default function Legal() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [partnerFilter, setPartnerFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load partners
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');

      if (partnersError) throw partnersError;
      setPartners(partnersData || []);

      // Load contracts
      const { data: contractsData, error: contractsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contractsError) throw contractsError;

      // Enrich contracts with partner names
      const enrichedContracts = (contractsData || []).map(contract => {
        const partner = partnersData?.find(p => p.id === contract.partner_id);
        return {
          ...contract,
          partner: partner ? { name: partner.name } : { name: 'Parceiro não encontrado' }
        };
      });

      setContracts(enrichedContracts);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.partner?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    const matchesPartner = partnerFilter === "all" || contract.partner_id === partnerFilter;
    return matchesSearch && matchesStatus && matchesPartner;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Rascunho" },
      active: { variant: "default", label: "Ativo" },
      pending_signature: { variant: "outline", label: "Pend. Assinatura" },
      signed: { variant: "default", label: "Assinado" },
      expired: { variant: "destructive", label: "Expirado" },
      terminated: { variant: "destructive", label: "Rescindido" }
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      
      <main className="flex-1 md:pl-0">
        <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          <MobileMenuButton onClick={() => setMobileOpen(true)} isOpen={mobileOpen} />
          <h1 className="text-lg font-semibold">Jurídico</h1>
        </div>

        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestão Jurídica</h1>
                <p className="text-muted-foreground">Contratos de todos os parceiros</p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Contrato
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou parceiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por parceiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os parceiros</SelectItem>
                {partners.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="pending_signature">Pend. Assinatura</SelectItem>
                <SelectItem value="signed">Assinado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="terminated">Rescindido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum contrato encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map(contract => (
                    <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{contract.partner?.name}</TableCell>
                      <TableCell>{contract.title}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>
                        {contract.contract_value 
                          ? `${contract.currency} ${Number(contract.contract_value).toLocaleString('pt-BR')}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {contract.start_date && contract.end_date ? (
                          <span className="text-sm">
                            {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                            {' - '}
                            {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
