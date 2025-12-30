"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditableCategoryComboboxProps {
  value: string
  onChange: (value: string) => void
  categories: string[]
  onCreateCategory: (name: string) => boolean
  onDeleteCategory: (name: string) => void
  disabled?: boolean
}

export function EditableCategoryCombobox({
  value,
  onChange,
  categories,
  onCreateCategory,
  onDeleteCategory,
  disabled = false,
}: EditableCategoryComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null)
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [createError, setCreateError] = React.useState<string | null>(null)

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories
    return categories.filter((category) => category.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [categories, searchQuery])

  const handleCreateCategory = () => {
    setCreateError(null)
    const trimmedName = newCategoryName.trim()

    if (!trimmedName || trimmedName.length < 2) {
      setCreateError("La categoría debe tener al menos 2 caracteres")
      return
    }

    const success = onCreateCategory(trimmedName)
    if (success) {
      onChange(trimmedName)
      setNewCategoryName("")
      setNewCategoryDialogOpen(false)
      setOpen(false)
    } else {
      setCreateError("Esta categoría ya existe")
    }
  }

  const handleDeleteClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete)
      if (value === categoryToDelete) {
        onChange("")
      }
      setCategoryToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSelectCategory = (category: string) => {
    onChange(category)
    setOpen(false)
    setSearchQuery("")
  }

  const showCreateOption = searchQuery.trim().length >= 2 && filteredCategories.length === 0

  return (
    <>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Seleccionar categoría"
              disabled={disabled}
              className="flex-1 justify-between bg-transparent"
            >
              {value || "Selecciona una categoría..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-300 p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar categoría..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                aria-label="Buscar categoría"
              />
              <CommandList>
                {filteredCategories.length === 0 && !showCreateOption && (
                  <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                )}
                {filteredCategories.length > 0 && (
                  <CommandGroup>
                    {filteredCategories.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={() => handleSelectCategory(category)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Check className={cn("h-4 w-4", value === category ? "opacity-100" : "opacity-0")} />
                          <span>{category}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => handleDeleteClick(category, e)}
                          aria-label={`Eliminar ${category}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {showCreateOption && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setNewCategoryName(searchQuery.trim())
                        setNewCategoryDialogOpen(true)
                        setOpen(false)
                      }}
                      className="text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear "{searchQuery.trim()}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            setNewCategoryName("")
            setCreateError(null)
            setNewCategoryDialogOpen(true)
          }}
          disabled={disabled}
          aria-label="Crear nueva categoría"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Dialog para crear nueva categoría */}
      <Dialog open={newCategoryDialogOpen} onOpenChange={setNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>Crea una nueva categoría para las ofertas laborales.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-category">Nombre de la categoría</Label>
              <Input
                id="new-category"
                placeholder="ej. Recursos Humanos"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value)
                  setCreateError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleCreateCategory()
                  }
                }}
                aria-describedby={createError ? "create-error" : undefined}
                aria-invalid={!!createError}
              />
              {createError && (
                <p id="create-error" className="text-sm text-destructive">
                  {createError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateCategory}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría "{categoryToDelete}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
