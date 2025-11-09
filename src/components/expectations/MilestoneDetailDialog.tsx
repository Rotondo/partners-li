import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExpectationMilestone, MilestoneCheckbox, MilestoneUpdate, MilestoneStatus } from "@/types/expectations";
import { CheckCircle2, Clock, XCircle, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MilestoneDetailDialogProps {
  milestone: ExpectationMilestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function MilestoneDetailDialog({
  milestone,
  open,
  onOpenChange,
  onUpdate,
}: MilestoneDetailDialogProps) {
  const { toast } = useToast();
  const [checkboxes, setCheckboxes] = useState<MilestoneCheckbox[]>([]);
  const [updates, setUpdates] = useState<MilestoneUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCheckboxLabel, setNewCheckboxLabel] = useState("");
  const [newUpdateContent, setNewUpdateContent] = useState("");
  const [newStatus, setNewStatus] = useState<MilestoneStatus>("not_started");

  useEffect(() => {
    if (milestone) {
      setNewStatus(milestone.status);
      loadCheckboxes();
      loadUpdates();
    }
  }, [milestone]);

  const loadCheckboxes = async () => {
    if (!milestone) return;

    const { data, error } = await supabase
      .from("milestone_checkboxes")
      .select("*")
      .eq("milestone_id", milestone.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading checkboxes:", error);
      return;
    }

    setCheckboxes(data || []);
  };

  const loadUpdates = async () => {
    if (!milestone) return;

    const { data, error } = await supabase
      .from("milestone_updates")
      .select("*")
      .eq("milestone_id", milestone.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading updates:", error);
      return;
    }

    setUpdates((data || []) as MilestoneUpdate[]);
  };

  const toggleCheckbox = async (checkbox: MilestoneCheckbox) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newChecked = !checkbox.is_checked;

    const { error } = await supabase
      .from("milestone_checkboxes")
      .update({
        is_checked: newChecked,
        checked_at: newChecked ? new Date().toISOString() : null,
        checked_by: newChecked ? user.id : null,
      })
      .eq("id", checkbox.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive",
      });
      return;
    }

    loadCheckboxes();
    updateProgress();
  };

  const addCheckbox = async () => {
    if (!milestone || !newCheckboxLabel.trim()) return;

    const { error } = await supabase
      .from("milestone_checkboxes")
      .insert({
        milestone_id: milestone.id,
        label: newCheckboxLabel.trim(),
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive",
      });
      return;
    }

    setNewCheckboxLabel("");
    loadCheckboxes();
    toast({
      title: "Item adicionado",
      description: "O item foi adicionado ao checklist.",
    });
  };

  const addUpdate = async () => {
    if (!milestone || !newUpdateContent.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("milestone_updates")
      .insert({
        milestone_id: milestone.id,
        user_id: user.id,
        update_type: "progress",
        content: newUpdateContent.trim(),
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a atualização.",
        variant: "destructive",
      });
      return;
    }

    setNewUpdateContent("");
    loadUpdates();
    toast({
      title: "Atualização adicionada",
      description: "A atualização foi registrada com sucesso.",
    });
  };

  const updateProgress = async () => {
    if (!milestone) return;

    const { data } = await supabase
      .from("milestone_checkboxes")
      .select("*")
      .eq("milestone_id", milestone.id);

    if (!data || data.length === 0) return;

    const checkedCount = data.filter((c) => c.is_checked).length;
    const percentage = Math.round((checkedCount / data.length) * 100);

    await supabase
      .from("expectation_milestones")
      .update({ progress_percentage: percentage })
      .eq("id", milestone.id);

    onUpdate();
  };

  const updateStatus = async (status: MilestoneStatus) => {
    if (!milestone) return;
    setLoading(true);

    const updateData: any = { status };
    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.progress_percentage = 100;
    }

    const { error } = await supabase
      .from("expectation_milestones")
      .update(updateData)
      .eq("id", milestone.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Status atualizado",
      description: "O status do marco foi atualizado com sucesso.",
    });

    setLoading(false);
    onUpdate();
  };

  if (!milestone) return null;

  const statusIcons = {
    not_started: <Clock className="h-5 w-5 text-muted-foreground" />,
    in_progress: <Loader2 className="h-5 w-5 text-warning animate-spin" />,
    completed: <CheckCircle2 className="h-5 w-5 text-success" />,
    blocked: <XCircle className="h-5 w-5 text-destructive" />,
    cancelled: <XCircle className="h-5 w-5 text-muted-foreground" />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl pr-8">{milestone.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {statusIcons[milestone.status]}
              <Select
                value={newStatus}
                onValueChange={(value: MilestoneStatus) => {
                  setNewStatus(value);
                  updateStatus(value);
                }}
                disabled={loading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Não Iniciado</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline">{milestone.deadline_days} dias</Badge>
            <Badge>{milestone.category}</Badge>
            <Badge variant="secondary">{milestone.priority}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-muted-foreground">{milestone.progress_percentage}%</span>
            </div>
            <Progress value={milestone.progress_percentage} />
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="checklist">
                Checklist ({checkboxes.filter(c => c.is_checked).length}/{checkboxes.length})
              </TabsTrigger>
              <TabsTrigger value="updates">
                Atualizações ({updates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Oportunidades/Riscos</h4>
                <p className="text-sm text-muted-foreground">
                  {milestone.opportunities_risks || "Nenhuma informação registrada."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-4">
              <div className="space-y-2">
                {checkboxes.map((checkbox) => (
                  <div
                    key={checkbox.id}
                    className={cn(
                      "flex items-start gap-2 p-3 rounded-lg border transition-colors",
                      checkbox.is_checked ? "bg-muted/50" : "bg-card"
                    )}
                  >
                    <Checkbox
                      checked={checkbox.is_checked}
                      onCheckedChange={() => toggleCheckbox(checkbox)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <p className={cn(
                        "text-sm",
                        checkbox.is_checked && "line-through text-muted-foreground"
                      )}>
                        {checkbox.label}
                      </p>
                      {checkbox.is_checked && checkbox.checked_at && (
                        <p className="text-xs text-muted-foreground">
                          Concluído em {format(new Date(checkbox.checked_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Adicionar novo item..."
                  value={newCheckboxLabel}
                  onChange={(e) => setNewCheckboxLabel(e.target.value)}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addCheckbox();
                    }
                  }}
                />
                <Button onClick={addCheckbox} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="updates" className="space-y-4">
              <div className="space-y-3">
                {updates.map((update) => (
                  <div key={update.id} className="p-4 rounded-lg border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{update.update_type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(update.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{update.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Adicionar atualização de progresso..."
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  rows={3}
                />
                <Button onClick={addUpdate} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
