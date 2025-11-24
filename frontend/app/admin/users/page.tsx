"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface UserWithBalance extends User {
  balance?: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithBalance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<UserWithBalance[]>("/admin/users")
      setUsers(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">View all registered users</p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : users.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">No users found</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Role: <span className="capitalize">{user.role}</span>
                      </p>
                    </div>
                    {user.balance !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Balance</p>
                        <p className="text-xl font-mono font-bold">${user.balance.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
