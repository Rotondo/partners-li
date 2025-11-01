import { useState, useEffect } from "react";
import { PartnerTask, TaskPriority, TaskStatus } from "@/types/crm";
import { Partner } from "@/types/partner";
import { getAllPartners, getPartnerTasks, savePartnerTask } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isBefore, differenceInDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const TasksListView = () => {
  const [tasks, setTasks] = useState<PartnerTask[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allPartners = await getAllPartners();
      setPartners(allPartners);

      const allTasks: PartnerTask[] = [];
      for (const partner of allPartners) {
        const partnerTasks = await getPartnerTasks(partner.id);
        allTasks.push(...partnerTasks);
      }

      // Ordenar por prazo e prioridade
      allTasks.sort((a, b) => {
        // Primeiro por status (pendentes primeiro)
        if (a.status !== b.status) {
          const statusOrder = { todo: 0, in_progress: 1, done: 2, cancelled: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        }

        // Depois por prazo
        if (a.due_date && b.due_date) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;

        // Por último por prioridade
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      setTasks(allTasks);

      // Expandir parceiros com tarefas pendentes
      const partnersWithPendingTasks = new Set(
        allTasks
          .filter((t) => t.status !== "done" && t.status !== "cancelled")
          .map((t) => t.partner_id)
      );
      setExpandedPartners(partnersWithPendingTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: PartnerTask) => {
    try {
      const newStatus: TaskStatus =
        task.status === "done" ? "todo" : "done";
      const completed_date =
        newStatus === "done" ? new Date() : null;

      await savePartnerTask({
        ...task,
        status: newStatus,
        completed_date,
      });

      await loadData();
      toast.success(
        newStatus === "done"
          ? "Tarefa concluída"
          : "Tarefa reaberta"
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Erro ao atualizar tarefa");
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    const labels: Record<TaskPriority, string> = {
      urgent: "Urgente",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };
    return labels[priority];
  };

  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<TaskStatus, any> = {
      todo: "outline",
      in_progress: "default",
      done: "secondary",
      cancelled: "destructive",
    };

    const labels: Record<TaskStatus, string> = {
      todo: "A Fazer",
      in_progress: "Em Progresso",
      done: "Concluída",
      cancelled: "Cancelada",
    };

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    );
  };

  const getDueDateStatus = (dueDate: Date | null) => {
    if (!dueDate) return null;

    const today = startOfDay(new Date());
    const due = startOfDay(new Date(dueDate));
    const daysUntilDue = differenceInDays(due, today);

    if (isBefore(due, today)) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Vencida há {Math.abs(daysUntilDue)} dias
        </Badge>
      );
    }

    if (daysUntilDue === 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" />
          Vence hoje
        </Badge>
      );
    }

    if (daysUntilDue === 1) {
      return (
        <Badge className="gap-1 bg-yellow-500">
          <Clock className="h-3 w-3" />
          Vence amanhã
        </Badge>
      );
    }

    if (daysUntilDue <= 7) {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          {daysUntilDue} dias
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        No prazo
      </Badge>
    );
  };

  const togglePartner = (partnerId: string) => {
    const newExpanded = new Set(expandedPartners);
    if (newExpanded.has(partnerId)) {
      newExpanded.delete(partnerId);
    } else {
      newExpanded.add(partnerId);
    }
    setExpandedPartners(newExpanded);
  };

  const tasksByPartner = tasks.reduce((acc, task) => {
    if (!acc[task.partner_id]) {
      acc[task.partner_id] = [];
    }
    acc[task.partner_id].push(task);
    return acc;
  }, {} as Record<string, PartnerTask[]>);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando tarefas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhuma tarefa</h3>
          <p className="text-muted-foreground mt-2">
            Você não tem tarefas cadastradas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {partners
        .filter((partner) => tasksByPartner[partner.id]?.length > 0)
        .map((partner) => {
          const partnerTasks = tasksByPartner[partner.id] || [];
          const pendingCount = partnerTasks.filter(
            (t) => t.status !== "done" && t.status !== "cancelled"
          ).length;

          return (
            <Collapsible
              key={partner.id}
              open={expandedPartners.has(partner.id)}
              onOpenChange={() => togglePartner(partner.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedPartners.has(partner.id) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <CardTitle className="text-base">{partner.name}</CardTitle>
                        <Badge variant="outline">
                          {partnerTasks.length} tarefa
                          {partnerTasks.length !== 1 ? "s" : ""}
                        </Badge>
                        {pendingCount > 0 && (
                          <Badge variant="default">{pendingCount} pendente{pendingCount !== 1 ? "s" : ""}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-3 pt-0">
                    {partnerTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border transition-all",
                          task.status === "done" && "opacity-60"
                        )}
                      >
                        <Checkbox
                          checked={task.status === "done"}
                          onCheckedChange={() => handleToggleComplete(task)}
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4
                              className={cn(
                                "font-medium",
                                task.status === "done" && "line-through"
                              )}
                            >
                              {task.title}
                            </h4>
                            <div
                              className={cn(
                                "h-3 w-3 rounded-full flex-shrink-0 mt-1",
                                getPriorityColor(task.priority)
                              )}
                              title={getPriorityLabel(task.priority)}
                            />
                          </div>

                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(task.status)}

                            {task.due_date && getDueDateStatus(task.due_date)}

                            {task.due_date && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(task.due_date), "dd MMM yyyy", {
                                  locale: ptBR,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
    </div>
  );
};
