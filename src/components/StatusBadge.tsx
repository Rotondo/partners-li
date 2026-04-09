import { cn } from "@/lib/utils";
import { PartnerStatus } from "@/types/ecosystem-partner";

const statusStyles: Record<PartnerStatus, string> = {
  Ativo: "bg-success/15 text-success",
  Inativo: "bg-destructive/15 text-destructive",
  "Em análise": "bg-warning/15 text-warning",
};

export function StatusBadge({ status }: { status: PartnerStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
      {status}
    </span>
  );
}
