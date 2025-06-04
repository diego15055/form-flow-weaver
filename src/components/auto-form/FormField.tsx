
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { FieldConfig } from "@/types/auto-form";
import { TextFieldRenderer } from "./fields/TextFieldRenderer";
import { RadioFieldRenderer } from "./fields/RadioFieldRenderer";
import { SelectFieldRenderer } from "./fields/SelectFieldRenderer";
import { CheckboxFieldRenderer } from "./fields/CheckboxFieldRenderer";
import { DateFieldRenderer } from "./fields/DateFieldRenderer";

interface DynamicFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  config: FieldConfig;
  control: Control<TFieldValues>;
  disabled?: boolean;
}

export const DynamicFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  name, 
  config, 
  control, 
  disabled = false 
}: DynamicFormFieldProps<TFieldValues, TName>) => {
  const renderFieldControl = (field: any) => {
    switch (config.type) {
      case 'textarea':
      case 'number':
      case 'text':
      case 'email':
      case 'password':
        return <TextFieldRenderer field={field} config={config} disabled={disabled} />;
      
      case 'radio':
        return <RadioFieldRenderer field={field} config={config} name={name} disabled={disabled} />;
      
      case 'select':
        return <SelectFieldRenderer field={field} config={config} disabled={disabled} />;
      
      case 'checkbox':
        return <CheckboxFieldRenderer field={field} config={config} name={name} disabled={disabled} />;
      
      case 'date':
        return <DateFieldRenderer field={field} config={config} disabled={disabled} />;
      
      default:
        return <TextFieldRenderer field={field} config={config} disabled={disabled} />;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {config.label && config.type !== 'checkbox' && (
            <FormLabel className="text-sm font-medium flex items-center gap-2">
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
              {config.popover && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="top">
                    {config.popover}
                  </PopoverContent>
                </Popover>
              )}
            </FormLabel>
          )}
          
          <FormControl>
            {renderFieldControl(field)}
          </FormControl>
          
          {config.description && (
            <FormDescription className="text-xs text-muted-foreground">
              {config.description}
            </FormDescription>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
