import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface RatingFieldProps {
  label: string;
  value: number;
  notes?: string;
  onValueChange: (value: number) => void;
  onNotesChange?: (notes: string) => void;
  showNotes?: boolean;
}

export function RatingField({
  label,
  value,
  notes,
  onValueChange,
  onNotesChange,
  showNotes = true,
}: RatingFieldProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>{label}</FormLabel>
          <span className="text-sm font-medium tabular-nums">{value.toFixed(1)}/10</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(vals) => onValueChange(vals[0])}
          max={10}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 (Péssimo)</span>
          <span>5 (Mediano)</span>
          <span>10 (Excelente)</span>
        </div>
      </div>

      {showNotes && onNotesChange && (
        <Textarea
          placeholder={`Observações sobre ${label.toLowerCase()}...`}
          value={notes || ""}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          className="text-sm"
        />
      )}
    </div>
  );
}
