import { useState, useMemo, useCallback } from "react";
import { mockPartners, getLatestKPI, mockPartnerKPIs } from "@/data/mock-partners";
import { Partner, PARTNER_TYPE_COLORS, JOURNEY_STAGES, PartnerType, JourneyStage } from "@/types/ecosystem-partner";
import { PartnerDrawer } from "@/components/PartnerDrawer";
import { ScoreEditorDrawer } from "@/components/ScoreEditorDrawer";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Filter, ChevronLeft, ChevronDown, ChevronRight, Store, Trophy } from "lucide-react";
import { usePartnerScores } from "@/hooks/usePartnerScores";

const STAGES_ABOVE: JourneyStage[] = [
  "Estratégia e Planejamento",
  "Catálogo e Conteúdo",
  "Conversão e Experiência",
  "Operação e Gestão",
  "Atendimento e Pós-venda",
  "Dados e BI (Transversal)",
];

const STAGES_BELOW: JourneyStage[] = [
  "Criação da Loja / Tecnologia",
  "Aquisição de Clientes / Marketing",
  "Pagamentos e Segurança",
  "Logística e Entrega",
  "Retenção e Expansão",
  "Marketplaces e Omnichannel (Transversal)",
];

const ALL_TYPES = Object.keys(PARTNER_TYPE_COLORS) as PartnerType[];

