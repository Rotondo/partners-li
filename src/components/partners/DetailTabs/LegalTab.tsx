import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  listContracts, 
  upsertContract, 
  updateContractStatus,
  listContractVersions,
  addContractVersion,
} from "@/lib/contracts";
import { uploadToPartnerDocuments, getSignedUrl } from "@/lib/storage";
import { Contract, ContractStatus, CONTRACT_STATUS_LABELS, NewContract } from "@/types/contracts";
import { toast } from "sonner";

interface LegalTabProps {
  partnerId: string;
}

export const LegalTab = ({ partnerId }: LegalTabProps) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContractOpen, setNewContractOpen] = useState(false);
  const [uploadingVersion, setUploadingVersion] = useState<string | null>(null);
  const [versions, setVersions] = useState<Record<string, any[]>>({});

  // New contract form
  const [newContract, setNewContract] = useState<NewContract>({
    partnerId,
    title: '',
    status: 'draft',
    currency: 'BRL',
    autoRenew: false,
  });

  useEffect(() => {
    loadContracts();
  }, [partnerId]);

  const loadContracts = async () => {
    setLoading(true);
    const data = await listContracts(partnerId);
    setContracts(data);
    setLoading(false);
  };

  const loadVersions = async (contractId: string) => {
    const data = await listContractVersions(contractId);
    setVersions(prev => ({ ...prev, [contractId]: data }));
  };

  const handleCreateContract = async () => {
    if (!newContract.title.trim()) {
      toast.error("Título do contrato é obrigatório");
      return;
    }

    const contractId = await upsertContract(newContract);
    if (contractId) {
      setNewContractOpen(false);
      setNewContract({
        partnerId,
        title: '',
        status: 'draft',
        currency: 'BRL',
        autoRenew: false,
      });
      loadContracts();
    }
  };

  const handleStatusChange = async (contractId: string, status: ContractStatus) => {
    const success = await updateContractStatus(contractId, status);
    if (success) {
      loadContracts();
    }
  };

  const handleUploadVersion = async (contractId: string, file: File) => {
    setUploadingVersion(contractId);
    
    // Get next version number
    const contractVersions = versions[contractId] || [];
    const nextVersion = contractVersions.length > 0 
      ? Math.max(...contractVersions.map(v => v.versionNumber)) + 1 
      : 1;

    // Upload file
    const timestamp = Date.now();
    const fileName = file.name;
    const path = `contracts/${contractId}/${nextVersion}_${timestamp}_${fileName}`;
    
    const { path: uploadedPath, error } = await uploadToPartnerDocuments(path, file);
    
    if (error || !uploadedPath) {
      setUploadingVersion(null);
      return;
    }

    // Save version metadata
    const success = await addContractVersion({
      contractId,
      versionNumber: nextVersion,
      storagePath: uploadedPath,
    });

    if (success) {
      loadVersions(contractId);
    }

    setUploadingVersion(null);
  };

  const handleDownloadVersion = async (storagePath: string) => {
    const url = await getSignedUrl(storagePath, 3600);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando contratos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contratos Jurídicos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie contratos, versões e status
          </p>
        </div>
        <Dialog open={newContractOpen} onOpenChange={setNewContractOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Contrato</DialogTitle>
              <DialogDescription>
                Adicione um novo contrato para este parceiro
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título do Contrato *</Label>
                <Input
                  value={newContract.title}
                  onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
                  placeholder="Ex: Contrato de Prestação de Serviços 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor do Contrato</Label>
                  <Input
                    type="number"
                    value={newContract.contractValue || ''}
                    onChange={(e) => setNewContract({ ...newContract, contractValue: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Moeda</Label>
                  <Select
                    value={newContract.currency}
                    onValueChange={(value) => setNewContract({ ...newContract, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL (R$)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    onChange={(e) => setNewContract({ ...newContract, startDate: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    onChange={(e) => setNewContract({ ...newContract, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={newContract.autoRenew}
                  onChange={(e) => setNewContract({ ...newContract, autoRenew: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="autoRenew">Renovação Automática</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewContractOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateContract}>
                Criar Contrato
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum contrato cadastrado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Clique em "Novo Contrato" para começar
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{contract.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {contract.contractValue && (
                        <span>Valor: {contract.currency} {contract.contractValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} · </span>
                      )}
                      {contract.startDate && contract.endDate && (
                        <span>
                          Vigência: {format(contract.startDate, "dd/MM/yyyy", { locale: ptBR })} até {format(contract.endDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                      {contract.autoRenew && <span className="ml-2 text-xs">(Renovação Automática)</span>}
                    </CardDescription>
                  </div>
                  <Select
                    value={contract.status}
                    onValueChange={(value) => handleStatusChange(contract.id, value as ContractStatus)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONTRACT_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Versions Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Versões do Contrato</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`upload-${contract.id}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadVersion(contract.id, file);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            document.getElementById(`upload-${contract.id}`)?.click();
                            loadVersions(contract.id);
                          }}
                          disabled={uploadingVersion === contract.id}
                        >
                          <Upload className="h-3 w-3 mr-2" />
                          {uploadingVersion === contract.id ? 'Enviando...' : 'Upload Nova Versão'}
                        </Button>
                      </div>
                    </div>

                    {versions[contract.id] && versions[contract.id].length > 0 ? (
                      <div className="space-y-2">
                        {versions[contract.id].map((version) => (
                          <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">Versão {version.versionNumber}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(version.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadVersion(version.storagePath)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma versão enviada ainda
                      </p>
                    )}
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
