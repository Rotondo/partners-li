import { useState, useMemo, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Trash2 } from "lucide-react";
import { Partner, PartnerKPI, PARTNER_TYPE_COLORS } from "@/types/ecosystem-partner";
import { QuadrantScores, computeXScore, computeYScore } from "@/lib/quadrant-scores";
import { DEFAULT_SCORES } from "@/hooks/usePartnerScores";

interface ScoreEditorDrawerProps {
  partner: Partner | null;
  kpi: PartnerKPI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentScores: QuadrantScores | null;
  maxStoresInEco: number;
  onSave: (partnerId: string, scores: QuadrantScores, notes?: string) => Promise<void>;
  onDelete?: (partnerId: string) => Promise<void>;
}

const SCORE_FIELDS: { key: keyof QuadrantScores; label: string; axis: "x" | "y"; description: string }[] = [
  { key: "segment_quality_score", label: "Qualidade Técnica", axis: "x", description: "Qualidade da integração, documentação e suporte técnico" },
  { key: "market_presence_score", label: "Presença de Mercado", axis: "y", description: "Reconhecimento da marca, market share e reputação" },
  { key: "team_size_score", label: "Tamanho do Time", axis: "y", description: "Capacidade operacional e escalabilidade da equipe" },
  { key: "financial_health_score", label: "Solidez Financeira", axis: "y", description: "Estabilidade financeira e sustentabilidade do negócio" },
  { key: "product_roadmap_score", label: "Roadmap de Produto", axis: "y", description: "Visão de futuro, inovação e alinhamento estratégico" },
  { key: "partnership_engagement_score", label: "Engajamento LI", axis: "y", description: "Nível de comprometimento e proatividade na parceria" },
];

export function ScoreEditorDrawer({
  partner,
  kpi,
  open,
  onOpenChange,
  currentScores,
  maxStoresInEco,
  onSave,
  onDelete,
}: ScoreEditorDrawerProps) {
  const [scores, setScores] = useState<QuadrantScores>(DEFAULT_SCORES);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasCustomScores = currentScores !== null;

  useEffect(() => {
    if (currentScores) {
      setScores(currentScores);
    } else {
      setScores(DEFAULT_SCORES);
    }
    setNotes("");
  }, [currentScores, partner?.id]);

  const preview = useMemo(() => {
    if (!kpi) return { x: 0, y: 0, xBreakdown: [], yBreakdown: [] };
    const xResult = computeXScore(kpi, scores, maxStoresInEco);
    const yResult = computeYScore(scores, 0);
    return { x: xResult.score, y: yResult.score, xBreakdown: xResult.breakdown, yBreakdown: yResult.breakdown };
  }, [scores, kpi, maxStoresInEco]);

  const handleSave = async () => {
    if (!partner) return;
    setSaving(true);
    try {
      await onSave(partner.id, scores, notes);
      onOpenChange(false);
    } catch {
      // error handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!partner || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(partner.id);
      setScores(DEFAULT_SCORES);
      onOpenChange(false);
    } catch {
      // error handled in hook
    } finally {
      setDeleting(false);
    }
  };

  const handleReset = () => {
    setScores(currentScores ?? DEFAULT_SCORES);
  };

  if (!partner) return null;

  const color = PARTNER_TYPE_COLORS[partner.type] ?? "#888";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            {partner.name}
          </SheetTitle>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{partner.type}</p>
            {hasCustomScores ? (
              <Badge variant="default" className="text-[10px]">Avaliado</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-dashed">Padrão</Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Live preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preview do Posicionamento</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Qualidade & Aderência (X)</p>
                <p className="text-2xl font-bold text-primary">{preview.x.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Capacidade & Visão (Y)</p>
                <p className="text-2xl font-bold text-primary">{preview.y.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sua Avaliação</p>
            {SCORE_FIELDS.map((field) => (
              <div key={field.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">{field.label}</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{field.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs font-mono">
                      {scores[field.key].toFixed(1)}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {field.axis === "x" ? "Eixo X" : "Eixo Y"}
                    </Badge>
                  </div>
                </div>
                <Slider
                  value={[scores[field.key]]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={([v]) => setScores((prev) => ({ ...prev, [field.key]: v }))}
                />
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Breakdown dos Scores</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Eixo X: {preview.x.toFixed(1)}</p>
                {preview.xBreakdown.map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5">
                    <div className="w-14 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                    </div>
                    <span className="text-muted-foreground truncate">{b.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Eixo Y: {preview.y.toFixed(1)}</p>
                {preview.yBreakdown.map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5">
                    <div className="w-14 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                    </div>
                    <span className="text-muted-foreground truncate">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm">Notas da Avaliação</Label>
            <Textarea
              placeholder="Observações sobre este parceiro, justificativas das notas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-3 w-3 mr-1" />
              Resetar
            </Button>
            {hasCustomScores && onDelete && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-3 w-3 mr-1" />
                {deleting ? "..." : "Excluir"}
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="h-3 w-3 mr-1" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
