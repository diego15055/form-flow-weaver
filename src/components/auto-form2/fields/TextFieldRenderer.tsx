import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldConfig } from "@/types/auto-form";
import { useCallback, memo } from "react";

interface TextFieldRendererProps {
  field: any;
  config: FieldConfig;
  disabled?: boolean;
}

export const TextFieldRenderer = memo(({ field, config, disabled }: TextFieldRendererProps) => {
  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : '';
    if (value !== field.value) {
      field.onChange(value);
    }
  }, [field]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value !== field.value) {
      field.onChange(e.target.value);
    }
  }, [field]);

  if (config.type === 'textarea') {
    return (
      <Textarea
        value={field.value || ""}
        onChange={handleTextChange}
        placeholder={config.placeholder}
        disabled={disabled}
      />
    );
  }

  if (config.type === 'number') {
    return (
      <Input
        value={field.value ?? ""}
        type="number"
        placeholder={config.placeholder}
        onChange={handleNumberChange}
        disabled={disabled}
      />
    );
  }

  return (
    <Input
      value={field.value || ""}
      onChange={handleTextChange}
      type={config.type || 'text'}
      placeholder={config.placeholder}
      disabled={disabled}
    />
  );
});

TextFieldRenderer.displayName = "TextFieldRenderer";