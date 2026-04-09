import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuadrantScores } from "@/lib/quadrant-scores";
import { toast } from "sonner";

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

  async function loadAllScores() {
    setLoading(true);
    const { data, error } = await supabase.from("partner_quadrant_scores").select("*");
    if (error) {
      console.error("Error loading scores:", error);
      setLoading(false);
      return;
    }
    const map: Record<string, QuadrantScores> = {};
    for (const row of data) {
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
      const { error } = await supabase
        .from("partner_quadrant_scores")
        .upsert(
          {
            partner_id: partnerId,
            segment_quality_score: scores.segment_quality_score,
            market_presence_score: scores.market_presence_score,
            team_size_score: scores.team_size_score,
            financial_health_score: scores.financial_health_score,
            product_roadmap_score: scores.product_roadmap_score,
            partnership_engagement_score: scores.partnership_engagement_score,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "partner_id" }
        );

      if (error) {
        toast.error("Erro ao salvar scores: " + error.message);
        throw error;
      }

      setScoresMap((prev) => ({ ...prev, [partnerId]: scores }));
      toast.success("Scores salvos com sucesso");
    },
    []
  );

  const deleteScores = useCallback(async (partnerId: string) => {
    const { error } = await supabase
      .from("partner_quadrant_scores")
      .delete()
      .eq("partner_id", partnerId);

    if (error) {
      toast.error("Erro ao excluir scores: " + error.message);
      throw error;
    }

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
