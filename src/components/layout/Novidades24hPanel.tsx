import { useEffect, useState } from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getChangesFromChangelog, formatChangeType, type ChangelogItem } from "@/lib/changelog-parser";

export function Novidades24hPanel() {
  const [changes, setChanges] = useState<ChangelogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChanges() {
      const items = await getChangesFromChangelog();
      setChanges(items);
      setLoading(false);
    }
    loadChanges();
  }, []);

  if (loading) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Carregando novidades...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (changes.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Novidades (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Sem alterações registradas nas últimas 24 horas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Novidades (24h)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {changes.map((change, index) => {
          const typeInfo = formatChangeType(change.type);
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className={`text-xs shrink-0 ${typeInfo.color}`}>
                  {typeInfo.label}
                </Badge>
                {change.scope && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {change.scope}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {change.title}
              </p>
            </div>
          );
        })}
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => window.open('/CHANGELOG.md', '_blank')}
        >
          Ver histórico completo
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
