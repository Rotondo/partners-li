import { FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";

interface RatingFieldProps {
  form: UseFormReturn<any>;
  scoreName: string;
  notesName: string;
  label: string;
  showNotes?: boolean;
}

export function RatingField({
  form,
  scoreName,
  notesName,
  label,
  showNotes = true,
}: RatingFieldProps) {
  const scoreValue = form.watch(scoreName as any) || 0;
  const notesValue = form.watch(notesName as any) || "";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>{label}</FormLabel>
          <span className="text-sm font-medium tabular-nums">{scoreValue.toFixed(1)}/10</span>
        </div>
        <Slider
          value={[scoreValue]}
          onValueChange={(vals) => form.setValue(scoreName as any, vals[0])}
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

      {showNotes && (
        <Textarea
          placeholder={`Observações sobre ${label.toLowerCase()}...`}
          value={notesValue}
          onChange={(e) => form.setValue(notesName as any, e.target.value)}
          rows={2}
          className="text-sm"
        />
      )}
    </div>
  );
}
