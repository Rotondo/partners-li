import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { uploadToPartnerDocuments } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentUploaderProps {
  partnerId: string;
  onUploadComplete?: () => void;
}

const DOCUMENT_CATEGORIES = [
  { value: 'contract', label: 'Contrato' },
  { value: 'invoice', label: 'Nota Fiscal' },
  { value: 'proposal', label: 'Proposta Comercial' },
  { value: 'agreement', label: 'Acordo' },
  { value: 'certificate', label: 'Certificado' },
  { value: 'report', label: 'Relatório' },
  { value: 'other', label: 'Outro' },
];

export const DocumentUploader = ({ partnerId, onUploadComplete }: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para enviar");
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Upload to storage
      const timestamp = Date.now();
      const fileName = file.name;
      const path = `documents/${partnerId}/${category}_${timestamp}_${fileName}`;
      
      const { path: uploadedPath, error: uploadError } = await uploadToPartnerDocuments(path, file);
      
      if (uploadError || !uploadedPath) {
        toast.error("Erro ao fazer upload do arquivo");
        return;
      }

      // Save metadata to partner_documents table
      const { error: dbError } = await supabase
        .from('partner_documents')
        .insert({
          partner_id: partnerId,
          user_id: user.id,
          file_name: fileName,
          file_type: file.type,
          file_size: file.size,
          document_type: category,
          description: description || null,
          storage_path: uploadedPath,
        });

      if (dbError) {
        console.error("Error saving document metadata:", dbError);
        toast.error("Erro ao salvar informações do documento");
        return;
      }

      toast.success("Documento enviado com sucesso!");
      
      // Reset form
      setFile(null);
      setCategory('other');
      setDescription('');
      
      // Clear file input
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent
      onUploadComplete?.();

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h4 className="font-medium">Enviar Novo Documento</h4>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="document-upload">Arquivo *</Label>
          <Input
            id="document-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt"
            disabled={uploading}
          />
          {file && (
            <p className="text-xs text-muted-foreground mt-1">
              Selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Categoria *</Label>
          <Select value={category} onValueChange={setCategory} disabled={uploading}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrição do documento..."
            rows={3}
            disabled={uploading}
          />
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Enviar Documento
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
