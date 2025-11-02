import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw, CheckCircle2, AlertCircle, Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { saveCalendarSyncConfig, getCalendarSyncConfig, syncCalendarNow, deleteCalendarSyncConfig, CalendarSyncConfig } from '@/lib/db';
import { getGoogleAuthUrl } from '@/lib/google-calendar-oauth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export function CalendarSyncSettings() {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [config, setConfig] = useState<CalendarSyncConfig | null>(null);

  useEffect(() => {
    loadConfig();
    
    // Verificar se veio do callback OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      toast.success('Google Calendar conectado com sucesso!');
      // Limpar URL
      window.history.replaceState({}, '', '/admin?tab=calendar');
      loadConfig();
    }
  }, []);

  const loadConfig = async () => {
    try {
      const savedConfig = await getCalendarSyncConfig();
      if (savedConfig) {
        setConfig(savedConfig);
        setEnabled(savedConfig.enabled);
        setLastSync(savedConfig.last_sync_at);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleConnect = () => {
    try {
      const authUrl = getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      toast.error(`Erro ao iniciar conexão: ${error.message}`);
      console.error('Error getting auth URL:', error);
    }
  };

  const handleSyncNow = async () => {
    if (!config) {
      toast.error('Conecte o Google Calendar primeiro');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('Starting sync...');
      const result = await syncCalendarNow();
      console.log('Sync result:', result);
      
      if (result.imported === 0 && result.skipped === 0) {
        toast.warning('Nenhum evento encontrado no calendário ou todos já foram importados anteriormente.');
      } else {
        toast.success(
          `Sincronização concluída! ${result.imported} eventos importados, ${result.skipped} já existiam.`
        );
      }
      
      setLastSync(new Date());
      await loadConfig();
    } catch (error: any) {
      console.error('Error syncing:', error);
      
      let errorMessage = 'Erro na sincronização';
      if (error.message) {
        errorMessage = error.message;
        // Se token expirou, sugerir reconectar
        if (error.message.includes('expirado') || error.message.includes('Token')) {
          errorMessage += ' Por favor, reconecte seu calendário.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleEnabled = async (newValue: boolean) => {
    if (!config) {
      toast.error('Conecte o Google Calendar primeiro');
      return;
    }

    setIsLoading(true);
    try {
      await saveCalendarSyncConfig({
        enabled: newValue,
        google_access_token: config.google_access_token || undefined,
        google_refresh_token: config.google_refresh_token || undefined,
        google_token_expires_at: config.google_token_expires_at || undefined,
        connected_via_oauth: config.connected_via_oauth,
      });
      setEnabled(newValue);
      toast.success(newValue ? 'Sincronização automática ativada' : 'Sincronização automática desativada');
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar o Google Calendar?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteCalendarSyncConfig();
      setConfig(null);
      setEnabled(false);
      setLastSync(null);
      toast.success('Google Calendar desconectado');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Erro ao desconectar');
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = config && (config.connected_via_oauth || config.google_access_token);
  const isTokenExpired = config?.google_token_expires_at 
    ? new Date(config.google_token_expires_at) < new Date()
    : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronização com Google Calendar</CardTitle>
        <CardDescription>
          Conecte seu Google Calendar de forma segura via OAuth. Seu calendário permanece privado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alerta de Segurança */}
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900 dark:text-green-100">Seguro e Privado</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200 text-sm mt-2">
            <p>
              Com OAuth, seu calendário <strong>permanece privado</strong>. 
              Você autoriza apenas este app a ler seus eventos, sem tornar o calendário público.
            </p>
          </AlertDescription>
        </Alert>

        {/* Status da Conexão */}
        {isConnected ? (
          <>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Google Calendar Conectado</p>
                  <p className="text-sm text-muted-foreground">
                    {config.connected_via_oauth ? 'Conectado via OAuth (seguro)' : 'Conectado via iCal'}
                  </p>
                </div>
              </div>
              {isTokenExpired && (
                <Badge variant="destructive">Token Expirado</Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label>Sincronização Automática</Label>
                <p className="text-xs text-muted-foreground">
                  Sincroniza a cada {config.sync_interval_minutes} minutos quando ativado
                </p>
              </div>
              <Switch 
                checked={enabled} 
                onCheckedChange={handleToggleEnabled}
                disabled={isLoading || isTokenExpired}
              />
            </div>

            {isTokenExpired && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Token Expirado</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-sm mb-2">
                    O token de acesso expirou. Por favor, reconecte seu calendário.
                  </p>
                  <Button size="sm" onClick={handleConnect}>
                    Reconectar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {lastSync && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-green-50 dark:bg-green-950/20 rounded">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>
                  Última sincronização: {lastSync.toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSyncNow} 
                disabled={isSyncing || isTokenExpired}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sincronizar Agora
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Desconectar
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não Conectado</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="text-sm mb-3">
                  Conecte seu Google Calendar para sincronizar eventos automaticamente.
                  Você será redirecionado para fazer login e autorizar o acesso.
                </p>
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleConnect} 
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              <Shield className="h-4 w-4 mr-2" />
              Conectar Google Calendar
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao clicar, você será redirecionado para o Google para autorizar o acesso.
              Seu calendário permanecerá privado.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
