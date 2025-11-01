import { useEffect, useState } from "react";
import { PartnerTask } from "@/types/crm";
import { getPartnerTasks, savePartnerTask } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface TasksTabProps {
  partnerId: string;
  onUpdate?: () => void;
}

export const TasksTab = ({ partnerId, onUpdate }: TasksTabProps) => {
  const [tasks, setTasks] = useState<PartnerTask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getPartnerTasks(partnerId);
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [partnerId]);

  const handleToggleTask = async (task: PartnerTask) => {
    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      await savePartnerTask({
        ...task,
        status: newStatus,
        completed_date: newStatus === "done" ? new Date() : undefined,
      });
      await loadTasks();
      onUpdate?.();
      toast.success(newStatus === "done" ? "Tarefa concluída!" : "Tarefa reaberta");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Erro ao atualizar tarefa");
    }
  };

  const getPriorityColor = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      urgent: "destructive",
      high: "default",
      medium: "secondary",
      low: "outline",
    };
    return colors[priority] || "outline";
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      urgent: "Urgente",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando tarefas...</div>;
  }

  const pendingTasks = tasks.filter(t => t.status !== "done");
  const completedTasks = tasks.filter(t => t.status === "done");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Tarefas Pendentes ({pendingTasks.length})
        </h3>
        {pendingTasks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Nenhuma tarefa pendente</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleTask(task)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{task.title}</p>
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {getPriorityLabel(task.priority)}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Prazo: {format(new Date(task.due_date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Tarefas Concluídas ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleTask(task)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium line-through">{task.title}</p>
                      {task.completed_date && (
                        <p className="text-xs text-muted-foreground">
                          Concluída em {format(new Date(task.completed_date), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
