import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldConfig } from "@/types/auto-form";
import { MultiSelectCommand } from "../MultiSelectCommand";
import { useCallback, memo } from "react";

interface SelectFieldRendererProps {
  field: any;
  config: FieldConfig;
  disabled?: boolean;
}

export const SelectFieldRenderer = memo(({ field, config, disabled }: SelectFieldRendererProps) => {
  const handleValueChange = useCallback((value: string) => {
    if (value !== field.value) {
      field.onChange(value);
    }
  }, [field]);

  const handleMultiValueChange = useCallback((values: string[]) => {
    // Verificar se os arrays são diferentes antes de atualizar
    if (!field.value || 
        !Array.isArray(field.value) || 
        field.value.length !== values.length || 
        !field.value.every((v: string, i: number) => v === values[i])) {
      field.onChange(values);
    }
  }, [field]);

  if (config.multiple) {
    return (
      <MultiSelectCommand
        options={config.options || []}
        value={Array.isArray(field.value) ? field.value : []}
        onChange={handleMultiValueChange}
        placeholder={config.placeholder}
        disabled={disabled}
      />
    );
  }

  return (
    <Select onValueChange={handleValueChange} value={field.value || ""} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={config.placeholder || "Selecione uma opção"} />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

SelectFieldRenderer.displayName = "SelectFieldRenderer";