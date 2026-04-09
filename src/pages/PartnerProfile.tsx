import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Globe, Mail, Store, Star, TrendingUp, HeadphonesIcon, Clock, Wifi, SlidersHorizontal, Save, RotateCcw, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { getPartnerById, getPartnerKPIs, mockPartnerKPIs } from "@/data/mock-partners";
import { Button } from "@/components/ui/button";
import { SegmentKPIs } from "@/components/SegmentKPIs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePartnerScores, DEFAULT_SCORES } from "@/hooks/usePartnerScores";
import { QuadrantScores, computeXScore, computeYScore } from "@/lib/quadrant-scores";

const SCORE_FIELDS: { key: keyof QuadrantScores; label: string; axis: "x" | "y"; description: string }[] = [
  { key: "segment_quality_score", label: "Qualidade Técnica", axis: "x", description: "Qualidade da integração, documentação e suporte técnico" },
  { key: "market_presence_score", label: "Presença de Mercado", axis: "y", description: "Reconhecimento da marca e market share" },
  { key: "team_size_score", label: "Tamanho do Time", axis: "y", description: "Capacidade operacional da equipe" },
  { key: "financial_health_score", label: "Solidez Financeira", axis: "y", description: "Estabilidade financeira do negócio" },
  { key: "product_roadmap_score", label: "Roadmap de Produto", axis: "y", description: "Visão de futuro e inovação" },
  { key: "partnership_engagement_score", label: "Engajamento LI", axis: "y", description: "Comprometimento e proatividade na parceria" },
];

