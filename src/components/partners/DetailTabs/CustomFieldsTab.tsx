import { Partner } from "@/types/partner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings2 } from "lucide-react";

interface CustomFieldsTabProps {
  partner: Partner;
}

export function CustomFieldsTab({ partner }: CustomFieldsTabProps) {
  const hasCustomFields = partner.customFields && Object.keys(partner.customFields).length > 0;
  const hasContactFields = partner.contactFields && Object.keys(partner.contactFields).length > 0;

  if (!hasCustomFields && !hasContactFields) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Settings2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Nenhum Campo Personalizado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Este parceiro não possui campos personalizados configurados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderFieldValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <div className="space-y-6">
      {hasCustomFields && (
        <Card>
          <CardHeader>
            <CardTitle>Campos Customizados</CardTitle>
            <CardDescription>
              Campos personalizados configurados pelo administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(partner.customFields!).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {key}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {typeof value}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    {typeof value === "object" && !Array.isArray(value) ? (
                      <pre className="mt-2 rounded bg-muted p-2 text-xs overflow-x-auto">
                        {renderFieldValue(value)}
                      </pre>
                    ) : (
                      <span className="font-semibold">{renderFieldValue(value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasContactFields && (
        <Card>
          <CardHeader>
            <CardTitle>Campos de Contato</CardTitle>
            <CardDescription>
              Informações de contato personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(partner.contactFields!).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {key}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {typeof value}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    {typeof value === "object" && !Array.isArray(value) ? (
                      <pre className="mt-2 rounded bg-muted p-2 text-xs overflow-x-auto">
                        {renderFieldValue(value)}
                      </pre>
                    ) : (
                      <span className="font-semibold">{renderFieldValue(value)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(hasCustomFields || hasContactFields) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Settings2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Campos Configuráveis
                </p>
                <p className="text-sm text-blue-700">
                  Estes campos podem ser personalizados na seção Admin para atender às necessidades específicas do seu negócio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
