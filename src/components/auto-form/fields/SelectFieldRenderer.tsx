
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldConfig } from "@/types/auto-form";
import { MultiSelectCommand } from "../MultiSelectCommand";

interface SelectFieldRendererProps {
  field: any;
  config: FieldConfig;
  disabled?: boolean;
}

export const SelectFieldRenderer = ({ field, config, disabled }: SelectFieldRendererProps) => {
  if (config.multiple) {
    return (
      <MultiSelectCommand
        options={config.options || []}
        value={Array.isArray(field.value) ? field.value : []}
        onChange={field.onChange}
        placeholder={config.placeholder}
        disabled={disabled}
      />
    );
  }

  return (
    <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
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
};
