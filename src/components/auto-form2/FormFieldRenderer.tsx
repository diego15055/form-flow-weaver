import { Control } from "react-hook-form";
import { FieldConfig } from "@/types/auto-form";
import { DynamicFormField } from "./FormField";

interface FormFieldRendererProps {
  visibleFields: string[];
  fields: Record<string, FieldConfig>;
  control: Control<any>;
  errors: Record<string, any>;
  disabled?: boolean;
}

export const FormFieldRenderer = ({
  visibleFields,
  fields,
  control,
  errors,
  disabled = false
}: FormFieldRendererProps) => {
  return (
    <div className="grid gap-6">
      {visibleFields.map((fieldName) => {
        if (fieldName.endsWith('_others')) {
          const originalFieldName = fieldName.replace('_others', '');
          const originalConfig = fields[originalFieldName];
          
          return (
            <DynamicFormField
              key={fieldName}
              name={fieldName}
              config={{
                label: `Especifique "${originalConfig.label}"`,
                placeholder: "Digite aqui...",
                type: 'text',
                required: false
              }}
              control={control}
              disabled={disabled}
            />
          );
        }
        
        const fieldConfig = fields[fieldName];
        if (!fieldConfig) return null;
        
        return (
          <DynamicFormField
            key={fieldName}
            name={fieldName}
            config={fieldConfig}
            control={control}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};