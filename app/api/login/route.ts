import { type NextRequest, NextResponse } from "next/server"
import { validateUser } from "@/lib/user-storage"
import { createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    if (!login || !password) {
      return NextResponse.json({ error: "Login and password are required" }, { status: 400 })
    }

    const user = await validateUser(login, password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken(user)
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      isAdmin: user.isAdmin,
      name: user.name,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
