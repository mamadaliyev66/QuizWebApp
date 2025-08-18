import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { QuizInterface } from "@/components/quiz-interface"

export default async function QuizPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz System</h1>
          <p className="text-muted-foreground">Welcome, {user.name}</p>
        </div>
        <QuizInterface />
      </div>
    </div>
  )
}
