export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface AuthResponse {
  token: string
  user: User
}

export interface WalletBalance {
  balance: number
  currency?: string
}

export type TransactionType = "deposit" | "withdraw"
export type TransactionStatus = "pending" | "approved" | "rejected"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  method?: string
  reference?: string
  phone?: string
  account?: string
  status: TransactionStatus
  adminRemark?: string
  createdAt: string
  updatedAt?: string
}

export interface DepositRequest {
  amount: number
  method?: string
  reference?: string
}

export interface WithdrawRequest {
  amount: number
  method?: string
  phone?: string
  account?: string
}

export interface AdminStats {
  pendingDeposits: number
  pendingWithdrawals: number
  totalUsers?: number
}
