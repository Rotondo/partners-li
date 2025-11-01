import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "default" | "destructive";
}

export function ErrorAlert({
  title = "Erro",
  message,
  onRetry,
  variant = "destructive",
}: ErrorAlertProps) {
  return (
    <Alert variant={variant} className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between gap-4">
        <span className="flex-1">{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <RefreshCw className="h-3 w-3" />
            Tentar Novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export function ErrorState({
  title = "Algo deu errado",
  message,
  onRetry,
  fullPage = false,
}: ErrorStateProps) {
  const content = (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        {content}
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-12">
      {content}
    </div>
  );
}
