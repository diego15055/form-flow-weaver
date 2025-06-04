
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldConfig } from "@/types/auto-form";

interface TextFieldRendererProps {
  field: any;
  config: FieldConfig;
  disabled?: boolean;
}

export const TextFieldRenderer = ({ field, config, disabled }: TextFieldRendererProps) => {
  if (config.type === 'textarea') {
    return (
      <Textarea
        {...field}
        placeholder={config.placeholder}
        disabled={disabled}
      />
    );
  }

  if (config.type === 'number') {
    return (
      <Input
        {...field}
        type="number"
        placeholder={config.placeholder}
        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
        disabled={disabled}
      />
    );
  }

  return (
    <Input
      {...field}
      type={config.type || 'text'}
      placeholder={config.placeholder}
      disabled={disabled}
    />
  );
};
