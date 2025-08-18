"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Shield, User } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserItem {
  id: string
  name: string
  login: string
  isAdmin: boolean
  createdAt: string
}

interface UsersListProps {
  users: UserItem[]
  onUserDeleted: () => void
}

export function UsersList({ users, onUserDeleted }: UsersListProps) {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onUserDeleted()
      } else {
        console.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setDeletingUserId(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Foydalanuvchi Topilmadi ! Boshlash uchun foydalanuvchi yarating.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.isAdmin ? <Shield className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-gray-600" />}
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">@{user.login}</div>
              </div>
            </div>
            <Badge variant={user.isAdmin ? "default" : "secondary"}>{user.isAdmin ? "Admin" : "User"}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Yaratilgan: {new Date(user.createdAt).toLocaleDateString()}
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 bg-transparent"
                  disabled={deletingUserId === user.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>O'chirish</AlertDialogTitle>
                  <AlertDialogDescription>
                    Foydalanuvchini O'chirishga Ishonchingiz Komilmi ? {user.name}? Qayta Tiklashni Iloji Bo'lmaydi !
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Qaytish</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700">
                    O'chirish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}
