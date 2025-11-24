"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { getAuth } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { user: storedUser } = getAuth()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}
