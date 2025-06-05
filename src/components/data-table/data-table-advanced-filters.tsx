import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface FilterOption {
  type: "text" | "select" | "checkbox" | "number" | "range"
  key: string
  label: string
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface AdvancedFiltersProps {
  filterOptions: FilterOption[]
  onSearch: (filters: Record<string, any>) => void
  initialValues?: Record<string, any>
}

export function DataTableAdvancedFilters({
  filterOptions,
  onSearch,
  initialValues = {}
}: AdvancedFiltersProps) {
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialValues)

  const handleInputChange = (key: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filterValues)
  }

  const handleReset = () => {
    setFilterValues({})
    onSearch({})
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Filtros Avançados</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <Label htmlFor={option.key}>{option.label}</Label>
                
                {option.type === "text" && (
                  <Input
                    id={option.key}
                    placeholder={option.placeholder}
                    value={filterValues[option.key] || ""}
                    onChange={(e) => handleInputChange(option.key, e.target.value)}
                  />
                )}
                
                {option.type === "select" && option.options && (
                  <Select
                    value={filterValues[option.key] || ""}
                    onValueChange={(value) => handleInputChange(option.key, value)}
                  >
                    <SelectTrigger id={option.key}>
                      <SelectValue placeholder={option.placeholder || "Selecione..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {option.type === "checkbox" && option.options && (
                  <div className="space-y-2">
                    {option.options.map((opt) => {
                      const isChecked = Array.isArray(filterValues[option.key])
                        ? filterValues[option.key]?.includes(opt.value)
                        : false
                      
                      return (
                        <div key={opt.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${option.key}-${opt.value}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(filterValues[option.key])
                                ? [...filterValues[option.key]]
                                : []
                              
                              if (checked) {
                                handleInputChange(option.key, [...currentValues, opt.value])
                              } else {
                                handleInputChange(
                                  option.key,
                                  currentValues.filter((v) => v !== opt.value)
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`${option.key}-${opt.value}`}>{opt.label}</Label>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {option.type === "number" && (
                  <Input
                    id={option.key}
                    type="number"
                    placeholder={option.placeholder}
                    value={filterValues[option.key] || ""}
                    onChange={(e) => handleInputChange(option.key, e.target.value)}
                  />
                )}
                
                {option.type === "range" && (
                  <div className="flex space-x-2">
                    <Input
                      id={`${option.key}-min`}
                      type="number"
                      placeholder="Min"
                      value={filterValues[`${option.key}Min`] || ""}
                      onChange={(e) => handleInputChange(`${option.key}Min`, e.target.value)}
                    />
                    <Input
                      id={`${option.key}-max`}
                      type="number"
                      placeholder="Max"
                      value={filterValues[`${option.key}Max`] || ""}
                      onChange={(e) => handleInputChange(`${option.key}Max`, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Limpar
            </Button>
            <Button type="submit">Pesquisar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}