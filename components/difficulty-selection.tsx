"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface DifficultySelectionProps {
  category: string
  onDifficultySelected: (difficulty: string) => void
  onBack: () => void
}

export function DifficultySelection({ category, onDifficultySelected, onBack }: DifficultySelectionProps) {
  const difficulties = [
    { level: "1", name: "Osson", description: "Oddiy Darajadagi Savollar" },
    { level: "2", name: "O'rtacha", description: "Qiyinroq Darajadagi Savollar" },
    { level: "3", name: "Qiyin", description: "Murakkab Darajadagi Savollar" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Qiyinlik Darajasini Tanlang</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Toifa: {category.replace(/_/g, " ")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((diff) => (
            <Button
              key={diff.level}
              variant="outline"
              className="h-auto p-6 text-left justify-start bg-transparent"
              onClick={() => onDifficultySelected(diff.level)}
            >
              <div>
                <div className="font-medium text-lg">{diff.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{diff.description}</div>
                <div className="text-xs text-muted-foreground mt-2">Daraja {diff.level}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
