import { LayoutDashboard, Users, Truck, CreditCard, ShoppingBag, Store, TrendingUp, FileText, ChevronDown, ChevronRight, Settings, LogOut, Kanban, Target, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Novidades24hPanel } from "./Novidades24hPanel";

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, hasSubmenu: false, route: "/" },
  { id: "partners", name: "Parceiros", icon: Users, hasSubmenu: true, route: "/partners" },
  { id: "pipeline", name: "Pipeline", icon: Kanban, hasSubmenu: false, route: "/pipeline" },
  { id: "health", name: "Health", icon: TrendingUp, hasSubmenu: false, route: "/health" },
  { id: "strategic", name: "Estratégico", icon: Target, hasSubmenu: false, route: "/strategic" },
  { id: "stores", name: "Lojas", icon: Store, hasSubmenu: false, route: "/stores" },
  { id: "reports", name: "Relatórios", icon: FileText, hasSubmenu: false, route: "/reports" },
  { id: "admin", name: "Admin", icon: Settings, hasSubmenu: false, route: "/admin" },
];

const partnersSubmenu = [
  { id: "partners-logistics", name: "Logísticos", icon: Truck, route: "/partners/logistics" },
  { id: "partners-payment", name: "Pagamento", icon: CreditCard, route: "/partners/payment" },
  { id: "partners-marketplace", name: "Marketplaces", icon: ShoppingBag, route: "/partners/marketplace" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps = {}) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-expand partners submenu when on a partners route
  const [showPartners, setShowPartners] = useState(
    location.pathname.startsWith('/partners')
  );

  useEffect(() => {
    if (location.pathname.startsWith('/partners')) {
      setShowPartners(true);
    }
  }, [location.pathname]);

  // Handle escape key to close mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, onClose]);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Gestão de Parceiros</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Plataforma de Gestão</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.route ||
            (item.id === 'partners' && location.pathname.startsWith('/partners'));

          if (item.hasSubmenu) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.route) {
                      navigate(item.route);
                      onClose?.();
                    }
                    setShowPartners(!showPartners);
                  }}
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
                      const isSubActive = location.pathname === subItem.route;

                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            navigate(subItem.route);
                            onClose?.();
                          }}
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
                navigate(item.route);
                onClose?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
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

      <Novidades24hPanel />

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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        id="app-sidebar"
        className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:border-r md:border-sidebar-border md:h-screen md:sticky md:top-0 bg-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="mobile-sidebar-title"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar shadow-xl border-r border-sidebar-border flex flex-col animate-in slide-in-from-left duration-200">
            <button
              className="absolute right-2 top-2 p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
              aria-label="Fechar menu"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
            
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
