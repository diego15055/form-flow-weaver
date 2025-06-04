
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/types/auto-form";

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
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
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
            <>
              {config.type === 'textarea' && (
                <Textarea
                  {...field}
                  placeholder={config.placeholder}
                  disabled={disabled}
                />
              )}
              
              {config.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                  <Label htmlFor={name}>{config.label}</Label>
                </div>
              )}
              
              {config.type === 'radio' && (
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
              )}
              
              {config.type === 'select' && config.multiple && (
                <div className="space-y-2">
                  {config.options?.map((option) => (
                    <div key={String(option.value)} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${name}-${option.value}`}
                        checked={Array.isArray(field.value) ? field.value.includes(String(option.value)) : false}
                        onCheckedChange={(checked) => {
                          if (disabled) return;
                          const currentValue = Array.isArray(field.value) ? field.value : [];
                          if (checked) {
                            field.onChange([...currentValue, String(option.value)]);
                          } else {
                            field.onChange(currentValue.filter((val: string) => val !== String(option.value)));
                          }
                        }}
                        disabled={disabled}
                      />
                      <Label htmlFor={`${name}-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              
              {config.type === 'select' && !config.multiple && (
                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                  <SelectTrigger>
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
              
              {config.type === 'date' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={disabled}
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
                      disabled={disabled}
                    />
                  </PopoverContent>
                </Popover>
              )}
              
              {config.type === 'number' && (
                <Input
                  {...field}
                  type="number"
                  placeholder={config.placeholder}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                  disabled={disabled}
                />
              )}
              
              {(!config.type || config.type === 'text' || config.type === 'email' || config.type === 'password') && (
                <Input
                  {...field}
                  type={config.type || 'text'}
                  placeholder={config.placeholder}
                  disabled={disabled}
                />
              )}
            </>
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
