import { useState, useMemo } from "react";
import { mockPartners, mockPartnerKPIs, getLatestKPI } from "@/data/mock-partners";
import { PARTNER_TYPE_COLORS, PartnerType, Partner } from "@/types/ecosystem-partner";
import { computeAllQuadrantPoints, ComputedQuadrantPoint } from "@/lib/quadrant-scores";
import { ScoreEditorDrawer } from "@/components/ScoreEditorDrawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { usePartnerScores } from "@/hooks/usePartnerScores";

const ALL_TYPES = Object.keys(PARTNER_TYPE_COLORS) as PartnerType[];

const QUADRANT_LABELS = [
  { label: "Parceiros com Potencial", x: "left", y: "top", color: "#6366F1", bg: "rgba(99,102,241,0.04)" },
  { label: "Parceiros Estratégicos", x: "right", y: "top", color: "#00C07F", bg: "rgba(0,192,127,0.04)" },
  { label: "Em Desenvolvimento", x: "left", y: "bottom", color: "#EF4444", bg: "rgba(239,68,68,0.04)" },
  { label: "Parceiros Consolidados", x: "right", y: "bottom", color: "#F59E0B", bg: "rgba(245,158,11,0.04)" },
];

export default function StrategicQuadrant() {
  const [visibleTypes, setVisibleTypes] = useState<Set<PartnerType>>(new Set(ALL_TYPES));
  const [showScores, setShowScores] = useState(false);
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);
  const [editorPartner, setEditorPartner] = useState<Partner | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  
  const { scoresMap, loading, saveScores, deleteScores } = usePartnerScores();

  const maxStoresInEco = useMemo(() => Math.max(...mockPartnerKPIs.map((k) => k.stores_using), 1), []);

  const allPoints = useMemo(
    () => computeAllQuadrantPoints(mockPartners, mockPartnerKPIs, Object.keys(scoresMap).length > 0 ? scoresMap : undefined),
    [scoresMap]
  );

  const filteredPoints = useMemo(() => {
    let pts = allPoints.filter((p) => visibleTypes.has(p.partner.type));
    if (activeQuadrant) {
      pts = pts.filter((p) => {
        const inRight = p.x >= 50;
        const inTop = p.y >= 50;
        if (activeQuadrant === "top-right") return inRight && inTop;
        if (activeQuadrant === "top-left") return !inRight && inTop;
        if (activeQuadrant === "bottom-right") return inRight && !inTop;
        if (activeQuadrant === "bottom-left") return !inRight && !inTop;
        return true;
      });
    }
    return pts;
  }, [allPoints, visibleTypes, activeQuadrant]);

  const toggleType = (type: PartnerType) => {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const openEditor = (partner: Partner) => {
    setEditorPartner(partner);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Quadrante Estratégico</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Posicionamento dos parceiros por Qualidade & Aderência vs Capacidade & Visão de Crescimento.
          Clique em um parceiro para avaliar.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-1.5 cursor-pointer text-xs">
              <Checkbox checked={visibleTypes.has(type)} onCheckedChange={() => toggleType(type)} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PARTNER_TYPE_COLORS[type] }} />
              <span className="text-foreground">{type}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            variant={showScores ? "default" : "outline"}
            size="sm"
            onClick={() => setShowScores(!showScores)}
          >
            {showScores ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            Scores
          </Button>
          <Button
            variant={activeQuadrant ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveQuadrant(null)}
          >
            Todos
          </Button>
          {[
            { key: "top-left", label: "Potencial" },
            { key: "top-right", label: "Estratégico" },
            { key: "bottom-left", label: "Desenvolvimento" },
            { key: "bottom-right", label: "Consolidado" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={activeQuadrant === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveQuadrant(activeQuadrant === key ? null : key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quadrant Chart */}
      <div className="relative bg-card border border-border rounded-xl overflow-hidden" style={{ height: 600 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-30">
            <span className="text-sm text-muted-foreground animate-pulse">Carregando scores...</span>
          </div>
        )}

        {QUADRANT_LABELS.map((q) => (
          <div
            key={q.label}
            className="absolute w-1/2 h-1/2 flex items-center justify-center"
            style={{ [q.y]: 0, [q.x]: 0, background: q.bg }}
          >
            <span className="text-xs font-medium opacity-40" style={{ color: q.color }}>{q.label}</span>
          </div>
        ))}

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
          Qualidade e Aderência →
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground whitespace-nowrap">
          Capacidade e Visão →
        </div>

        {[0, 25, 50, 75, 100].map((v) => (
          <span key={`x-${v}`} className="absolute text-[9px] text-muted-foreground" style={{ bottom: 16, left: `${v}%`, transform: "translateX(-50%)" }}>{v}</span>
        ))}
        {[0, 25, 50, 75, 100].map((v) => (
          <span key={`y-${v}`} className="absolute text-[9px] text-muted-foreground" style={{ left: 4, bottom: `${v}%`, transform: "translateY(50%)" }}>{v}</span>
        ))}

        {filteredPoints.map((point) => (
          <QuadrantNode
            key={point.partnerId}
            point={point}
            showScores={showScores}
            hasCustomScore={!!scoresMap[point.partnerId]}
            onClick={() => openEditor(point.partner)}
          />
        ))}
      </div>

      <ScoreEditorDrawer
        partner={editorPartner}
        kpi={editorPartner ? getLatestKPI(editorPartner.id) ?? null : null}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        currentScores={editorPartner ? scoresMap[editorPartner.id] ?? null : null}
        maxStoresInEco={maxStoresInEco}
        onSave={saveScores}
        onDelete={deleteScores}
      />
    </div>
  );
}

function QuadrantNode({ point, showScores, hasCustomScore, onClick }: { point: ComputedQuadrantPoint; showScores: boolean; hasCustomScore: boolean; onClick: () => void }) {
  const color = PARTNER_TYPE_COLORS[point.partner.type] ?? "#888";
  const size = Math.max(24, Math.min(48, point.radius * 1.2));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:z-20 cursor-pointer group"
          style={{
            left: `${point.x}%`,
            bottom: `${point.y}%`,
            width: size,
            height: size,
            backgroundColor: `${color}25`,
            border: `2px solid ${color}`,
            boxShadow: hasCustomScore ? `0 0 8px ${color}50` : undefined,
          }}
        >
          <span className="text-[10px] font-bold" style={{ color }}>{point.partner.name.slice(0, 2).toUpperCase()}</span>
          {hasCustomScore && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
          )}
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap max-w-[80px] truncate">
            {point.partner.name}
          </span>
          {showScores && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary whitespace-nowrap">
              {point.x.toFixed(1)}, {point.y.toFixed(1)}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[300px] p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-semibold text-sm">{point.partner.name}</span>
            <span className="text-xs text-muted-foreground">{point.partner.type}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {hasCustomScore ? "✅ Avaliado — clique para editar" : "Clique para avaliar este parceiro"}
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-medium text-foreground mb-1">X: <span className="text-primary">{point.originalX.toFixed(1)}</span></p>
              {point.xBreakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                  </div>
                  <span className="text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Y: <span className="text-primary">{point.originalY.toFixed(1)}</span></p>
              {point.yBreakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                  </div>
                  <span className="text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
