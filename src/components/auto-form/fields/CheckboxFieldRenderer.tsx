
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/types/auto-form";

interface CheckboxFieldRendererProps {
  field: any;
  config: FieldConfig;
  name: string;
  disabled?: boolean;
}

export const CheckboxFieldRenderer = ({ field, config, name, disabled }: CheckboxFieldRendererProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value}
        onCheckedChange={field.onChange}
        disabled={disabled}
      />
      <Label htmlFor={name}>{config.label}</Label>
    </div>
  );
};
