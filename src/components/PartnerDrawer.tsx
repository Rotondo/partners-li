import { Partner, PartnerKPI, PARTNER_TYPE_COLORS } from "@/types/ecosystem-partner";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface PartnerDrawerProps {
  partner: Partner | null;
  kpi: PartnerKPI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasCustomScore?: boolean;
  onEditScores?: (partner: Partner) => void;
}

export function PartnerDrawer({ partner, kpi, open, onOpenChange, hasCustomScore, onEditScores }: PartnerDrawerProps) {
  if (!partner) return null;

  const typeColor = PARTNER_TYPE_COLORS[partner.type] ?? "#888";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[440px] overflow-y-auto bg-card border-border">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-background"
              style={{ backgroundColor: typeColor }}
            >
              {partner.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <SheetTitle className="text-foreground flex items-center gap-2">
                {partner.name}
                {hasCustomScore !== undefined && (
                  hasCustomScore ? (
                    <Badge variant="default" className="text-[10px]">Avaliado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-dashed">Sem avaliação</Badge>
                  )
                )}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span style={{ color: typeColor }}>{partner.type}</span>
                <StatusBadge status={partner.status} />
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 pt-2">
          {/* Journey Stages */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Etapas da Jornada</p>
            <div className="flex flex-wrap gap-1.5">
              {partner.macro_categories.map((cat) => (
                <span key={cat} className="px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* KPIs */}
          {kpi && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">KPIs (último período)</p>
              <div className="grid grid-cols-2 gap-3">
                <MiniKPI label="Lojas Ativas" value={kpi.stores_using.toString()} />
                <MiniKPI label="NPS" value={kpi.nps_score.toFixed(1)} />
                <MiniKPI label="CSAT" value={kpi.csat_score.toFixed(1)} />
                <MiniKPI label="Uptime" value={`${kpi.integration_uptime_pct.toFixed(1)}%`} />
                <MiniKPI label="Novas Lojas" value={kpi.stores_new.toString()} />
                <MiniKPI label="Churn" value={kpi.stores_churned.toString()} />
              </div>
            </div>
          )}

          {/* Info */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Informações</p>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Desde: <span className="text-foreground">{partner.since}</span></p>
              <p className="text-muted-foreground">Ticket: <span className="text-foreground">{partner.average_ticket_range}</span></p>
              <p className="text-muted-foreground">Recorrência: <span className="text-foreground">{partner.revenue_recurrence}</span></p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="default" size="sm">
              <Link to={`/ecosystem/partners/${partner.id}`}>
                Ver perfil completo <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
            {onEditScores && (
              <Button variant="secondary" size="sm" onClick={() => onEditScores(partner)}>
                <SlidersHorizontal className="mr-1 h-3 w-3" />
                Avaliar Parceiro
              </Button>
            )}
            {partner.website && (
              <Button asChild variant="outline" size="sm">
                <a href={partner.website} target="_blank" rel="noopener noreferrer">
                  Site <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MiniKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
