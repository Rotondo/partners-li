import { useState, useEffect } from "react";
import { Settings, Save, Plus, Pencil, X, Copy } from "lucide-react";
import { FieldConfig, DEFAULT_FIELD_CONFIGS, PartnerType } from "@/types/field-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveFieldConfigs, getFieldConfigs } from "@/lib/db";

const PARTNER_TYPES = [
  { value: 'logistic', label: 'Logístico', icon: '🚚' },
  { value: 'payment', label: 'Pagamento', icon: '💳' },
  { value: 'marketplace', label: 'Marketplace', icon: '🛒' },
] as const;

export function FieldManager() {
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(DEFAULT_FIELD_CONFIGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load field configs from database on mount
  useEffect(() => {
    getFieldConfigs()
      .then(configs => {
        setFieldConfigs(configs);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading field configs:', error);
        setFieldConfigs(DEFAULT_FIELD_CONFIGS);
        setIsLoading(false);
      });
  }, []);

  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [isNewFieldDialogOpen, setIsNewFieldDialogOpen] = useState(false);
  interface ExtendedFieldConfig extends Partial<FieldConfig> {
    partnerTypes?: PartnerType[];
  }

  const [newField, setNewField] = useState<ExtendedFieldConfig>({
    label: '',
    category: 'custom',
    partnerType: 'payment',
    partnerTypes: [], // Múltiplos tipos
    enabled: true,
    required: false,
    order: 999,
  });

  const { toast } = useToast();

  const handleToggleEnabled = (fieldId: string) => {
    setFieldConfigs(fieldConfigs.map(field => 
      field.id === fieldId 
        ? { ...field, enabled: !field.enabled }
        : field
    ));
  };

  const handleToggleRequired = (fieldId: string) => {
    setFieldConfigs(fieldConfigs.map(field => 
      field.id === fieldId 
        ? { ...field, required: !field.required }
        : field
    ));
  };

  const handleSave = async () => {
    try {
      await saveFieldConfigs(fieldConfigs);
      toast({
        title: "Configurações salvas",
        description: "As configurações de campos foram salvas com sucesso.",
      });
    } catch (error) {
      toast({ 
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const handleReset = async () => {
    if (confirm("Tem certeza que deseja resetar todas as configurações para o padrão?")) {
      try {
        await saveFieldConfigs(DEFAULT_FIELD_CONFIGS);
        setFieldConfigs(DEFAULT_FIELD_CONFIGS);
        toast({
          title: "Configurações resetadas",
          description: "As configurações foram restauradas para o padrão.",
        });
      } catch (error) {
        toast({ 
          title: "Erro ao resetar",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive"
        });
      }
    }
  };

  const handleAddNewField = () => {
    if (!newField.label || !newField.id) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o ID e a Label do campo.",
        variant: "destructive",
      });
      return;
    }

    const fieldExists = fieldConfigs.some(f => f.id === newField.id);
    if (fieldExists) {
      toast({
        title: "ID já existe",
        description: "Um campo com este ID já existe.",
        variant: "destructive",
      });
      return;
    }

    // Criar um campo para cada tipo de parceiro selecionado
    const selectedTypes = newField.partnerTypes && newField.partnerTypes.length > 0
      ? newField.partnerTypes
      : [newField.partnerType];

    const newFields: FieldConfig[] = selectedTypes.map(type => ({
      id: selectedTypes.length > 1 ? `${newField.id}_${type}` : newField.id!,
      label: newField.label!,
      category: newField.category || 'custom',
      partnerType: type as 'logistic' | 'payment' | 'marketplace',
      enabled: newField.enabled ?? true,
      required: newField.required ?? false,
      order: newField.order || 999,
    }));

    setFieldConfigs([...fieldConfigs, ...newFields]);
    setIsNewFieldDialogOpen(false);
    setNewField({
      label: '',
      id: '',
      category: 'custom',
      partnerType: 'payment',
      partnerTypes: [],
      enabled: true,
      required: false,
      order: 999,
    });

    toast({
      title: "Campo(s) adicionado(s)",
      description: `${newFields.length} campo(s) adicionado(s) com sucesso.`,
    });
  };

  const handleEditField = (field: FieldConfig) => {
    setEditingField(field);
    setNewField(field);
    setIsNewFieldDialogOpen(true);
  };

  const handleUpdateField = () => {
    if (!editingField || !newField.label) return;

    setFieldConfigs(fieldConfigs.map(f => 
      f.id === editingField.id ? { ...newField } as FieldConfig : f
    ));

    setEditingField(null);
    setIsNewFieldDialogOpen(false);
    setNewField({
      label: '',
      id: '',
      category: 'custom',
      partnerType: 'payment',
      enabled: true,
      required: false,
      order: 999,
    });

    toast({
      title: "Campo atualizado",
      description: `${newField.label} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteField = (fieldId: string) => {
    const field = fieldConfigs.find(f => f.id === fieldId);
    setFieldConfigs(fieldConfigs.filter(f => f.id !== fieldId));
    toast({
      title: "Campo removido",
      description: `${field?.label} foi removido com sucesso.`,
    });
  };

  const handleDuplicateField = (field: FieldConfig) => {
    const newId = `${field.id}_copy_${Date.now()}`;
    const duplicatedField: FieldConfig = {
      ...field,
      id: newId,
      label: `${field.label} (Cópia)`,
    };
    setFieldConfigs([...fieldConfigs, duplicatedField]);
    toast({
      title: "Campo duplicado",
      description: `${field.label} foi duplicado com sucesso.`,
    });
  };

  const getFieldsByCategory = (category: string) => {
    return fieldConfigs.filter(field => field.category === category);
  };

  // Agrupar campos por tipo de parceiro
  const getFieldsByPartnerType = (type: string) => {
    return fieldConfigs.filter(field => field.partnerType === type);
  };

  // Obter todas as categorias únicas para um tipo de parceiro
  const getCategoriesForPartnerType = (type: string) => {
    const fields = getFieldsByPartnerType(type);
    return [...new Set(fields.map(f => f.category))];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciador de Campos</h2>
          <p className="text-muted-foreground">
            Configure campos separados para cada tipo de parceiro
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logistic" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {PARTNER_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PARTNER_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  Configuração de Campos - {type.label}
                </CardTitle>
                <CardDescription>
                  Gerencie quais campos aparecem nos formulários de {type.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end">
                  <Button 
                    onClick={() => {
                      setNewField({ 
                        ...newField, 
                        partnerType: type.value as 'logistic' | 'payment' | 'marketplace',
                        id: ''
                      });
                      setEditingField(null);
                      setIsNewFieldDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Campo
                  </Button>
                </div>

                {getFieldsByPartnerType(type.value).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum campo configurado para este tipo
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFieldsByPartnerType(type.value).map((field) => (
                      <div 
                        key={field.id} 
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {field.category}
                              </Badge>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Obrigatório
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              ID: {field.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDuplicateField(field)}
                            className="h-8 w-8"
                            title="Duplicar campo"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditField(field)}
                            className="h-8 w-8"
                            title="Editar campo"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteField(field.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Remover campo"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <label 
                              htmlFor={`required-${field.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              Obrigatório
                            </label>
                            <Switch
                              id={`required-${field.id}`}
                              checked={field.required}
                              onCheckedChange={() => handleToggleRequired(field.id)}
                              disabled={!field.enabled}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label 
                              htmlFor={`enabled-${field.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              Habilitado
                            </label>
                            <Switch
                              id={`enabled-${field.id}`}
                              checked={field.enabled}
                              onCheckedChange={() => handleToggleEnabled(field.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog para adicionar/editar campos */}
      <Dialog open={isNewFieldDialogOpen} onOpenChange={setIsNewFieldDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingField ? 'Editar Campo' : 'Adicionar Novo Campo'}
            </DialogTitle>
            <DialogDescription>
              Configure os dados do campo {editingField ? 'existente' : 'novo'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-id">ID do Campo *</Label>
              <Input
                id="field-id"
                value={newField.id || ''}
                onChange={(e) => setNewField({ ...newField, id: e.target.value })}
                placeholder="Ex: custom_field_1"
                disabled={!!editingField}
              />
              <p className="text-xs text-muted-foreground">
                ID único para o campo (não pode ser alterado)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-label">Label (Exibição) *</Label>
              <Input
                id="field-label"
                value={newField.label || ''}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="Ex: Campo Personalizado"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Campo (Categoria)</Label>
              <Select
                value={newField.category || 'custom'}
                onValueChange={(value) => setNewField({ ...newField, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identification">Identificação</SelectItem>
                  <SelectItem value="fees">Taxas</SelectItem>
                  <SelectItem value="settlement">Prazos/Liquidação</SelectItem>
                  <SelectItem value="custom">Customizado</SelectItem>
                  <SelectItem value="contact">Contato/URL</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="notes">Observações</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Determina onde o campo aparecerá no formulário
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tipo(s) de Parceiro onde será usado</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="type-logistic"
                    checked={newField.partnerTypes?.includes('logistic') || newField.partnerType === 'logistic'}
                    onCheckedChange={(checked) => {
                      const types = newField.partnerTypes || [];
                      const newTypes = checked 
                        ? [...types, 'logistic' as PartnerType]
                        : types.filter(t => t !== 'logistic');
                      setNewField({ ...newField, partnerTypes: newTypes });
                    }}
                  />
                  <Label htmlFor="type-logistic" className="text-sm cursor-pointer">🚚 Logístico</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="type-payment"
                    checked={newField.partnerTypes?.includes('payment') || newField.partnerType === 'payment'}
                    onCheckedChange={(checked) => {
                      const types = newField.partnerTypes || [];
                      const newTypes = checked 
                        ? [...types, 'payment' as PartnerType]
                        : types.filter(t => t !== 'payment');
                      setNewField({ ...newField, partnerTypes: newTypes });
                    }}
                  />
                  <Label htmlFor="type-payment" className="text-sm cursor-pointer">💳 Pagamento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="type-marketplace"
                    checked={newField.partnerTypes?.includes('marketplace') || newField.partnerType === 'marketplace'}
                    onCheckedChange={(checked) => {
                      const types = newField.partnerTypes || [];
                      const newTypes = checked 
                        ? [...types, 'marketplace' as PartnerType]
                        : types.filter(t => t !== 'marketplace');
                      setNewField({ ...newField, partnerTypes: newTypes as PartnerType[] });
                    }}
                  />
                  <Label htmlFor="type-marketplace" className="text-sm cursor-pointer">🛒 Marketplace</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-order">Ordem de Exibição</Label>
              <Input
                id="field-order"
                type="number"
                value={newField.order || 999}
                onChange={(e) => setNewField({ ...newField, order: parseInt(e.target.value) || 999 })}
              />
              <p className="text-xs text-muted-foreground">
                Menor número = aparece primeiro
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-status">Status Inicial</Label>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="field-enabled"
                    checked={newField.enabled ?? true}
                    onCheckedChange={(checked) => setNewField({ ...newField, enabled: checked })}
                  />
                  <label htmlFor="field-enabled" className="text-sm font-medium cursor-pointer">
                    Habilitado
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="field-required"
                    checked={newField.required ?? false}
                    onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                  />
                  <label htmlFor="field-required" className="text-sm font-medium cursor-pointer">
                    Obrigatório
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewFieldDialogOpen(false);
              setEditingField(null);
              setNewField({
                label: '',
                id: '',
                category: 'custom',
                partnerType: 'payment',
                enabled: true,
                required: false,
                order: 999,
              });
            }}>
              Cancelar
            </Button>
            <Button onClick={editingField ? handleUpdateField : handleAddNewField}>
              {editingField ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {fieldConfigs.filter(f => f.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Campos Habilitados
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {fieldConfigs.filter(f => !f.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Campos Desabilitados
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {fieldConfigs.filter(f => f.required && f.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Obrigatórios Ativos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

