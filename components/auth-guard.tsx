"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  name: string
  login: string
  isAdmin: boolean
}

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify")

        if (response.ok) {
          const userData = await response.json()

          if (requireAdmin && !userData.isAdmin) {
            router.push("/quiz")
            return
          }

          setUser(userData)
        } else {
          router.push("/login")
          return
        }
      } catch {
        router.push("/login")
        return
      }

      setLoading(false)
    }

    verifyAuth()
  }, [router, requireAdmin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yuklanmoqda...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
