import { ExpectationMilestone } from "@/types/expectations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpectationsTableProps {
  milestones: ExpectationMilestone[];
  onView: (milestone: ExpectationMilestone) => void;
  onEdit: (milestone: ExpectationMilestone) => void;
  onDelete: (milestone: ExpectationMilestone) => void;
}

const statusConfig = {
  not_started: { label: 'Não Iniciado', className: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'Em Andamento', className: 'bg-warning/20 text-warning' },
  completed: { label: 'Concluído', className: 'bg-success/20 text-success' },
  blocked: { label: 'Bloqueado', className: 'bg-destructive/20 text-destructive' },
  cancelled: { label: 'Cancelado', className: 'bg-muted text-muted-foreground' },
};

const categoryConfig = {
  general: { label: 'Geral', className: 'bg-secondary' },
  marketplace: { label: 'Marketplace', className: 'bg-primary/20 text-primary' },
  logistic: { label: 'Logística', className: 'bg-accent/20 text-accent-foreground' },
  payment: { label: 'Pagamento', className: 'bg-chart-2/20 text-chart-2' },
};

export function ExpectationsTable({ milestones, onView, onEdit, onDelete }: ExpectationsTableProps) {
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    if (!acc[milestone.deadline_days]) {
      acc[milestone.deadline_days] = [];
    }
    acc[milestone.deadline_days].push(milestone);
    return acc;
  }, {} as Record<number, ExpectationMilestone[]>);

  const sortedDeadlines = Object.keys(groupedMilestones).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {sortedDeadlines.map(deadline => (
        <div key={deadline} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              {deadline} dias
            </h3>
            <Badge variant="outline" className="ml-2">
              {groupedMilestones[deadline].length} {groupedMilestones[deadline].length === 1 ? 'marco' : 'marcos'}
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Marco</TableHead>
                  <TableHead className="w-[20%]">Categoria</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Progresso</TableHead>
                  <TableHead className="w-[10%] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedMilestones[deadline].map(milestone => (
                  <TableRow key={milestone.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{milestone.title}</p>
                        {milestone.opportunities_risks && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {milestone.opportunities_risks}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", categoryConfig[milestone.category].className)}>
                        {categoryConfig[milestone.category].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", statusConfig[milestone.status].className)}>
                        {statusConfig[milestone.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={milestone.progress_percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{milestone.progress_percentage}%</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(milestone)}
                          aria-label="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(milestone)}
                          aria-label="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(milestone)}
                          aria-label="Deletar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}
