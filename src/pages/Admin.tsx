import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Settings, Database, Users, Shield, Bell, Palette, Download, CheckCircle, AlertCircle } from "lucide-react";
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
import { seedPaymentPartnersIfNeeded } from "@/lib/seedPartners";
import { toast } from "sonner";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("admin");
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{
    done: boolean;
    count: number;
  } | null>(null);

  const handleSeedPartners = async () => {
    setIsSeeding(true);
    setSeedStatus(null);

    try {
      const result = await seedPaymentPartnersIfNeeded();

      if (result.seeded) {
        setSeedStatus({ done: true, count: result.count });
        toast.success(`${result.count} parceiros inseridos com sucesso!`);
      } else {
        toast.info("Parceiros já existem no banco de dados");
      }
    } catch (error) {
      console.error("Erro ao fazer seed:", error);
      toast.error("Erro ao inserir parceiros");
    } finally {
      setIsSeeding(false);
    }
  };

  const adminSections = [
    {
      id: "field-config",
      title: "Configuração de Campos",
      description: "Gerencie campos personalizados para parceiros",
      icon: Database,
      available: true,
    },
    {
      id: "database",
      title: "Banco de Dados",
      description: "Seed data e gerenciamento do banco",
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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="field-config">Campos</TabsTrigger>
              <TabsTrigger value="database">Banco de Dados</TabsTrigger>
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

            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seed de Dados - Parceiros de Pagamento</CardTitle>
                  <CardDescription>
                    Insira dados iniciais de 5 parceiros de pagamento reais (APP MAX, Pagar.me, PagBank, PagHiper, PayPal)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Sobre o Seed de Dados
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Este processo irá inserir 5 parceiros de pagamento com dados reais e completos:
                        </p>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1 ml-2">
                          <li><strong>APP MAX</strong> - Melhor custo-benefício (Pix 0,99%)</li>
                          <li><strong>Pagar.me</strong> - API robusta e integrações</li>
                          <li><strong>PagBank</strong> - Ecossistema completo</li>
                          <li><strong>PagHiper</strong> - Especialista em Pix e Boleto</li>
                          <li><strong>PayPal</strong> - Pagamentos internacionais</li>
                        </ul>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          ⚠️ Execute apenas UMA VEZ. O sistema verifica automaticamente se os dados já existem.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Inserir Parceiros de Pagamento</h4>
                        <p className="text-sm text-muted-foreground">
                          Adiciona 5 parceiros com taxas, prazos e diferenciais completos
                        </p>
                      </div>
                      <Button
                        onClick={handleSeedPartners}
                        disabled={isSeeding}
                        className="gap-2"
                      >
                        {isSeeding ? (
                          <>
                            <Download className="h-4 w-4 animate-spin" />
                            Inserindo...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Inserir Dados
                          </>
                        )}
                      </Button>
                    </div>

                    {seedStatus && seedStatus.done && (
                      <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            Seed Concluído com Sucesso!
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {seedStatus.count} parceiros de pagamento foram inseridos no banco de dados.
                            Visite o dashboard ou a página de parceiros para visualizar e comparar.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">Dados que serão inseridos:</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="font-medium">✅ Taxas Granulares:</p>
                          <ul className="text-muted-foreground list-disc list-inside ml-2 text-xs">
                            <li>MDR Crédito (à vista, 2-6x, 7-12x)</li>
                            <li>MDR Débito e Pix</li>
                            <li>Taxa de Antecipação</li>
                            <li>Taxa de Chargeback</li>
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">✅ Informações Operacionais:</p>
                          <ul className="text-muted-foreground list-disc list-inside ml-2 text-xs">
                            <li>Prazos de liquidação</li>
                            <li>Métodos suportados</li>
                            <li>Diferenciais competitivos</li>
                            <li>Notas e observações</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
