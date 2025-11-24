import type { User } from "./types"

export const setAuth = (token: string, user: User) => {
  // Persist in localStorage for axios interceptor
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
  // Set a non-httpOnly cookie so Next.js middleware can read it
  try {
    document.cookie = `token=${token}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax`
  } catch {}
}

export const getAuth = (): { token: string | null; user: User | null } => {
  if (typeof window === "undefined") return { token: null, user: null }

  const token = localStorage.getItem("token")
  const userStr = localStorage.getItem("user")
  const user = userStr ? JSON.parse(userStr) : null

  return { token, user }
}

export const clearAuth = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  try {
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax"
  } catch {}
}

export const isAuthenticated = (): boolean => {
  const { token } = getAuth()
  return !!token
}

export const isAdmin = (): boolean => {
  const { user } = getAuth()
  return user?.role === "admin"
}
