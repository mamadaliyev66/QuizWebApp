import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getQuizData } from "@/lib/quiz-storage"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const count = searchParams.get("count")
    const countOnly = searchParams.get("count") === "true"

    if (!category || !difficulty) {
      return NextResponse.json({ error: "Category and difficulty are required" }, { status: 400 })
    }

    const quizData = await getQuizData()
    const categoryData = quizData.categories.find((cat: any) => cat.category === category)

    if (!categoryData || !categoryData.difficulty_levels[difficulty]) {
      return NextResponse.json({ error: "Category or difficulty not found" }, { status: 404 })
    }

    const questions = categoryData.difficulty_levels[difficulty]

    if (countOnly) {
      return NextResponse.json({ count: questions.length })
    }

    const requestedCount = count ? Number.parseInt(count) : questions.length
    const selectedQuestions = questions.sort(() => Math.random() - 0.5).slice(0, requestedCount)

    return NextResponse.json({ questions: selectedQuestions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}
