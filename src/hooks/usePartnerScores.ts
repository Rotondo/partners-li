import { useState, useEffect, useCallback } from "react";
import { QuadrantScores } from "@/lib/quadrant-scores";
import { toast } from "sonner";
import { ldbGetAll, ldbSetAll } from "@/lib/local-db";

const DEFAULT_SCORES: QuadrantScores = {
  segment_quality_score: 5,
  market_presence_score: 5,
  team_size_score: 5,
  financial_health_score: 5,
  product_roadmap_score: 5,
  partnership_engagement_score: 5,
};

export function usePartnerScores() {
  const [scoresMap, setScoresMap] = useState<Record<string, QuadrantScores>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllScores();
  }, []);

  function loadAllScores() {
    setLoading(true);
    const rows = ldbGetAll<any>('quadrant_scores');
    const map: Record<string, QuadrantScores> = {};
    for (const row of rows) {
      map[row.partner_id] = {
        segment_quality_score: Number(row.segment_quality_score),
        market_presence_score: Number(row.market_presence_score),
        team_size_score: Number(row.team_size_score),
        financial_health_score: Number(row.financial_health_score),
        product_roadmap_score: Number(row.product_roadmap_score),
        partnership_engagement_score: Number(row.partnership_engagement_score),
      };
    }
    setScoresMap(map);
    setLoading(false);
  }

  const getScores = useCallback(
    (partnerId: string): QuadrantScores => scoresMap[partnerId] ?? DEFAULT_SCORES,
    [scoresMap]
  );

  const saveScores = useCallback(
    async (partnerId: string, scores: QuadrantScores, notes?: string) => {
      const now = new Date().toISOString();
      const all = ldbGetAll<any>('quadrant_scores');
      const idx = all.findIndex((r: any) => r.partner_id === partnerId);
      const record = {
        id: idx >= 0 ? all[idx].id : crypto.randomUUID(),
        partner_id: partnerId,
        ...scores,
        notes: notes || null,
        updated_at: now,
        created_at: idx >= 0 ? all[idx].created_at : now,
      };
      if (idx >= 0) { all[idx] = record; } else { all.unshift(record); }
      ldbSetAll('quadrant_scores', all);
      setScoresMap((prev) => ({ ...prev, [partnerId]: scores }));
      toast.success("Scores salvos com sucesso");
    },
    []
  );

  const deleteScores = useCallback(async (partnerId: string) => {
    const all = ldbGetAll<any>('quadrant_scores').filter((r: any) => r.partner_id !== partnerId);
    ldbSetAll('quadrant_scores', all);
    setScoresMap((prev) => {
      const next = { ...prev };
      delete next[partnerId];
      return next;
    });
    toast.success("Scores excluídos — valores padrão restaurados");
  }, []);

  return { scoresMap, loading, getScores, saveScores, deleteScores, refetch: loadAllScores };
}

export { DEFAULT_SCORES };
