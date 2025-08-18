"use client"

import { useState } from "react"
import { CategorySelection } from "@/components/category-selection"
import { DifficultySelection } from "@/components/difficulty-selection"
import { QuizSetup } from "@/components/quiz-setup"
import { QuizSession } from "@/components/quiz-session"
import { QuizResults } from "@/components/quiz-results"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export type QuizState = "category" | "difficulty" | "setup" | "quiz" | "results"

export interface QuizData {
  category: string
  difficulty: string
  questionCount: number
  timeLimit: number
  questions: Question[]
  currentIndex: number
  answers: Answer[]
  score: number
  startTime: number
}

export interface Question {
  question: string
  true_answer: string
  answer_1: string
  answer_2: string
  answer_3: string
}

export interface Answer {
  question: string
  chosen: string
  correct: string
  isCorrect: boolean
}

export function QuizInterface() {
  const [state, setState] = useState<QuizState>("category")
  const [quizData, setQuizData] = useState<Partial<QuizData>>({})
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const resetQuiz = () => {
    setState("category")
    setQuizData({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {state !== "category" && (
            <Button variant="outline" onClick={resetQuiz}>
              Yangi test boshlash
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Chiqish
        </Button>
      </div>

      {/* Quiz Content */}
      {state === "category" && (
        <CategorySelection
          onCategorySelected={(category) => {
            setQuizData({ category })
            setState("difficulty")
          }}
        />
      )}

      {state === "difficulty" && (
        <DifficultySelection
          category={quizData.category!}
          onDifficultySelected={(difficulty) => {
            setQuizData((prev) => ({ ...prev, difficulty }))
            setState("setup")
          }}
          onBack={() => setState("category")}
        />
      )}

      {state === "setup" && (
        <QuizSetup
          category={quizData.category!}
          difficulty={quizData.difficulty!}
          onQuizStarted={(setupData) => {
            setQuizData((prev) => ({
              ...prev,
              ...setupData,
              currentIndex: 0,
              answers: [],
              score: 0,
              startTime: Date.now(),
            }))
            setState("quiz")
          }}
          onBack={() => setState("difficulty")}
        />
      )}

      {state === "quiz" && (
        <QuizSession
          quizData={quizData as QuizData}
          onAnswerSubmitted={(updatedData) => {
            setQuizData(updatedData)
          }}
          onQuizCompleted={(finalData) => {
            setQuizData(finalData)
            setState("results")
          }}
          onQuizCancelled={() => setState("category")}
        />
      )}

      {state === "results" && <QuizResults quizData={quizData as QuizData} onRestartQuiz={resetQuiz} />}
    </div>
  )
}
