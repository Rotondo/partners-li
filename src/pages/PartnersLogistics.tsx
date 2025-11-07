import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";
import { LogisticPartnersTable } from "@/components/partners/LogisticPartnersTable";
import { PartnerComparator } from "@/components/partners/PartnerComparator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types/partner";

const PartnersLogistics = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Carregar parceiros logísticos
  const { data: partners = [] } = useQuery({
    queryKey: ['logistic-partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .contains('type', ['logistic']);
      
      if (error) throw error;
      
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.data.name,
        categories: ['logistic' as const],
        status: p.data.status,
        startDate: new Date(p.data.startDate),
        logoUrl: p.logo_url,
        notes: p.data.notes,
        isImportant: p.is_important,
        priorityRank: p.priority_rank,
        paretoFocus: p.pareto_focus,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
        logistic: p.data,
      })) as Partner[];
    },
  });

  return (
    <div className="flex h-screen bg-background">
      <MobileMenuButton 
        onClick={() => setMobileMenuOpen(true)} 
        isOpen={mobileMenuOpen} 
      />
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto pl-0 md:pl-0">
        <div className="container mx-auto p-8">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="list">Lista de Parceiros</TabsTrigger>
              <TabsTrigger value="compare">Comparar Parceiros</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <LogisticPartnersTable />
            </TabsContent>

            <TabsContent value="compare">
              <PartnerComparator partners={partners} initialCategory="logistic" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default PartnersLogistics;
