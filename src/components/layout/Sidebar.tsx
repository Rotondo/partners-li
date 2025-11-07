import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  BarChart3,
  List,
  Activity,
  Store,
  LayoutDashboard,
  Settings,
  ChevronDown,
  LogOut,
  Scale,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  DollarSign,
  Truck,
  CreditCard,
  ShoppingBag,
  Kanban,
  Target,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Novidades24hPanel } from "./Novidades24hPanel";

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard, href: "/", hasSubmenu: false },
  { id: "partners", name: "Parceiros", icon: Users, href: "/partners", hasSubmenu: true },
  { id: "pipeline", name: "Pipeline", icon: Kanban, href: "/pipeline", hasSubmenu: false },
  { id: "health", name: "Health", icon: Target, href: "/health", hasSubmenu: false },
  { id: "strategic", name: "Estratégico", icon: BarChart3, href: "/strategic", hasSubmenu: false },
  { id: "stores", name: "Lojas", icon: Store, href: "/stores", hasSubmenu: false },
  { id: "reports", name: "Relatórios", icon: TrendingUp, href: "/reports", hasSubmenu: true },
  { id: "legal", name: "Jurídico", icon: Scale, href: "/legal", hasSubmenu: false },
  { id: "admin", name: "Admin", icon: Settings, href: "/admin", hasSubmenu: false },
];

const partnersSubmenu = [
  { name: "Logísticos", href: "/partners/logistics", icon: Truck },
  { name: "Pagamento", href: "/partners/payment", icon: CreditCard },
  { name: "Marketplaces", href: "/partners/marketplace", icon: ShoppingBag },
];

const reportsSubmenu = [
  { name: "Visão Geral", href: "/reports" },
  { name: "Financeiro", href: "/reports?tab=financial" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showPartners, setShowPartners] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  // Automatically expand submenus when on relevant routes
  useEffect(() => {
    if (location.pathname.startsWith("/partners")) {
      setShowPartners(true);
    }
    if (location.pathname.startsWith("/reports")) {
      setShowReports(true);
    }
  }, [location.pathname]);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

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

  const SidebarContent = ({ isDrawer = false }: { isDrawer?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={cn("border-b flex items-center justify-between", collapsed && !isDrawer ? "p-2" : "p-6")}>
        {(!collapsed || isDrawer) && (
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Partner Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">PRM/CRM</p>
          </div>
        )}
        {!isDrawer && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className={cn("shrink-0", collapsed ? "mx-auto" : "")}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        <TooltipProvider>
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  {item.hasSubmenu ? (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              if (item.id === 'partners') setShowPartners(!showPartners);
                              if (item.id === 'reports') setShowReports(!showReports);
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                              collapsed && !isDrawer && "justify-center"
                            )}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            {(!collapsed || isDrawer) && (
                              <>
                                <span className="flex-1 text-left">{item.name}</span>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform shrink-0",
                                    (item.id === 'partners' && showPartners) && "rotate-180",
                                    (item.id === 'reports' && showReports) && "rotate-180"
                                  )}
                                />
                              </>
                            )}
                          </button>
                        </TooltipTrigger>
                        {collapsed && !isDrawer && <TooltipContent side="right">{item.name}</TooltipContent>}
                      </Tooltip>
                      {item.id === 'partners' && showPartners && (!collapsed || isDrawer) && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {partnersSubmenu.map((subitem) => {
                            const SubIcon = subitem.icon;
                            return (
                              <li key={subitem.href}>
                                <Link
                                  to={subitem.href}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    location.pathname === subitem.href &&
                                      "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                  )}
                                >
                                  <SubIcon className="h-4 w-4" />
                                  {subitem.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {item.id === 'reports' && showReports && (!collapsed || isDrawer) && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {reportsSubmenu.map((subitem) => (
                            <li key={subitem.href}>
                              <Link
                                to={subitem.href}
                                className={cn(
                                  "block px-3 py-2 rounded-lg text-sm transition-colors",
                                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                  location.pathname === subitem.href &&
                                    "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                                )}
                              >
                                {subitem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                            collapsed && !isDrawer && "justify-center"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {(!collapsed || isDrawer) && <span>{item.name}</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && !isDrawer && <TooltipContent side="right">{item.name}</TooltipContent>}
                    </Tooltip>
                  )}
                </li>
              );
            })}
          </ul>
        </TooltipProvider>

        {/* Painel de Novidades - apenas quando não está colapsado */}
        {(!collapsed || isDrawer) && <Novidades24hPanel />}
      </nav>

      <div className="border-t p-4">
        {(!collapsed || isDrawer) && (
          <div className="text-sm text-muted-foreground mb-2 truncate">
            {user?.email}
          </div>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full gap-2", collapsed && !isDrawer ? "justify-center px-2" : "justify-start")}
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {(!collapsed || isDrawer) && "Sair"}
            </Button>
          </TooltipTrigger>
          {collapsed && !isDrawer && <TooltipContent side="right">Sair</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="app-sidebar"
        className={cn(
          "hidden md:flex md:flex-col md:shrink-0 md:border-r md:h-screen md:sticky md:top-0 bg-sidebar transition-all duration-200",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar shadow-xl border-r animate-in slide-in-from-left duration-200">
            <button
              className="absolute right-2 top-2 h-8 w-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
              aria-label="Fechar menu"
              onClick={onClose}
            >
              ✕
            </button>
            <SidebarContent isDrawer={true} />
          </div>
        </div>
      )}
    </>
  );
}
