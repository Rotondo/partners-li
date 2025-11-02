import { FieldConfig } from "@/types/field-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBlurSensitiveData } from "@/hooks/use-blur-sensitive";

interface DynamicFieldProps {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export function DynamicField({ field, value, onChange, disabled }: DynamicFieldProps) {
  const { isBlurActive } = useBlurSensitiveData();

  const blurClass = isBlurActive ? 'sensitive-data' : '';

  const renderInput = () => {
    switch (field.category) {
      case 'text':
      case 'string':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            className={blurClass}
            disabled={disabled}
          />
        );

      case 'number':
      case 'currency':
        return (
          <Input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)}
            placeholder={field.label}
            className={blurClass}
            disabled={disabled}
          />
        );

      case 'integer':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : 0)}
            placeholder={field.label}
            className={blurClass}
            disabled={disabled}
          />
        );

      case 'url':
      case 'link':
        return (
          <Input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            className={blurClass}
            disabled={disabled}
          />
        );

      case 'date':
      case 'dateStart':
      case 'dateEnd':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  blurClass
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "dd/MM/yyyy") : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={onChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'textarea':
      case 'text_area':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            rows={3}
            className={blurClass}
            disabled={disabled}
          />
        );

      case 'status':
      case 'select':
        const statusOptions = field.label.toLowerCase().includes('status') 
          ? [
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
              { value: 'pending', label: 'Em Homologação' },
              { value: 'paused', label: 'Pausado' },
            ]
          : [];
        
        return (
          <Select 
            value={value || ''} 
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={blurClass}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            className={blurClass}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
    </div>
  );
}

