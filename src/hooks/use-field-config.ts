import { useState, useEffect } from "react";
import { FieldConfig, DEFAULT_FIELD_CONFIGS } from "@/types/field-config";

export function useFieldConfig() {
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(DEFAULT_FIELD_CONFIGS);

  useEffect(() => {
    const saved = localStorage.getItem('fieldConfigs');
    if (saved) {
      setFieldConfigs(JSON.parse(saved));
    }
  }, []);

  const getFieldConfig = (fieldId: string): FieldConfig | undefined => {
    return fieldConfigs.find(f => f.id === fieldId);
  };

  const isFieldEnabled = (fieldId: string): boolean => {
    const field = getFieldConfig(fieldId);
    return field?.enabled ?? true;
  };

  const isFieldRequired = (fieldId: string): boolean => {
    const field = getFieldConfig(fieldId);
    return field?.required ?? false;
  };

  return {
    fieldConfigs,
    getFieldConfig,
    isFieldEnabled,
    isFieldRequired,
  };
}

