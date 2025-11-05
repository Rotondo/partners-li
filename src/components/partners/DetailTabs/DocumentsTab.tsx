import { useEffect, useState } from "react";
import { PartnerDocument } from "@/types/crm";
import { getPartnerDocuments } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "../DocumentUploader";
import { getSignedUrl } from "@/lib/storage";

interface DocumentsTabProps {
  partnerId: string;
  onUpdate?: () => void;
}

export const DocumentsTab = ({ partnerId, onUpdate }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<PartnerDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [partnerId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getPartnerDocuments(partnerId);
      setDocuments(data);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Erro ao carregar documentos");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (storagePath: string) => {
    const url = await getSignedUrl(storagePath, 3600);
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando documentos...</div>;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <DocumentUploader partnerId={partnerId} onUploadComplete={loadDocuments} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Documentos ({documents.length})</h3>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhum documento anexado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Use o formulário acima para fazer upload
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.file_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.document_type && (
                            <Badge variant="outline" className="text-xs">
                              {doc.document_type}
                            </Badge>
                          )}
                          {doc.file_size && (
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(doc.file_size)}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(doc.storage_path)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
