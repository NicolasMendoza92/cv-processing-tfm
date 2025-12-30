"use client"

import { useState, useEffect } from "react"

const DEFAULT_CATEGORIES = ["Almacén, Logística y Transporte", "Comercial y Atención al Cliente", "Hostelería y Turismo", 
  "Limpieza y Servicios Auxiliares", "Puestos especiales", "Sanidad y Cuidado Personal","Otros"]

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(() => {
    // Try to load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("job_categories")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return DEFAULT_CATEGORIES
        }
      }
    }
    return DEFAULT_CATEGORIES
  })

  // Save to localStorage whenever categories change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("job_categories", JSON.stringify(categories))
    }
  }, [categories])

  const createCategory = (name: string): boolean => {
    const trimmedName = name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      return false
    }

    // Check for duplicates (case-insensitive)
    const exists = categories.some((cat) => cat.toLowerCase() === trimmedName.toLowerCase())
    if (exists) {
      return false
    }

    setCategories((prev) => [...prev, trimmedName])
    return true
  }

  const deleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== name))
  }

  // Future API integration point
  const syncWithAPI = async () => {
    // TODO: Fetch from /api/categories
    // const response = await fetch('/api/categories')
    // const data = await response.json()
    // setCategories(data)
  }

  return {
    categories,
    createCategory,
    deleteCategory,
    syncWithAPI,
  }
}
