import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { findUserByLogin } from "./user-storage"

export interface AuthResult {
  success: boolean
  user?: {
    id: string
    name: string
    login: string
    isAdmin: boolean
  }
}

export interface AuthUser {
  userId: string
  login: string
  name: string
  isAdmin: boolean
}

const JWT_SECRET = new TextEncoder().encode("quiz-app-secret-key-2024")

export async function authenticateUser(login: string, password: string): Promise<AuthResult> {
  try {
    const user = await findUserByLogin(login)

    if (!user) {
      return { success: false }
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { success: false }
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        isAdmin: user.isAdmin,
      },
    }
  } catch {
    return { success: false }
  }
}

export async function createToken(user: {
  id: string
  login: string
  name: string
  isAdmin: boolean
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    login: user.login,
    name: user.name,
    isAdmin: user.isAdmin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as AuthUser
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    return await verifyToken(token)
  } catch {
    return null
  }
}
