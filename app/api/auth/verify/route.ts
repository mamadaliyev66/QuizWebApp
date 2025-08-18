import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      userId: user.userId,
      login: user.login,
      name: user.name,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
