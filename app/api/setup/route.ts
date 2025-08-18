import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUsers } from "@/lib/user-storage"

export async function POST(request: NextRequest) {
  try {
    // Check if users already exist
    const existingUsers = await getUsers()
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Setup already completed" }, { status: 400 })
    }

    const { name, login, password } = await request.json()

    if (!name || !login || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create first admin user
    await createUser(name, login, password, true)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
