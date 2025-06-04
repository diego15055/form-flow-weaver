
import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string | boolean;
}

interface MultiSelectCommandProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelectCommand = ({ 
  options, 
  value = [], 
  onChange, 
  placeholder = "Selecione opções...",
  disabled = false 
}: MultiSelectCommandProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    const isSelected = value.includes(selectedValue);
    if (isSelected) {
      onChange(value.filter(v => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove));
  };

  const getSelectedLabels = () => {
    return options
      .filter(option => value.includes(String(option.value)))
      .map(option => option.label);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-10 h-auto"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {getSelectedLabels().map((label, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      const optionValue = options.find(opt => opt.label === label)?.value;
                      if (optionValue) {
                        handleRemove(String(optionValue));
                      }
                    }}
                  >
                    {label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar opções..." />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={option.label}
                  onSelect={() => handleSelect(String(option.value))}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(String(option.value)) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
