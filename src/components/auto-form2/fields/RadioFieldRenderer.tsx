import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/types/auto-form";
import { useCallback, memo } from "react";

interface RadioFieldRendererProps {
  field: any;
  config: FieldConfig;
  name: string;
  disabled?: boolean;
}

export const RadioFieldRenderer = memo(({ field, config, name, disabled }: RadioFieldRendererProps) => {
  // Usar useCallback para evitar recriações desnecessárias da função
  const handleValueChange = useCallback((value: string) => {
    // Verificar se o valor realmente mudou antes de chamar onChange
    if (value !== field.value) {
      field.onChange(value);
    }
  }, [field]);

  return (
    <RadioGroup
      onValueChange={handleValueChange}
      value={field.value || ""} // Garantir que o valor nunca seja undefined
      className="flex flex-col space-y-2"
      disabled={disabled}
    >
      {config.options?.map((option) => (
        <div key={String(option.value)} className="flex items-center space-x-2">
          <RadioGroupItem
            value={String(option.value)}
            id={`${name}-${option.value}`}
            disabled={disabled}
          />
          <Label htmlFor={`${name}-${option.value}`}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
});

RadioFieldRenderer.displayName = "RadioFieldRenderer";