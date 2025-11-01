import { useEffect, useState } from "react";
import { PartnerActivity } from "@/types/crm";
import { getPartnerActivities } from "@/lib/db";
import { ActivityTimeline } from "../ActivityTimeline";
import { toast } from "sonner";

interface TimelineTabProps {
  partnerId: string;
  onUpdate?: () => void;
}

export const TimelineTab = ({ partnerId, onUpdate }: TimelineTabProps) => {
  const [activities, setActivities] = useState<PartnerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getPartnerActivities(partnerId);
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast.error("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [partnerId]);

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando timeline...</div>;
  }

  return (
    <ActivityTimeline 
      activities={activities} 
      onUpdate={() => {
        loadActivities();
        onUpdate?.();
      }}
    />
  );
};
