import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ClipboardList, LayoutGrid, List } from "lucide-react";
import { PipelineKanban } from "@/components/pipeline/PipelineKanban";
import { TasksListView } from "@/components/pipeline/TasksListView";
import { ActivityCalendar } from "@/components/pipeline/ActivityCalendar";
import { AddActivityDialog } from "@/components/partners/AddActivityDialog";
import { getAllPartners, getPartnerActivities, getPartnerTasks } from "@/lib/db";
import { Partner } from "@/types/partner";
import { PartnerActivity, PartnerTask } from "@/types/crm";
import { startOfDay, isBefore, isToday } from "date-fns";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";

const Pipeline = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    thisWeek: 0,
    pendingTasks: 0,
    overdue: 0,
    today: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const partners = await getAllPartners();

      let thisWeekCount = 0;
      let pendingTasksCount = 0;
      let overdueCount = 0;
      let todayCount = 0;

      const today = startOfDay(new Date());
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      for (const partner of partners) {
        // Atividades
        const activities = await getPartnerActivities(partner.id);
        
        activities.forEach((activity) => {
          if (activity.scheduled_date) {
            const scheduledDate = startOfDay(new Date(activity.scheduled_date));

            // Esta semana
            if (
              scheduledDate >= today &&
              scheduledDate <= nextWeek &&
              activity.status === "scheduled"
            ) {
              thisWeekCount++;
            }

            // Hoje
            if (isToday(scheduledDate) && activity.status !== "completed") {
              todayCount++;
            }

            // Atrasadas
            if (
              isBefore(scheduledDate, today) &&
              activity.status !== "completed" &&
              activity.status !== "cancelled"
            ) {
              overdueCount++;
            }
          }
        });

        // Tarefas
        const tasks = await getPartnerTasks(partner.id);
        tasks.forEach((task) => {
          if (task.status !== "done" && task.status !== "cancelled") {
            pendingTasksCount++;
          }
        });
      }

      setStats({
        thisWeek: thisWeekCount,
        pendingTasks: pendingTasksCount,
        overdue: overdueCount,
        today: todayCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <MobileMenuButton 
        onClick={() => setMobileMenuOpen(true)} 
        isOpen={mobileMenuOpen} 
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas atividades e tarefas
              </p>
            </div>
            <Button size="lg" onClick={() => setActivityDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Esta Semana</p>
                    <p className="text-2xl font-bold mt-1">{stats.thisWeek}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
                    <p className="text-2xl font-bold mt-1">{stats.pendingTasks}</p>
                  </div>
                  <ClipboardList className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Atrasadas</p>
                    <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
                  </div>
                  <LayoutGrid className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hoje</p>
                    <p className="text-2xl font-bold mt-1">{stats.today}</p>
                  </div>
                  <List className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="kanban" className="space-y-6 mt-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="kanban">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendário
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <ClipboardList className="h-4 w-4 mr-2" />
                Minhas Tarefas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kanban" className="space-y-4">
              <PipelineKanban />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <ActivityCalendar />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TasksListView />
            </TabsContent>
          </Tabs>

          <AddActivityDialog
            open={activityDialogOpen}
            onOpenChange={setActivityDialogOpen}
            partnerId={null}
            partnerName=""
            onSuccess={() => {
              setActivityDialogOpen(false);
              loadStats();
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Pipeline;
