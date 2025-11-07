import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PartnerLogoUploaderProps {
  partnerId: string;
  currentLogoUrl?: string;
  onLogoUpdated: (logoUrl: string | null) => void;
}

export function PartnerLogoUploader({ partnerId, currentLogoUrl, onLogoUpdated }: PartnerLogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG, SVG ou WEBP.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 2MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Obter user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${partnerId}-${Date.now()}.${fileExt}`;

      // Upload para o storage
      const { data, error } = await supabase.storage
        .from('partner-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('partner-logos')
        .getPublicUrl(data.path);

      // Atualizar parceiro no banco
      const { error: updateError } = await supabase
        .from('partners')
        .update({ logo_url: publicUrl })
        .eq('id', partnerId);

      if (updateError) throw updateError;

      setPreview(publicUrl);
      onLogoUpdated(publicUrl);
      toast.success('Logo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      toast.error('Erro ao enviar logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      // Atualizar parceiro no banco
      const { error } = await supabase
        .from('partners')
        .update({ logo_url: null })
        .eq('id', partnerId);

      if (error) throw error;

      setPreview(null);
      onLogoUpdated(null);
      toast.success('Logo removido');
    } catch (error) {
      console.error('Erro ao remover logo:', error);
      toast.error('Erro ao remover logo');
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Logo do Parceiro</label>
      
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
          {preview ? (
            <img src={preview} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-2">
          <label htmlFor="logo-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
            >
              <span className="cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {preview ? 'Alterar' : 'Enviar'} Logo
                  </>
                )}
              </span>
            </Button>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/jpeg,image/png,image/svg+xml,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveLogo}
              disabled={isUploading}
            >
              <X className="w-4 h-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG, SVG ou WEBP. Máximo 2MB.
      </p>
    </div>
  );
}