export default function PartnerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const partner = getPartnerById(id || "");
  const kpis = getPartnerKPIs(id || "");
  const latest = kpis[kpis.length - 1];

  const { scoresMap, loading: scoresLoading, saveScores, deleteScores } = usePartnerScores();
  const currentScores = id ? scoresMap[id] ?? null : null;
  const hasCustomScore = currentScores !== null;

  const [editMode, setEditMode] = useState(false);
  const [localScores, setLocalScores] = useState<QuadrantScores>(DEFAULT_SCORES);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const maxStoresInEco = useMemo(() => Math.max(...mockPartnerKPIs.map((k) => k.stores_using), 1), []);

  const startEdit = () => {
    setLocalScores(currentScores ?? DEFAULT_SCORES);
    setNotes("");
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await saveScores(id, localScores, notes);
      setEditMode(false);
    } catch {
      // handled in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await deleteScores(id);
      setEditMode(false);
    } catch {
      // handled in hook
    } finally {
      setSaving(false);
    }
  };

  const displayScores = editMode ? localScores : (currentScores ?? DEFAULT_SCORES);

  const preview = useMemo(() => {
    if (!latest) return { x: 0, y: 0, xBreakdown: [], yBreakdown: [] };
    const xResult = computeXScore(latest, displayScores, maxStoresInEco);
    const yResult = computeYScore(displayScores, 0);
    return { x: xResult.score, y: yResult.score, xBreakdown: xResult.breakdown, yBreakdown: yResult.breakdown };
  }, [displayScores, latest, maxStoresInEco]);

  if (!partner) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Parceiro não encontrado
      </div>
    );
  }

  const chartData = kpis.map((k) => ({
    period: k.period,
    NPS: Number(k.nps_score.toFixed(1)),
    "Lojas Ativas": k.stores_using,
  }));

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold font-display">{partner.name}</h1>
              <StatusBadge status={partner.status} />
              {hasCustomScore ? (
                <Badge variant="default" className="text-[10px]">Avaliado</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-dashed">Sem avaliação</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">{partner.type}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {partner.macro_categories.map((c) => (
                <span key={c} className="rounded bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{partner.website}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{partner.contact_email}</span>
              <span>Desde {new Date(partner.since).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {partner.business_models_served.map((m) => (
              <span key={m} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{m}</span>
            ))}
            {partner.store_sizes_served.map((s) => (
              <span key={s} className="rounded-full border border-primary/30 px-2.5 py-0.5 text-xs text-primary">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Universal KPIs */}
      {latest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Lojas Ativas" value={latest.stores_using} icon={Store} trend="up" trendValue={`+${latest.stores_new} novas`} />
          <KPICard title="NPS" value={latest.nps_score.toFixed(1)} icon={Star} />
          <KPICard title="CSAT" value={`${latest.csat_score.toFixed(1)}%`} icon={TrendingUp} />
          <KPICard title="Uptime" value={`${latest.integration_uptime_pct.toFixed(2)}%`} icon={Wifi} />
          <KPICard title="Novas Lojas" value={latest.stores_new} icon={Store} />
          <KPICard title="Churn" value={latest.stores_churned} icon={TrendingUp} trend={latest.stores_churned > 3 ? "down" : "neutral"} trendValue={`${latest.stores_churned} lojas`} />
          <KPICard title="Tickets Abertos" value={latest.support_tickets_open} icon={HeadphonesIcon} />
          <KPICard title="Receita Influenciada" value={`R$ ${(latest.revenue_influenced / 1000).toFixed(0)}K`} icon={Clock} />
        </div>
      )}

      {/* Strategic Scores Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground font-display flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Avaliação Estratégica
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Sua percepção sobre este parceiro nos eixos do Quadrante Estratégico
            </p>
          </div>
          {!editMode ? (
            <Button variant="default" size="sm" onClick={startEdit} disabled={scoresLoading}>
              <SlidersHorizontal className="h-3 w-3 mr-1" />
              {hasCustomScore ? "Editar Avaliação" : "Avaliar Parceiro"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancelar</Button>
              {hasCustomScore && (
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              )}
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-3 w-3 mr-1" />
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>

        {/* Position Preview */}
        <div className="rounded-lg border border-border bg-muted/30 p-4 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Qualidade & Aderência (X)</p>
              <p className="text-2xl font-bold text-primary">{preview.x.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Capacidade & Visão (Y)</p>
              <p className="text-2xl font-bold text-primary">{preview.y.toFixed(1)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground mb-1">Quadrante</p>
              <p className="text-sm font-semibold text-foreground">
                {preview.x >= 50 && preview.y >= 50 && "🟢 Parceiro Estratégico"}
                {preview.x < 50 && preview.y >= 50 && "🟣 Parceiro com Potencial"}
                {preview.x >= 50 && preview.y < 50 && "🟡 Parceiro Consolidado"}
                {preview.x < 50 && preview.y < 50 && "🔴 Em Desenvolvimento"}
              </p>
            </div>
          </div>
        </div>

        {/* Score Sliders or Read-Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {SCORE_FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">{field.label}</Label>
                  <p className="text-[10px] text-muted-foreground">{field.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs font-mono">
                    {displayScores[field.key].toFixed(1)}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {field.axis === "x" ? "X" : "Y"}
                  </Badge>
                </div>
              </div>
              {editMode ? (
                <Slider
                  value={[localScores[field.key]]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={([v]) => setLocalScores((prev) => ({ ...prev, [field.key]: v }))}
                />
              ) : (
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${displayScores[field.key] * 10}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Notes in edit mode */}
        {editMode && (
          <div className="mt-5 space-y-2">
            <Label className="text-sm">Notas da Avaliação</Label>
            <Textarea
              placeholder="Observações sobre este parceiro, justificativas das notas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Breakdown */}
        <div className="mt-5 grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <p className="font-medium text-foreground text-sm">Breakdown Eixo X</p>
            {preview.xBreakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                </div>
                <span className="text-muted-foreground">{b.label}</span>
                <span className="ml-auto font-mono text-foreground">{b.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <p className="font-medium text-foreground text-sm">Breakdown Eixo Y</p>
            {preview.yBreakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                </div>
                <span className="text-muted-foreground">{b.label}</span>
                <span className="ml-auto font-mono text-foreground">{b.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment KPIs */}
      {latest && <SegmentKPIs type={partner.type} kpis={latest.segment_specific_kpis} />}

      {/* Timeline Chart */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-card-foreground mb-4 font-display">Evolução Temporal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(232,15%,19%)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(232,14%,60%)" }} />
            <YAxis yAxisId="nps" tick={{ fontSize: 11, fill: "hsl(232,14%,60%)" }} />
            <YAxis yAxisId="stores" orientation="right" tick={{ fontSize: 11, fill: "hsl(232,14%,60%)" }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(228,18%,13%)", border: "1px solid hsl(232,15%,19%)", borderRadius: 8, color: "hsl(230,33%,96%)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line yAxisId="nps" type="monotone" dataKey="NPS" stroke="hsl(157,100%,38%)" strokeWidth={2} dot={{ r: 3 }} />
            <Line yAxisId="stores" type="monotone" dataKey="Lojas Ativas" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
