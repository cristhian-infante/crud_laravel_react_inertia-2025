"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Category{
  id: number
  code: string
  name: string
  status: boolean
}

interface CBCategoriesProps{
  value?: number;
  onChange?: (value: number)=>void;
  categories: Category[];
}
export function CBCategory({value, onChange, categories}:CBCategoriesProps) {
  const [open, setOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState<number>(value || 0)
  

  React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])
  
    const handleSelect = (currentValue: number) => {
      const newValue = currentValue === selectedValue ? 0 : currentValue
      setSelectedValue(newValue)
      onChange?.(newValue)
      setOpen(false)
    }

    const selectCategory = categories.find(categories => categories.id ===selectedValue)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectCategory && selectCategory
            ? `${selectCategory.name} (${selectCategory.id})`
                      : 'Seleccionar Categoría...'}

          
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar Catergoría..." className="h-9" />
          <CommandList>
            <CommandEmpty>Categoria no encontrada.</CommandEmpty>
            <CommandGroup>
              {categories.map((categories) => (
                <CommandItem
                  key={categories.id}
                  value={categories.name}
                  onSelect={() => handleSelect(categories.id)}
                >
                  {categories.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === categories.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
