import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartnerActivity, ActivityStatus } from "@/types/crm";
import { Partner } from "@/types/partner";
import { getAllPartners, getPartnerActivities, savePartnerActivity } from "@/lib/db";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Mail, 
  Phone, 
  FileText, 
  ClipboardList 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Column = "this-week" | "in-progress" | "completed" | "overdue";

interface KanbanColumn {
  id: Column;
  title: string;
  icon: any;
  activities: PartnerActivity[];
}

export const PipelineKanban = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allPartners = await getAllPartners();
      setPartners(allPartners);

      // Buscar atividades de todos os parceiros
      const allActivities: PartnerActivity[] = [];
      for (const partner of allPartners) {
        const activities = await getPartnerActivities(partner.id);
        allActivities.push(...activities);
      }

      organizeActivities(allActivities);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  };

  const organizeActivities = (activities: PartnerActivity[]) => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);

    const thisWeek = activities.filter((a) => {
      if (!a.scheduled_date) return false;
      const scheduledDate = startOfDay(new Date(a.scheduled_date));
      return (
        a.status === "scheduled" &&
        scheduledDate >= today &&
        scheduledDate <= nextWeek
      );
    });

    const inProgress = activities.filter((a) => {
      if (a.status === "completed" || a.status === "cancelled") return false;
      if (!a.scheduled_date) return a.status === "pending";
      const scheduledDate = startOfDay(new Date(a.scheduled_date));
      return scheduledDate <= today;
    });

    const completed = activities.filter((a) => {
      if (a.status !== "completed") return false;
      if (!a.completed_date) return true;
      const completedDate = new Date(a.completed_date);
      const thirtyDaysAgo = addDays(today, -30);
      return completedDate >= thirtyDaysAgo;
    });

    const overdue = activities.filter((a) => {
      if (!a.scheduled_date || a.status === "completed" || a.status === "cancelled")
        return false;
      const scheduledDate = startOfDay(new Date(a.scheduled_date));
      return isBefore(scheduledDate, today);
    });

    setColumns([
      {
        id: "this-week",
        title: "Esta Semana",
        icon: Calendar,
        activities: thisWeek,
      },
      {
        id: "in-progress",
        title: "Em Andamento",
        icon: Clock,
        activities: inProgress,
      },
      {
        id: "completed",
        title: "Concluídas",
        icon: CheckCircle2,
        activities: completed,
      },
      {
        id: "overdue",
        title: "Atrasadas",
        icon: AlertCircle,
        activities: overdue,
      },
    ]);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activityId = active.id as string;
    const targetColumn = over.id as Column;

    // Encontrar a atividade
    let activity: PartnerActivity | undefined;
    for (const col of columns) {
      const found = col.activities.find((a) => a.id === activityId);
      if (found) {
        activity = found;
        break;
      }
    }

    if (!activity) return;

    // Atualizar status baseado na coluna
    let newStatus: ActivityStatus = activity.status;
    let completed_date: Date | null = null;

    if (targetColumn === "completed") {
      newStatus = "completed";
      completed_date = new Date();
    } else if (targetColumn === "in-progress") {
      newStatus = "pending";
    } else if (targetColumn === "this-week") {
      newStatus = "scheduled";
    }

    // Não permitir se não houver mudança ou se status inválido
    if (newStatus === activity.status) return;

    // Salvar no banco
    try {
      await savePartnerActivity({
        ...activity,
        status: newStatus,
        completed_date: completed_date || activity.completed_date,
      });

      toast.success("Atividade atualizada");
      loadData();
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Erro ao atualizar atividade");
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Users;
      case "call":
        return Phone;
      case "email":
        return Mail;
      case "task":
        return ClipboardList;
      default:
        return FileText;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      meeting: "Reunião",
      call: "Call",
      email: "E-mail",
      task: "Tarefa",
      note: "Nota",
    };
    return labels[type] || type;
  };

  const renderActivityCard = (activity: PartnerActivity) => {
    const partner = partners.find((p) => p.id === activity.partner_id);
    const Icon = getActivityIcon(activity.activity_type);

    return (
      <Card
        key={activity.id}
        className="cursor-move hover:shadow-md transition-shadow"
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h4 className="font-medium text-sm line-clamp-2">{activity.title}</h4>
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {getActivityTypeLabel(activity.activity_type)}
            </Badge>
          </div>

          {partner && (
            <p className="text-xs text-muted-foreground">{partner.name}</p>
          )}

          {activity.scheduled_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(activity.scheduled_date), "dd MMM yyyy", {
                locale: ptBR,
              })}
            </div>
          )}

          {activity.participants && activity.participants.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {activity.participants.length} participante
              {activity.participants.length > 1 ? "s" : ""}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando pipeline...</p>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const Icon = column.icon;
          return (
            <div key={column.id} className="space-y-3">
              <Card
                className={cn(
                  "border-t-4",
                  column.id === "this-week" && "border-t-blue-500",
                  column.id === "in-progress" && "border-t-yellow-500",
                  column.id === "completed" && "border-t-green-500",
                  column.id === "overdue" && "border-t-red-500"
                )}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {column.title}
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {column.activities.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <div
                className="space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-muted-foreground/20"
                data-column={column.id}
              >
                {column.activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma atividade
                  </div>
                ) : (
                  column.activities.map((activity) => (
                    <div key={activity.id} draggable>
                      {renderActivityCard(activity)}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-80">
            {columns
              .flatMap((c) => c.activities)
              .filter((a) => a.id === activeId)
              .map(renderActivityCard)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
