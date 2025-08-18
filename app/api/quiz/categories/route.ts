import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getQuizData } from "@/lib/quiz-storage"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quizData = await getQuizData()
    return NextResponse.json({ categories: quizData.categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
