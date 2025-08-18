"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { Question } from "@/components/quiz-interface"

interface QuizSetupProps {
  category: string
  difficulty: string
  onQuizStarted: (data: { questionCount: number; timeLimit: number; questions: Question[] }) => void
  onBack: () => void
}

export function QuizSetup({ category, difficulty, onQuizStarted, onBack }: QuizSetupProps) {
  const [questionCount, setQuestionCount] = useState("")
  const [timeLimit, setTimeLimit] = useState("")
  const [availableQuestions, setAvailableQuestions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQuestionCount()
  }, [category, difficulty])

  const fetchQuestionCount = async () => {
    try {
      const response = await fetch(`/api/quiz/questions?category=${category}&difficulty=${difficulty}&count=true`)
      if (response.ok) {
        const data = await response.json()
        setAvailableQuestions(data.count)
      }
    } catch (error) {
      console.error("Failed to fetch question count:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = async () => {
    setError("")

    const count = Number.parseInt(questionCount)
    const time = Number.parseInt(timeLimit)

    if (!count || count < 1 || count > availableQuestions) {
      setError(`Question count must be between 1 and ${availableQuestions}`)
      return
    }

    if (!time || time < 1 || time > 120) {
      setError("Time limit must be between 1 and 120 minutes")
      return
    }

    try {
      const response = await fetch(`/api/quiz/questions?category=${category}&difficulty=${difficulty}&count=${count}`)
      if (response.ok) {
        const data = await response.json()
        onQuizStarted({
          questionCount: count,
          timeLimit: time * 60, // Convert to seconds
          questions: data.questions,
        })
      } else {
        setError("Failed to load questions")
      }
    } catch (error) {
      setError("Network error occurred")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-lg">Yuklanmoqda...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Quiz Setup</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {category.replace(/_/g, " ")} - Daraja {difficulty}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            <strong>Mavjud Savollar:</strong> {availableQuestions}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="questionCount">Savollar Raqami : </Label>
            <Input
              id="questionCount"
              type="number"
              min="1"
              max={availableQuestions}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder={`1-${availableQuestions}`}
            />
          </div>

          <div>
            <Label htmlFor="timeLimit">Vaqt Limiti (minutlarda)</Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              max="120"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="1-120"
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

        <Button onClick={handleStartQuiz} className="w-full" size="lg">
          Testni Boshlash 
        </Button>
      </CardContent>
    </Card>
  )
}
