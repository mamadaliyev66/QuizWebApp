"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy, Clock, Target } from "lucide-react"
import type { QuizData } from "@/components/quiz-interface"

interface QuizResultsProps {
  quizData: QuizData
  onRestartQuiz: () => void
}

export function QuizResults({ quizData, onRestartQuiz }: QuizResultsProps) {
  const totalQuestions = quizData.answers.length
  const correctAnswers = quizData.score
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  const timeSpent = Math.floor((Date.now() - quizData.startTime) / 1000)
  const minutes = Math.floor(timeSpent / 60)
  const seconds = timeSpent % 60

  const wrongAnswers = quizData.answers.filter((answer) => !answer.isCorrect)

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: "Excellent", variant: "default" as const }
    if (percentage >= 80) return { text: "Good", variant: "secondary" as const }
    if (percentage >= 60) return { text: "Average", variant: "outline" as const }
    return { text: "Needs Improvement", variant: "destructive" as const }
  }

  const performanceBadge = getPerformanceBadge(percentage)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Test Yakunlandi!</CardTitle>
          <div className={`text-4xl font-bold ${getPerformanceColor(percentage)}`}>{percentage.toFixed(1)}%</div>
          <Badge variant={performanceBadge.variant} className="mt-2">
            {performanceBadge.text}
          </Badge>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {correctAnswers}/{totalQuestions}
                </div>
                <p className="text-sm text-muted-foreground">To'g'ri Javoblar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
                <p className="text-sm text-muted-foreground">Sarflangan Vaqt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
                <p className="text-sm text-muted-foreground">Natija</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wrong Answers Review */}
      {wrongAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Notori Savollar ({wrongAnswers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wrongAnswers.map((answer, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="font-medium">{answer.question}</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Sizning Javobingiz: {answer.chosen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">To'g'ri Javob: {answer.correct}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Perfect Score Celebration */}
      {percentage === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <div className="text-green-600 text-lg font-semibold">Yaxshi Natiga! </div>
            <p className="text-green-600 mt-2">Hamma Savollarga To'g'ri Javob Berdingiz!</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onRestartQuiz} size="lg">
          Boshqa Testni Boshlash
        </Button>
      </div>
    </div>
  )
}
