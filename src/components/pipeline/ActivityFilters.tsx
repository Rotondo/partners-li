import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityType, ActivityStatus } from "@/types/crm";
import { Partner } from "@/types/partner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityFiltersProps {
  partners: Partner[];
  selectedTypes: ActivityType[];
  selectedStatuses: ActivityStatus[];
  selectedPartnerId: string | null;
  dateRange: { from: Date | null; to: Date | null };
  searchTerm: string;
  onTypesChange: (types: ActivityType[]) => void;
  onStatusesChange: (statuses: ActivityStatus[]) => void;
  onPartnerChange: (partnerId: string | null) => void;
  onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
  onSearchChange: (term: string) => void;
  onClearAll: () => void;
}

const activityTypeLabels: Record<ActivityType, string> = {
  meeting: "Reunião",
  call: "Call",
  email: "E-mail",
  task: "Tarefa",
  note: "Nota",
};

const activityStatusLabels: Record<ActivityStatus, string> = {
  scheduled: "Agendada",
  completed: "Concluída",
  cancelled: "Cancelada",
  pending: "Pendente",
};

export const ActivityFilters = ({
  partners,
  selectedTypes,
  selectedStatuses,
  selectedPartnerId,
  dateRange,
  searchTerm,
  onTypesChange,
  onStatusesChange,
  onPartnerChange,
  onDateRangeChange,
  onSearchChange,
  onClearAll,
}: ActivityFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeToggle = (type: ActivityType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const handleStatusToggle = (status: ActivityStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const activeFiltersCount =
    selectedTypes.length +
    selectedStatuses.length +
    (selectedPartnerId ? 1 : 0) +
    (dateRange.from || dateRange.to ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar atividades..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />

        <div className="flex gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filtros</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onClearAll();
                        setIsOpen(false);
                      }}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>

                {/* Parceiro */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Parceiro</Label>
                  <Select
                    value={selectedPartnerId || "all"}
                    onValueChange={(value) =>
                      onPartnerChange(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os parceiros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os parceiros</SelectItem>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Tipo de Atividade</Label>
                  <div className="space-y-2">
                    {(Object.keys(activityTypeLabels) as ActivityType[]).map(
                      (type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleTypeToggle(type)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm cursor-pointer"
                          >
                            {activityTypeLabels[type]}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Status</Label>
                  <div className="space-y-2">
                    {(Object.keys(activityStatusLabels) as ActivityStatus[]).map(
                      (status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => handleStatusToggle(status)}
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm cursor-pointer"
                          >
                            {activityStatusLabels[status]}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Data Range */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Período</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onDateRangeChange({
                          from: new Date(
                            new Date().setDate(new Date().getDate() - 7)
                          ),
                          to: new Date(),
                        })
                      }
                    >
                      7 dias
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onDateRangeChange({
                          from: new Date(
                            new Date().setDate(new Date().getDate() - 30)
                          ),
                          to: new Date(),
                        })
                      }
                    >
                      30 dias
                    </Button>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd MMM", {
                                locale: ptBR,
                              })}{" "}
                              -{" "}
                              {format(dateRange.to, "dd MMM yyyy", {
                                locale: ptBR,
                              })}
                            </>
                          ) : (
                            format(dateRange.from, "dd MMM yyyy", {
                              locale: ptBR,
                            })
                          )
                        ) : (
                          <span>Selecionar período</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.from || undefined,
                          to: dateRange.to || undefined,
                        }}
                        onSelect={(range) =>
                          onDateRangeChange({
                            from: range?.from || null,
                            to: range?.to || null,
                          })
                        }
                        numberOfMonths={2}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="icon" onClick={onClearAll}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {activityTypeLabels[type]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleTypeToggle(type)}
              />
            </Badge>
          ))}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {activityStatusLabels[status]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusToggle(status)}
              />
            </Badge>
          ))}
          {selectedPartnerId && (
            <Badge variant="secondary" className="gap-1">
              {partners.find((p) => p.id === selectedPartnerId)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onPartnerChange(null)}
              />
            </Badge>
          )}
          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              {dateRange.from && format(dateRange.from, "dd/MM")} -{" "}
              {dateRange.to && format(dateRange.to, "dd/MM")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onDateRangeChange({ from: null, to: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
