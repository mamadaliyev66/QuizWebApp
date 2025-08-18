"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X } from "lucide-react"
import type { QuizData, Answer } from "@/components/quiz-interface"

interface QuizSessionProps {
  quizData: QuizData
  onAnswerSubmitted: (updatedData: QuizData) => void
  onQuizCompleted: (finalData: QuizData) => void
  onQuizCancelled: () => void
}

export function QuizSession({ quizData, onAnswerSubmitted, onQuizCompleted, onQuizCancelled }: QuizSessionProps) {
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  const currentQuestion = quizData.questions[quizData.currentIndex]
  const progress = ((quizData.currentIndex + 1) / quizData.questions.length) * 100

  useEffect(() => {
    if (currentQuestion) {
      const answers = [
        currentQuestion.true_answer,
        currentQuestion.answer_1,
        currentQuestion.answer_2,
        currentQuestion.answer_3,
      ]
      setShuffledAnswers(answers.sort(() => Math.random() - 0.5))
      setSelectedAnswer("")
      setShowFeedback(false)
      setIsAnswerSubmitted(false)
    }
  }, [currentQuestion])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleTimeUp = () => {
    const finalData = {
      ...quizData,
      currentIndex: quizData.questions.length,
    }
    onQuizCompleted(finalData)
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || isAnswerSubmitted) return

    setIsAnswerSubmitted(true)
    setShowFeedback(true)

    const isCorrect = selectedAnswer === currentQuestion.true_answer
    const newAnswer: Answer = {
      question: currentQuestion.question,
      chosen: selectedAnswer,
      correct: currentQuestion.true_answer,
      isCorrect,
    }

    const updatedData = {
      ...quizData,
      answers: [...quizData.answers, newAnswer],
      score: isCorrect ? quizData.score + 1 : quizData.score,
      currentIndex: quizData.currentIndex + 1,
    }

    setTimeout(() => {
      if (updatedData.currentIndex >= quizData.questions.length) {
        onQuizCompleted(updatedData)
      } else {
        onAnswerSubmitted(updatedData)
      }
    }, 2000)
  }

  const getAnswerButtonStyle = (answer: string) => {
    if (!showFeedback) {
      return selectedAnswer === answer ? "default" : "outline"
    }

    const isCorrect = answer === currentQuestion.true_answer
    const isSelected = answer === selectedAnswer

    if (isCorrect) {
      return "default"
    } else if (isSelected && !isCorrect) {
      return "destructive"
    } else {
      return "outline"
    }
  }

  const getAnswerButtonClasses = (answer: string) => {
    if (!showFeedback) {
      return selectedAnswer === answer ? "bg-primary text-primary-foreground" : "bg-transparent"
    }

    const isCorrect = answer === currentQuestion.true_answer
    const isSelected = answer === selectedAnswer

    if (isCorrect) {
      return "bg-green-500 text-white border-green-500 hover:bg-green-600"
    } else if (isSelected && !isCorrect) {
      return "bg-red-500 text-white border-red-500 hover:bg-red-600"
    } else {
      return "bg-transparent"
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-lg">Savol yuklanmoqda...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {quizData.currentIndex + 1}-savol, jami {quizData.questions.length} ta
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-lg font-mono">{formatTime(timeLeft)}</div>
              <Button variant="destructive" size="sm" onClick={onQuizCancelled}>
                Testni to'xtatish
              </Button>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shuffledAnswers.map((answer, index) => (
            <Button
              key={index}
              variant={getAnswerButtonStyle(answer)}
              className={`w-full text-left justify-start h-auto p-4 ${getAnswerButtonClasses(answer)}`}
              onClick={() => !isAnswerSubmitted && setSelectedAnswer(answer)}
              disabled={isAnswerSubmitted}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm">
                  {showFeedback ? (
                    answer === currentQuestion.true_answer ? (
                      <Check className="h-4 w-4" />
                    ) : answer === selectedAnswer ? (
                      <X className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <div className="text-left">{answer}</div>
              </div>
            </Button>
          ))}

          <div className="pt-4">
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || isAnswerSubmitted}
              className="w-full"
              size="lg"
            >
              {isAnswerSubmitted ? "Keyingi savolga o'tilmoqda..." : "Javobni yuborish"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{quizData.score}</div>
            <p className="text-xs text-muted-foreground">To'g'ri</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{quizData.answers.length}</div>
            <p className="text-xs text-muted-foreground">Javob berilgan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{quizData.questions.length - quizData.currentIndex - 1}</div>
            <p className="text-xs text-muted-foreground">Qolgan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
