import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { PaymentType } from "@/types/payment-method";

interface ManageTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  types: PaymentType[];
  onUpdateTypes: (types: PaymentType[]) => void;
}

export function ManageTypesDialog({ open, onOpenChange, types, onUpdateTypes }: ManageTypesDialogProps) {
  const [newTypeName, setNewTypeName] = useState("");
  const [localTypes, setLocalTypes] = useState(types);

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const newType: PaymentType = {
        id: Date.now().toString(),
        name: newTypeName.trim(),
      };
      setLocalTypes([...localTypes, newType]);
      setNewTypeName("");
    }
  };

  const handleRemoveType = (id: string) => {
    setLocalTypes(localTypes.filter((type) => type.id !== id));
  };

  const handleSave = () => {
    onUpdateTypes(localTypes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Tipos de Parceiros</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipos Cadastrados</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {localTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{type.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveType(type.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newType">Adicionar Novo Tipo</Label>
            <div className="flex gap-2">
              <Input
                id="newType"
                placeholder="Ex: Facilitador de Pagamento"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddType();
                  }
                }}
              />
              <Button type="button" onClick={handleAddType}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
