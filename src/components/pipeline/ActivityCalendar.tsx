import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PartnerActivity } from "@/types/crm";
import { Partner } from "@/types/partner";
import { getAllPartners, getPartnerActivities } from "@/lib/db";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users, Phone, Mail, FileText, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export const ActivityCalendar = () => {
  const [activities, setActivities] = useState<PartnerActivity[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const allPartners = await getAllPartners();
      setPartners(allPartners);

      const allActivities: PartnerActivity[] = [];
      for (const partner of allPartners) {
        const partnerActivities = await getPartnerActivities(partner.id);
        allActivities.push(...partnerActivities);
      }

      setActivities(allActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
      toast.error("Erro ao carregar atividades");
    } finally {
      setLoading(false);
    }
  };

  const getActivitiesForDate = (date: Date) => {
    return activities.filter((activity) => {
      if (!activity.scheduled_date) return false;
      return isSameDay(new Date(activity.scheduled_date), date);
    });
  };

  const getDatesWithActivities = () => {
    return activities
      .filter((a) => a.scheduled_date)
      .map((a) => new Date(a.scheduled_date!));
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

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500";
      case "call":
        return "bg-green-500";
      case "email":
        return "bg-purple-500";
      case "task":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const selectedDayActivities = getActivitiesForDate(selectedDate);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando calendário...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="w-full"
              modifiers={{
                hasActivity: getDatesWithActivities(),
              }}
              modifiersStyles={{
                hasActivity: {
                  fontWeight: "bold",
                  position: "relative",
                },
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const dayActivities = getActivitiesForDate(date);
                  const hasActivities = dayActivities.length > 0;

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          {...props}
                          className="relative h-10 w-10 p-0 font-normal hover:bg-accent rounded-md"
                        >
                          <span>{format(date, "d")}</span>
                          {hasActivities && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                              {dayActivities.slice(0, 3).map((activity, idx) => (
                                <div
                                  key={idx}
                                  className={`h-1 w-1 rounded-full ${getActivityTypeColor(
                                    activity.activity_type
                                  )}`}
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      </PopoverTrigger>
                      {hasActivities && (
                        <PopoverContent className="w-80" align="center">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">
                              {format(date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {dayActivities.map((activity) => {
                                const Icon = getActivityIcon(activity.activity_type);
                                const partner = partners.find(
                                  (p) => p.id === activity.partner_id
                                );

                                return (
                                  <div
                                    key={activity.id}
                                    className="flex items-start gap-2 p-2 rounded-lg border text-sm"
                                  >
                                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">
                                        {activity.title}
                                      </p>
                                      {partner && (
                                        <p className="text-xs text-muted-foreground">
                                          {partner.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </h3>
              <Badge variant="outline">
                {selectedDayActivities.length} atividade
                {selectedDayActivities.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-3">
              {selectedDayActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma atividade agendada
                </div>
              ) : (
                selectedDayActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.activity_type);
                  const partner = partners.find(
                    (p) => p.id === activity.partner_id
                  );

                  return (
                    <Card key={activity.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <div
                            className={`p-2 rounded-lg ${getActivityTypeColor(
                              activity.activity_type
                            )}`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {activity.title}
                            </h4>
                            {partner && (
                              <p className="text-xs text-muted-foreground">
                                {partner.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {activity.what_discussed && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {activity.what_discussed}
                          </p>
                        )}

                        {activity.participants &&
                          activity.participants.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {activity.participants.length} participante
                              {activity.participants.length > 1 ? "s" : ""}
                            </div>
                          )}

                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {activity.status === "completed"
                            ? "Concluída"
                            : activity.status === "scheduled"
                            ? "Agendada"
                            : "Pendente"}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
