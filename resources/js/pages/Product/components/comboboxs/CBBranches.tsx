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

//Interfaz
interface Branch {
    id: number;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    status: boolean;
}

interface CBBranchesProps {
  value?: number;
  onChange?: (value: number) => void;
  branchs: Branch[];
}

export function CBBranches({ value, onChange, branchs }: CBBranchesProps) {
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

  const selectedBranch = branchs.find(branch => branch.id === selectedValue)

  return (
      <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
              >
                  {selectedValue && selectedBranch
                      ? `${selectedBranch.name} (${selectedBranch.code})`
                      : 'Seleccionar marca...'}

                  <ChevronsUpDown className="opacity-50" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
              <Command>
                  <CommandInput
                      placeholder="Buscar Marca..."
                      className="h-9"
                  />
                  <CommandList>
                      <CommandEmpty>Marca no encontrada.</CommandEmpty>
                      <CommandGroup>
                          {branchs.map((branch) => (
                              <CommandItem
                                  key={branch.id}
                                  value={branch.name}
                                  onSelect={() => handleSelect(branch.id)}
                              >
                                  {branch.name}
                                  <Check
                                      className={cn(
                                          "ml-auto",
                                          selectedValue === branch.id ? "opacity-100" : "opacity-0"
                                          )}
                                  />
                              </CommandItem>
                          ))}
                      </CommandGroup>
                  </CommandList>
              </Command>
          </PopoverContent>
      </Popover>
  );
}
