import { useState } from "react";
import { Partner } from "@/types/partner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { PartnerInfoTab } from "./DetailTabs/PartnerInfoTab";
import { ContactsTab } from "./DetailTabs/ContactsTab";
import { TimelineTab } from "./DetailTabs/TimelineTab";
import { TasksTab } from "./DetailTabs/TasksTab";
import { PerformanceTab } from "./DetailTabs/PerformanceTab";
import { HealthTab } from "./DetailTabs/HealthTab";
import { DocumentsTab } from "./DetailTabs/DocumentsTab";
import { CustomFieldsTab } from "./DetailTabs/CustomFieldsTab";
import { AddActivityDialog } from "./AddActivityDialog";

interface PartnerDetailViewProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export const PartnerDetailView = ({ 
  partner, 
  open, 
  onOpenChange,
  onUpdate 
}: PartnerDetailViewProps) => {
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  if (!partner) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      pending: "outline",
      paused: "destructive",
    };
    return variants[status] || "default";
  };

  const handleActivityAdded = () => {
    setActivityDialogOpen(false);
    onUpdate?.();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(partner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <SheetTitle className="text-2xl">{partner.name}</SheetTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(partner.status)}>
                    {partner.status}
                  </Badge>
                  {partner.categories.map((cat) => (
                    <Badge key={cat} variant="outline">
                      {cat === "logistic" && "Logística"}
                      {cat === "payment" && "Pagamento"}
                      {cat === "marketplace" && "Marketplace"}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <SheetDescription>
              Visão completa do parceiro, atividades, tarefas e documentos
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-4">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="contacts">Contatos</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="tasks">Tarefas</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="health">Saúde</TabsTrigger>
                <TabsTrigger value="documents">Docs</TabsTrigger>
                <TabsTrigger value="custom">Campos</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <PartnerInfoTab partner={partner} />
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                <ContactsTab partnerId={partner.id} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <TimelineTab partnerId={partner.id} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <TasksTab partnerId={partner.id} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <PerformanceTab partner={partner} />
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <HealthTab partnerId={partner.id} />
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <DocumentsTab partnerId={partner.id} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <CustomFieldsTab partner={partner} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button 
              onClick={() => setActivityDialogOpen(true)} 
              className="w-full"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Atividade
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AddActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        partnerId={partner.id}
        partnerName={partner.name}
        onSuccess={handleActivityAdded}
      />
    </>
  );
};