export default function EcosystemMap() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<PartnerType>>(new Set(ALL_TYPES));
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(["Ativo", "Inativo", "Em análise"]));
  const [drawerPartner, setDrawerPartner] = useState<Partner | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [scoreEditorPartner, setScoreEditorPartner] = useState<Partner | null>(null);
  const [scoreEditorOpen, setScoreEditorOpen] = useState(false);

  const { scoresMap, saveScores, deleteScores } = usePartnerScores();
  const maxStoresInEco = useMemo(() => Math.max(...mockPartnerKPIs.map((k) => k.stores_using), 1), []);

  const filteredPartners = useMemo(() => {
    return mockPartners.filter((p) => {
      if (!selectedTypes.has(p.type)) return false;
      if (!selectedStatuses.has(p.status)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, selectedTypes, selectedStatuses]);

  const getPartnersForStage = useCallback(
    (stage: JourneyStage) => filteredPartners.filter((p) => p.macro_categories.includes(stage)),
    [filteredPartners]
  );

  const toggleType = (type: PartnerType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const openDrawer = (partner: Partner) => {
    setDrawerPartner(partner);
    setDrawerOpen(true);
  };

  const openScoreEditor = (partner: Partner) => {
    setDrawerOpen(false);
    setScoreEditorPartner(partner);
    setScoreEditorOpen(true);
  };

  const toggleExpand = (stage: string) => {
    setExpandedStage((prev) => (prev === stage ? null : stage));
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Filter Panel */}
      <div
        className={`shrink-0 border-r border-border bg-card transition-all duration-300 overflow-y-auto ${
          filterOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden"
        }`}
      >
        {filterOpen && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Filtros</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar parceiro..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipo</p>
              <div className="space-y-1.5">
                {ALL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={selectedTypes.has(type)} onCheckedChange={() => toggleType(type)} />
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PARTNER_TYPE_COLORS[type] }} />
                    <span className="text-foreground">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</p>
              <div className="space-y-1.5">
                {["Ativo", "Inativo", "Em análise"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={selectedStatuses.has(status)} onCheckedChange={() => toggleStatus(status)} />
                    <span className="text-foreground">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                {filteredPartners.length} parceiro{filteredPartners.length !== 1 ? "s" : ""} visível(eis)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Toggle filter button */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="shrink-0 w-6 flex items-center justify-center border-r border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
      >
        {filterOpen ? <ChevronLeft className="h-4 w-4 text-muted-foreground" /> : <Filter className="h-4 w-4 text-muted-foreground" />}
      </button>

      {/* Main fishbone area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-foreground">Mapa do Ecossistema</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Jornada do lojista de ponta a ponta — clique em uma etapa para ver os parceiros
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {ALL_TYPES.filter((t) => selectedTypes.has(t)).map((type) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PARTNER_TYPE_COLORS[type] }} />
              {type}
            </div>
          ))}
        </div>

        {/* Fishbone Journey */}
        <div className="relative min-w-[1000px]">
          {/* Stages Above */}
          <div className="grid grid-cols-6 gap-3 mb-3">
            {STAGES_ABOVE.map((stage) => (
              <StageCard
                key={stage}
                stage={stage}
                partners={getPartnersForStage(stage)}
                expanded={expandedStage === stage}
                onToggle={() => toggleExpand(stage)}
                onPartnerClick={openDrawer}
                side="above"
                scoresMap={scoresMap}
              />
            ))}
          </div>

          {/* Central Spine with Start/End markers */}
          <div className="relative h-16 flex items-center my-1">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-primary whitespace-nowrap">Início</span>
            </div>

            <div className="absolute inset-x-16 top-1/2 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/80 rounded-full" />

            {[20, 40, 60, 80].map((pct) => (
              <div key={pct} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pct}%` }}>
                <ChevronRight className="h-4 w-4 text-primary/50" />
              </div>
            ))}

            <div className="absolute inset-x-16 top-1/2 -translate-y-1/2 flex justify-between px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
              ))}
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 bg-background px-3 z-10">
              <span className="text-xs font-semibold text-primary tracking-wide">
                EVOLUÇÃO DA OPERAÇÃO →
              </span>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-primary whitespace-nowrap">Madura</span>
            </div>
          </div>

          {/* Stages Below */}
          <div className="grid grid-cols-6 gap-3 mt-3">
            {STAGES_BELOW.map((stage) => (
              <StageCard
                key={stage}
                stage={stage}
                partners={getPartnersForStage(stage)}
                expanded={expandedStage === stage}
                onToggle={() => toggleExpand(stage)}
                onPartnerClick={openDrawer}
                side="below"
                scoresMap={scoresMap}
              />
            ))}
          </div>
        </div>
      </div>

      <PartnerDrawer
        partner={drawerPartner}
        kpi={drawerPartner ? getLatestKPI(drawerPartner.id) ?? null : null}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        hasCustomScore={drawerPartner ? !!scoresMap[drawerPartner.id] : false}
        onEditScores={openScoreEditor}
      />

      <ScoreEditorDrawer
        partner={scoreEditorPartner}
        kpi={scoreEditorPartner ? getLatestKPI(scoreEditorPartner.id) ?? null : null}
        open={scoreEditorOpen}
        onOpenChange={setScoreEditorOpen}
        currentScores={scoreEditorPartner ? scoresMap[scoreEditorPartner.id] ?? null : null}
        maxStoresInEco={maxStoresInEco}
        onSave={saveScores}
        onDelete={deleteScores}
      />
    </div>
  );
}

function StageCard({
  stage,
  partners,
  expanded,
  onToggle,
  onPartnerClick,
  side,
  scoresMap,
}: {
  stage: JourneyStage;
  partners: Partner[];
  expanded: boolean;
  onToggle: () => void;
  onPartnerClick: (p: Partner) => void;
  side: "above" | "below";
  scoresMap: Record<string, any>;
}) {
  const count = partners.length;
  const hasPartners = count > 0;
  const evaluatedCount = partners.filter(p => !!scoresMap[p.id]).length;

  return (
    <div className="flex flex-col">
      {side === "above" && (
        <div className="flex justify-center mb-1">
          <div className="w-px h-5 bg-gradient-to-b from-transparent to-primary/30" />
        </div>
      )}

      <button
        onClick={onToggle}
        className={`rounded-lg border p-3 transition-all duration-200 text-left w-full ${
          expanded
            ? "border-primary bg-primary/5 shadow-md"
            : hasPartners
            ? "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
            : "border-dashed border-border/50 bg-card/50"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[11px] font-semibold text-foreground leading-tight flex-1">{stage}</h4>
          <div className="flex items-center gap-1 ml-1">
            <Badge
              variant={hasPartners ? "default" : "outline"}
              className={`text-[10px] h-5 px-1.5 ${!hasPartners ? "border-dashed" : ""}`}
            >
              {count}
            </Badge>
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>

        {!expanded && hasPartners && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex gap-0.5">
              {Array.from(new Set(partners.map((p) => p.type))).map((type) => (
                <span key={type} className="w-2 h-2 rounded-full" style={{ backgroundColor: PARTNER_TYPE_COLORS[type] }} />
              ))}
            </div>
            {evaluatedCount > 0 && (
              <span className="text-[9px] text-primary ml-auto">{evaluatedCount} avaliado{evaluatedCount > 1 ? "s" : ""}</span>
            )}
          </div>
        )}
      </button>

      {expanded && (
        <div className="mt-1 rounded-lg border border-primary/20 bg-card p-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          {partners.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic text-center py-2">Sem parceiros nesta etapa</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {partners.map((p) => (
                <PartnerChip key={p.id} partner={p} onClick={() => onPartnerClick(p)} hasScore={!!scoresMap[p.id]} />
              ))}
            </div>
          )}
        </div>
      )}

      {side === "below" && (
        <div className="flex justify-center mt-1">
          <div className="w-px h-5 bg-gradient-to-t from-transparent to-primary/30" />
        </div>
      )}
    </div>
  );
}

function PartnerChip({ partner, onClick, hasScore }: { partner: Partner; onClick: () => void; hasScore: boolean }) {
  const color = PARTNER_TYPE_COLORS[partner.type] ?? "#888";
  const kpi = getLatestKPI(partner.id);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all hover:scale-105 hover:shadow-md cursor-pointer border relative"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}40`,
            color: color,
          }}
        >
          <span
            className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: color, color: "#0F1117" }}
          >
            {partner.name.slice(0, 1)}
          </span>
          <span className="truncate max-w-[80px]">{partner.name}</span>
          {hasScore && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[240px]">
        <div className="space-y-1">
          <p className="font-semibold text-sm">{partner.name}</p>
          <p className="text-xs" style={{ color }}>{partner.type}</p>
          {hasScore && <p className="text-[10px] text-primary">✅ Avaliado</p>}
          {kpi && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs pt-1 border-t border-border">
              <span className="text-muted-foreground">NPS:</span>
              <span>{kpi.nps_score.toFixed(1)}</span>
              <span className="text-muted-foreground">Lojas:</span>
              <span>{kpi.stores_using}</span>
              <span className="text-muted-foreground">Status:</span>
              <span>{partner.status}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
