import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForTokens } from '@/lib/google-calendar-oauth';
import { saveCalendarSyncConfig } from '@/lib/db';
import { toast } from 'sonner';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      toast.error(`Erro na autorização: ${error}`);
      navigate('/admin?tab=calendar');
      return;
    }

    if (code) {
      handleCallback(code);
    } else {
      toast.error('Código de autorização não encontrado');
      navigate('/admin?tab=calendar');
    }
  }, [code, error]);

  const handleCallback = async (code: string) => {
    try {
      toast.loading('Conectando Google Calendar...');
      
      // Trocar código por tokens
      const tokens = await exchangeCodeForTokens(code);
      
      if (!tokens.access_token) {
        throw new Error('Tokens não recebidos');
      }

      // Calcular expiração
      const expiresAt = tokens.expires_in 
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null;

      // Salvar tokens no banco
      await saveCalendarSyncConfig({
        calendar_url: '', // Não usado no OAuth
        enabled: true,
        google_access_token: tokens.access_token,
        google_refresh_token: tokens.refresh_token,
        google_token_expires_at: expiresAt,
        connected_via_oauth: true,
      } as any);

      toast.dismiss();
      toast.success('Google Calendar conectado com sucesso!');
      navigate('/admin?tab=calendar&connected=true');
    } catch (error: any) {
      console.error('Error connecting Google Calendar:', error);
      toast.dismiss();
      toast.error(`Erro ao conectar: ${error.message || 'Erro desconhecido'}`);
      navigate('/admin?tab=calendar&error=connection_failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Conectando Google Calendar...</p>
      </div>
    </div>
  );
}

