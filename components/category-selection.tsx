"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  category: string
  difficulty_levels: Record<string, any[]>
}

interface CategorySelectionProps {
  onCategorySelected: (category: string) => void
}

export function CategorySelection({ onCategorySelected }: CategorySelectionProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/quiz/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-lg">Toifalar Yuklanmoqda...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toifalarni Tanlang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category.category}
              variant="outline"
              className="h-auto p-4 text-left justify-start bg-transparent"
              onClick={() => onCategorySelected(category.category)}
            >
              <div>
                <div className="font-medium capitalize">{category.category.replace(/_/g, " ")}</div>
                <div className="text-sm text-muted-foreground mt-1">
                   Mavjud qiyinlik darajasi {Object.keys(category.difficulty_levels).length}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
