import { LayoutDashboard, Users, Truck, CreditCard, ShoppingBag, Store, TrendingUp, FileText, ChevronDown, ChevronRight, Settings, LogOut, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, hasSubmenu: false, route: "/" },
  { id: "partners", name: "Parceiros", icon: Users, hasSubmenu: true },
  { id: "pipeline", name: "Pipeline", icon: Kanban, hasSubmenu: false, route: "/pipeline" },
  { id: "health", name: "Health", icon: TrendingUp, hasSubmenu: false, route: "/health" },
  { id: "stores", name: "Lojas", icon: Store, hasSubmenu: false },
  { id: "reports", name: "Relatórios", icon: FileText, hasSubmenu: false },
  { id: "admin", name: "Admin", icon: Settings, hasSubmenu: false },
];

const partnersSubmenu = [
  { id: "partners-logistics", name: "Logísticos", icon: Truck },
  { id: "partners-payment", name: "Pagamento", icon: CreditCard },
  { id: "partners-marketplace", name: "Marketplaces", icon: ShoppingBag },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPartners, setShowPartners] = useState(
    activeTab.startsWith('partners-')
  );

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Gestão de Parceiros</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Plataforma de Gestão</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'partners' && activeTab.startsWith('partners-'));
          
          if (item.hasSubmenu) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setShowPartners(!showPartners)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {showPartners ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                
                {showPartners && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-2">
                    {partnersSubmenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeTab === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => onTabChange(subItem.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                            isSubActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          <span>{subItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                } else {
                  onTabChange(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                (isActive || (item.route && location.pathname === item.route))
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3 text-xs text-sidebar-foreground/50">
          {user?.email}
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
