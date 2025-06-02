
import { Control } from "react-hook-form";
import { FieldConfig } from "@/types/auto-form";
import { DynamicFormField } from "./FormField";

interface FormFieldRendererProps {
  visibleFields: string[];
  fields: Record<string, FieldConfig>;
  control: Control<any>;
  errors: Record<string, any>;
}

export const FormFieldRenderer = ({
  visibleFields,
  fields,
  control,
  errors
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
              error={errors[fieldName]?.message as string}
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
            error={errors[fieldName]?.message as string}
          />
        );
      })}
    </div>
  );
};
