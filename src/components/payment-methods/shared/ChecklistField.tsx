import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface ChecklistFieldProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  allowCustom?: boolean;
  customPlaceholder?: string;
}

export function ChecklistField({
  label,
  options,
  value,
  onChange,
  allowCustom = false,
  customPlaceholder = "Adicionar item personalizado",
}: ChecklistFieldProps) {
  const [customInput, setCustomInput] = useState("");
  const [customItems, setCustomItems] = useState<string[]>([]);

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  const handleToggle = (option: string) => {
    if (safeValue.includes(option)) {
      onChange(safeValue.filter((v) => v !== option));
    } else {
      onChange([...safeValue, option]);
    }
  };

  const addCustomItem = () => {
    if (customInput.trim() && !customItems.includes(customInput.trim())) {
      const newItem = customInput.trim();
      setCustomItems([...customItems, newItem]);
      onChange([...safeValue, newItem]);
      setCustomInput("");
    }
  };

  const removeCustomItem = (item: string) => {
    setCustomItems(customItems.filter((i) => i !== item));
    onChange(safeValue.filter((v) => v !== item));
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`checklist-${option}`}
              checked={safeValue.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <label
              htmlFor={`checklist-${option}`}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
          </div>
        ))}
        
        {customItems.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`checklist-custom-${item}`}
              checked={safeValue.includes(item)}
              onCheckedChange={() => handleToggle(item)}
            />
            <label
              htmlFor={`checklist-custom-${item}`}
              className="text-sm font-normal leading-none flex-1"
            >
              {item}
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCustomItem(item)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {allowCustom && (
          <div className="flex gap-2 pt-2">
            <Input
              placeholder={customPlaceholder}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomItem();
                }
              }}
              className="h-8"
            />
            <Button type="button" variant="outline" size="sm" onClick={addCustomItem} className="h-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
