import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldConfig } from "@/types/auto-form";
import { useCallback, memo } from "react";

interface CheckboxFieldRendererProps {
  field: any;
  config: FieldConfig;
  name: string;
  disabled?: boolean;
}

export const CheckboxFieldRenderer = memo(({ field, config, name, disabled }: CheckboxFieldRendererProps) => {
  const handleCheckedChange = useCallback((checked: boolean) => {
    if (checked !== field.value) {
      field.onChange(checked);
    }
  }, [field]);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={field.value || false}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
      />
      <Label htmlFor={name}>{config.label}</Label>
    </div>
  );
});

CheckboxFieldRenderer.displayName = "CheckboxFieldRenderer";