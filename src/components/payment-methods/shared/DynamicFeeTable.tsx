import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export interface FeeTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
  type: "text" | "number" | "currency" | "percentage";
  placeholder?: string;
}

interface DynamicFeeTableProps {
  columns: Column[];
  data: FeeTableRow[];
  onChange: (data: FeeTableRow[]) => void;
  addButtonLabel?: string;
}

export function DynamicFeeTable({ columns, data, onChange, addButtonLabel = "Adicionar Linha" }: DynamicFeeTableProps) {
  const [rows, setRows] = useState<FeeTableRow[]>(data);

  const addRow = () => {
    const newRow: FeeTableRow = {
      id: crypto.randomUUID(),
      ...columns.reduce((acc, col) => ({ ...acc, [col.key]: col.type === "text" ? "" : 0 }), {}),
    };
    const updated = [...rows, newRow];
    setRows(updated);
    onChange(updated);
  };

  const removeRow = (id: string) => {
    const updated = rows.filter((row) => row.id !== id);
    setRows(updated);
    onChange(updated);
  };

  const updateRow = (id: string, key: string, value: any) => {
    const updated = rows.map((row) =>
      row.id === id ? { ...row, [key]: value } : row
    );
    setRows(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                  Nenhuma linha adicionada
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Input
                        type={col.type === "text" ? "text" : "number"}
                        step={col.type === "percentage" || col.type === "currency" ? "0.01" : "1"}
                        placeholder={col.placeholder || ""}
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            col.key,
                            col.type === "text" ? e.target.value : parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(row.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
