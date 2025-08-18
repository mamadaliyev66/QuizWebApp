"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateUserFormProps {
  onUserCreated: () => void
  onCancel: () => void
}

export function CreateUserForm({ onUserCreated, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    password: "",
    isAdmin: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onUserCreated()
        setFormData({ name: "", login: "", password: "", isAdmin: false })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create user")
      }
    } catch {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Ismi</Label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="login">Foydalanuvchi Uchun Login</Label>
          <Input
            id="login"
            type="text"
            required
            value={formData.login}
            onChange={(e) => setFormData((prev) => ({ ...prev, login: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Foydalanuvchi Uchun Parol</Label>
        <Input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAdmin"
          checked={formData.isAdmin}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAdmin: !!checked }))}
        />
        <Label htmlFor="isAdmin">Admin Qilib Tayinlansin</Label>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Yaratilmoqda..." : "Yaratish"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Bekor Qilish
        </Button>
      </div>
    </form>
  )
}
