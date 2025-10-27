import { FieldConfig } from "@/types/field-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={blurClass}
            disabled={disabled}
          />
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

