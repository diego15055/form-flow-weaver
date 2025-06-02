
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/types/auto-form";

interface FormFieldProps {
  name: string;
  config: FieldConfig;
  control: Control<any>;
  error?: string;
}

export const DynamicFormField = ({ name, config, control, error }: FormFieldProps) => {
  const renderField = () => {
    switch (config.type) {
      case 'textarea':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={config.placeholder}
                className={error ? 'border-red-500' : ''}
              />
            )}
          />
        );
        
      case 'checkbox':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor={name}>{config.label}</Label>
              </div>
            )}
          />
        );
        
      case 'radio':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-2"
              >
                {config.options?.map((option) => (
                  <div key={String(option.value)} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={String(option.value)}
                      id={`${name}-${option.value}`}
                    />
                    <Label htmlFor={`${name}-${option.value}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );
        
      case 'select':
        // Check if it's multiple select
        if (config.multiple) {
          return (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {config.options?.map((option) => (
                    <div key={String(option.value)} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${name}-${option.value}`}
                        checked={Array.isArray(field.value) ? field.value.includes(String(option.value)) : false}
                        onCheckedChange={(checked) => {
                          const currentValue = Array.isArray(field.value) ? field.value : [];
                          if (checked) {
                            field.onChange([...currentValue, String(option.value)]);
                          } else {
                            field.onChange(currentValue.filter((val: string) => val !== String(option.value)));
                          }
                        }}
                      />
                      <Label htmlFor={`${name}-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
          );
        }
        
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={error ? 'border-red-500' : ''}>
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
            )}
          />
        );
        
      case 'date':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      error && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "dd/MM/yyyy") : config.placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );
        
      case 'number':
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder={config.placeholder}
                className={error ? 'border-red-500' : ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
              />
            )}
          />
        );
        
      default:
        return (
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type={config.type || 'text'}
                placeholder={config.placeholder}
                className={error ? 'border-red-500' : ''}
              />
            )}
          />
        );
    }
  };

  const isCheckboxType = config.type === 'checkbox';

  if (isCheckboxType) {
    return (
      <FormItem className="space-y-3">
        <FormControl>
          {renderField()}
        </FormControl>
        {config.description && (
          <FormDescription>{config.description}</FormDescription>
        )}
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    );
  }

  return (
    <FormItem className="space-y-2">
      {config.label && !isCheckboxType && (
        <FormLabel className="text-sm font-medium">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <FormControl>
        {renderField()}
      </FormControl>
      {config.description && (
        <FormDescription className="text-xs text-muted-foreground">
          {config.description}
        </FormDescription>
      )}
      {error && <FormMessage className="text-xs text-red-500">{error}</FormMessage>}
    </FormItem>
  );
};
