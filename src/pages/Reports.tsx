import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileText, Download, Filter, Calendar, TrendingUp, Users, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const reportTypes = [
    {
      id: "partners-overview",
      title: "Visão Geral de Parceiros",
      description: "Relatório completo com todos os parceiros e seus status",
      icon: Users,
      category: "partners",
      status: "available",
    },
    {
      id: "partners-performance",
      title: "Performance de Parceiros",
      description: "Análise de desempenho e métricas por parceiro",
      icon: TrendingUp,
      category: "partners",
      status: "available",
    },
    {
      id: "financial",
      title: "Relatório Financeiro",
      description: "Análise de receitas, custos e margens por parceiro",
      icon: DollarSign,
      category: "financial",
      status: "development",
    },
    {
      id: "logistics",
      title: "Relatório Logístico",
      description: "Métricas de entregas, prazos e cobertura",
      icon: Package,
      category: "logistics",
      status: "development",
    },
    {
      id: "activities",
      title: "Relatório de Atividades",
      description: "Histórico de atividades e interações com parceiros",
      icon: Calendar,
      category: "crm",
      status: "available",
    },
    {
      id: "health-scores",
      title: "Health Scores",
      description: "Análise de saúde das parcerias ao longo do tempo",
      icon: TrendingUp,
      category: "analytics",
      status: "available",
    },
  ];

  const filteredReports = reportTypes.filter(
    (report) => selectedCategory === "all" || report.category === selectedCategory
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <FileText className="h-8 w-8" />
                  Relatórios e Análises
                </h1>
                <p className="text-muted-foreground mt-2">
                  Gere relatórios detalhados e análises de performance
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Filtros</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Última Semana</SelectItem>
                      <SelectItem value="month">Último Mês</SelectItem>
                      <SelectItem value="quarter">Último Trimestre</SelectItem>
                      <SelectItem value="year">Último Ano</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="partners">Parceiros</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {filteredReports.map((report) => {
              const Icon = report.icon;
              const isAvailable = report.status === "available";

              return (
                <Card
                  key={report.id}
                  className={`relative transition-all ${
                    isAvailable ? "hover:shadow-md cursor-pointer" : "opacity-60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      {report.status === "development" && (
                        <Badge variant="secondary">Em breve</Badge>
                      )}
                      {report.status === "available" && (
                        <Badge variant="default">Disponível</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={isAvailable ? "default" : "outline"}
                      disabled={!isAvailable}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isAvailable ? "Gerar Relatório" : "Em Desenvolvimento"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Export Formats */}
          <Card>
            <CardHeader>
              <CardTitle>Formatos de Exportação</CardTitle>
              <CardDescription>
                Escolha o formato para exportar seus relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Sistema de Relatórios
                  </p>
                  <p className="text-sm text-blue-700">
                    Os relatórios disponíveis podem ser gerados com base nos dados atuais.
                    Relatórios financeiros e logísticos estão em desenvolvimento e estarão
                    disponíveis em breve. Use os filtros acima para personalizar a geração
                    dos relatórios.
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
