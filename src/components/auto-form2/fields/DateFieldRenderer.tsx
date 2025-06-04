import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/types/auto-form";
import { useCallback, memo } from "react";

interface DateFieldRendererProps {
  field: any;
  config: FieldConfig;
  disabled?: boolean;
}

export const DateFieldRenderer = memo(({ field, config, disabled }: DateFieldRendererProps) => {
  const handleSelect = useCallback((date: Date | undefined) => {
    // Verificar se a data realmente mudou antes de chamar onChange
    if (date?.getTime() !== field.value?.getTime()) {
      field.onChange(date);
    }
  }, [field]);

  return (
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
          onSelect={handleSelect}
          initialFocus
          className="p-3 pointer-events-auto"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
});

DateFieldRenderer.displayName = "DateFieldRenderer";