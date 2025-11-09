import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { ExpectationsTable } from "@/components/expectations/ExpectationsTable";
import { AddMilestoneDialog } from "@/components/expectations/AddMilestoneDialog";
import { MilestoneDetailDialog } from "@/components/expectations/MilestoneDetailDialog";
import { ExpectationMilestone } from "@/types/expectations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { seedExpectations } from "@/lib/seedExpectations";

export default function Expectations() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [milestones, setMilestones] = useState<ExpectationMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<ExpectationMilestone | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<ExpectationMilestone | null>(null);
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("expectation_milestones")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline_days", { ascending: true });

      if (error) throw error;

      // If no milestones exist, seed them
      if (!data || data.length === 0) {
        await seedExpectations(user.id);
        // Reload after seeding
        const { data: seededData } = await supabase
          .from("expectation_milestones")
          .select("*")
          .eq("user_id", user.id)
          .order("deadline_days", { ascending: true });

        setMilestones((seededData || []) as ExpectationMilestone[]);
      } else {
        setMilestones(data as ExpectationMilestone[]);
      }
    } catch (error) {
      console.error("Error loading milestones:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os marcos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (milestone: ExpectationMilestone) => {
    setSelectedMilestone(milestone);
    setDetailDialogOpen(true);
  };

  const handleEdit = (milestone: ExpectationMilestone) => {
    setSelectedMilestone(milestone);
    setDetailDialogOpen(true);
  };

  const handleDelete = (milestone: ExpectationMilestone) => {
    setMilestoneToDelete(milestone);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!milestoneToDelete) return;

    try {
      const { error } = await supabase
        .from("expectation_milestones")
        .delete()
        .eq("id", milestoneToDelete.id);

      if (error) throw error;

      toast({
        title: "Marco deletado",
        description: "O marco foi deletado com sucesso.",
      });

      loadMilestones();
      setDeleteDialogOpen(false);
      setMilestoneToDelete(null);
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o marco.",
        variant: "destructive",
      });
    }
  };

  const filterByCategory = (category: string) => {
    if (category === "all") return milestones;
    return milestones.filter((m) => m.category === category);
  };

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton
        onClick={() => setMobileMenuOpen(true)}
        isOpen={mobileMenuOpen}
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                Plano de Expectativas
              </h1>
              <p className="text-muted-foreground">
                Acompanhe e gerencie seus marcos estratégicos
              </p>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Marco
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Visão Geral</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="logistic">Logística</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : milestones.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum marco encontrado</p>
                </div>
              ) : (
                <ExpectationsTable
                  milestones={milestones}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-4">
              <ExpectationsTable
                milestones={filterByCategory("marketplace")}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="logistic" className="space-y-4">
              <ExpectationsTable
                milestones={filterByCategory("logistic")}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <ExpectationsTable
                milestones={filterByCategory("payment")}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddMilestoneDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={loadMilestones}
        userId={userId}
      />

      <MilestoneDetailDialog
        milestone={selectedMilestone}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={loadMilestones}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este marco? Esta ação não pode ser desfeita.
              Todos os checkboxes e atualizações associados também serão deletados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
