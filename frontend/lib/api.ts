import axios from "axios"

// Base API URL - configure this based on your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For httpOnly cookies
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Simple in-memory GET cache. Keeps recent GET responses to speed up UI.
type CacheEntry = { ts: number; data: any }
const GET_CACHE = new Map<string, CacheEntry>()

/**
 * Perform a GET with a short in-memory cache.
 * @param url request URL (relative to base)
 * @param ttl cache time in ms (default 30s)
 */
export async function getCached<T = any>(url: string, ttl = 30000) {
  const key = url
  const now = Date.now()
  const cached = GET_CACHE.get(key)
  if (cached && now - cached.ts < ttl) {
    return { data: cached.data, fromCache: true }
  }

  const resp = await api.get<T>(url)
  try {
    GET_CACHE.set(key, { ts: Date.now(), data: resp.data })
  } catch (e) {
    // ignore cache set errors
  }
  return { data: resp.data, fromCache: false }
}

export function invalidateCache(url?: string) {
  if (!url) {
    GET_CACHE.clear()
  } else {
    GET_CACHE.delete(url)
  }
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)
