import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Settings, Database, Users, Shield, Bell, Palette } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldManager } from "@/components/admin/FieldManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("admin");

  const adminSections = [
    {
      id: "field-config",
      title: "Configuração de Campos",
      description: "Gerencie campos personalizados para parceiros",
      icon: Database,
      available: true,
    },
    {
      id: "users",
      title: "Gerenciamento de Usuários",
      description: "Controle de acesso e permissões",
      icon: Users,
      available: false,
    },
    {
      id: "security",
      title: "Segurança",
      description: "Configurações de segurança e auditoria",
      icon: Shield,
      available: false,
    },
    {
      id: "notifications",
      title: "Notificações",
      description: "Configure alertas e notificações do sistema",
      icon: Bell,
      available: false,
    },
    {
      id: "appearance",
      title: "Aparência",
      description: "Personalize cores e temas do sistema",
      icon: Palette,
      available: false,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Settings className="h-8 w-8" />
                  Administração do Sistema
                </h1>
                <p className="text-muted-foreground mt-2">
                  Configure e gerencie o sistema
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="field-config" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="field-config">Campos</TabsTrigger>
              <TabsTrigger value="users" disabled>Usuários</TabsTrigger>
              <TabsTrigger value="security" disabled>Segurança</TabsTrigger>
              <TabsTrigger value="notifications" disabled>Notificações</TabsTrigger>
              <TabsTrigger value="appearance" disabled>Aparência</TabsTrigger>
            </TabsList>

            <TabsContent value="field-config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Campos Personalizados</CardTitle>
                  <CardDescription>
                    Gerencie campos customizados para cada tipo de parceiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>
                    Controle de acesso, permissões e roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      O módulo de gerenciamento de usuários estará disponível em breve
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Auditoria, logs e políticas de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      O módulo de segurança estará disponível em breve
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                  <CardDescription>
                    Configure alertas, emails e notificações push
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      O módulo de notificações estará disponível em breve
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalização de Aparência</CardTitle>
                  <CardDescription>
                    Customize cores, logos e temas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Palette className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Em Desenvolvimento</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      O módulo de aparência estará disponível em breve
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Admin Sections Overview */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Módulos Administrativos</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {adminSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card key={section.id} className={!section.available ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Icon className="h-6 w-6 text-primary" />
                        <Badge variant={section.available ? "default" : "secondary"}>
                          {section.available ? "Disponível" : "Em breve"}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Painel Administrativo
                  </p>
                  <p className="text-sm text-blue-700">
                    O painel administrativo permite configurar campos personalizados,
                    gerenciar usuários, configurar segurança e personalizar o sistema.
                    Módulos adicionais estão sendo desenvolvidos e estarão disponíveis em breve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
