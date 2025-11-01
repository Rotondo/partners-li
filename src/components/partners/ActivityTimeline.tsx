import { PartnerActivity } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MessageSquare, Phone, FileText, CheckCircle2, Clock, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deletePartnerActivity } from "@/lib/db";
import { toast } from "sonner";

interface ActivityTimelineProps {
  activities: PartnerActivity[];
  onUpdate?: () => void;
}

export const ActivityTimeline = ({ activities, onUpdate }: ActivityTimelineProps) => {
  const getActivityIcon = (type: string) => {
    const icons = {
      meeting: <Calendar className="h-4 w-4" />,
      call: <Phone className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      task: <CheckCircle2 className="h-4 w-4" />,
      note: <MessageSquare className="h-4 w-4" />,
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      completed: <CheckCircle2 className="h-3 w-3 text-green-600" />,
      scheduled: <Clock className="h-3 w-3 text-blue-600" />,
      pending: <Clock className="h-3 w-3 text-yellow-600" />,
      cancelled: <XCircle className="h-3 w-3 text-red-600" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-3 w-3" />;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: "Concluída",
      scheduled: "Agendada",
      pending: "Pendente",
      cancelled: "Cancelada",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      meeting: "Reunião",
      call: "Ligação",
      email: "Email",
      task: "Tarefa",
      note: "Nota",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm("Deseja realmente excluir esta atividade?")) return;

    try {
      await deletePartnerActivity(activityId);
      toast.success("Atividade excluída com sucesso");
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Erro ao excluir atividade");
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma atividade registrada</p>
          <p className="text-sm text-muted-foreground mt-2">
            Adicione atividades para acompanhar o histórico de interações
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Timeline de Atividades ({activities.length})</h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{activity.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(activity.activity_type)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {getStatusIcon(activity.status)}
                        {getStatusLabel(activity.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(activity.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {activity.scheduled_date && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Data: </span>
                  <span className="font-medium">
                    {format(new Date(activity.scheduled_date), "dd/MM/yyyy - EEEE", { locale: ptBR })}
                  </span>
                </div>
              )}

              {activity.participants && activity.participants.length > 0 && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Contato: </span>
                  <span className="font-medium">
                    {activity.participants.map(p => 
                      `${p.name}${p.role ? ` (${p.role})` : ""}`
                    ).join(", ")}
                  </span>
                </div>
              )}

              {activity.what_discussed && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">O que discutimos:</p>
                  <p className="text-foreground">{activity.what_discussed}</p>
                </div>
              )}

              {activity.opportunities && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Oportunidades:</p>
                  <p className="text-foreground">{activity.opportunities}</p>
                </div>
              )}

              {activity.next_steps && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Próximos passos:</p>
                  <p className="text-foreground">{activity.next_steps}</p>
                </div>
              )}

              {activity.notes && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Notas:</p>
                  <p className="text-foreground">{activity.notes}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Registrado em {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
