import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <AdminDashboard />
      </div>
    </div>
  )
}
