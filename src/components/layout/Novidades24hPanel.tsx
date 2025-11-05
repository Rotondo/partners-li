import { Sparkles } from "lucide-react";
import { getRecentChanges } from "@/lib/changes-24h";
import { Badge } from "@/components/ui/badge";

export function Novidades24hPanel() {
  const changes = getRecentChanges().slice(0, 5);

  if (changes.length === 0) {
    return null;
  }

  const typeColors = {
    feat: "bg-green-500/10 text-green-700 dark:text-green-400",
    fix: "bg-red-500/10 text-red-700 dark:text-red-400",
    chore: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
    docs: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    refactor: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  };

  return (
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-sidebar-foreground/70" />
        <h3 className="text-sm font-semibold text-sidebar-foreground">Novidades (24h)</h3>
      </div>
      
      <div className="space-y-2">
        {changes.map((change, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex items-start gap-2">
              <Badge 
                variant="secondary" 
                className={`text-[10px] px-1.5 py-0 ${typeColors[change.type]}`}
              >
                {change.type}
              </Badge>
              <div className="flex-1 leading-relaxed">
                {change.scope && (
                  <span className="text-sidebar-foreground/50">({change.scope}): </span>
                )}
                <span className="text-sidebar-foreground/70">{change.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
