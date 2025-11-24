"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { api } from "@/lib/api"
import type { AdminStats } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      // This endpoint should return pending counts
      const response = await api.get<AdminStats>("/admin/stats")
      setStats(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage user requests and system overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Deposits</p>
                <p className="text-4xl font-bold text-yellow-600">{stats?.pendingDeposits || 0}</p>
                <Link href="/admin/requests/deposits">
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    View Deposits
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
                <p className="text-4xl font-bold text-yellow-600">{stats?.pendingWithdrawals || 0}</p>
                <Link href="/admin/requests/withdraws">
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    View Withdrawals
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    View Users
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/requests/deposits">
                <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                  <div className="text-left">
                    <p className="font-semibold">Process Deposits</p>
                    <p className="text-sm text-muted-foreground">Review and approve deposit requests</p>
                  </div>
                </Button>
              </Link>
              <Link href="/admin/requests/withdraws">
                <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent">
                  <div className="text-left">
                    <p className="font-semibold">Process Withdrawals</p>
                    <p className="text-sm text-muted-foreground">Review and approve withdrawal requests</p>
                  </div>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
