
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/types/auto-form";

interface RadioFieldRendererProps {
  field: any;
  config: FieldConfig;
  name: string;
  disabled?: boolean;
}

export const RadioFieldRenderer = ({ field, config, name, disabled }: RadioFieldRendererProps) => {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      value={field.value}
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
};
