"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateUserForm } from "@/components/create-user-form"
import { UsersList } from "@/components/users-list"
import { LogOut, Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  login: string
  isAdmin: boolean
  createdAt: string
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleUserCreated = () => {
    setShowCreateForm(false)
    fetchUsers()
  }

  const handleUserDeleted = () => {
    fetchUsers()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Foydalanuvchi Yaratish
          </Button>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Chiqish
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami Foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adminlar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.isAdmin).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oddiy Foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => !u.isAdmin).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Yangi Foydalanuvchi Yaratish</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateUserForm onUserCreated={handleUserCreated} onCancel={() => setShowCreateForm(false)} />
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchilarni Boshqarish </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList users={users} onUserDeleted={handleUserDeleted} />
        </CardContent>
      </Card>
    </div>
  )
}
