"use client"

import type { Transaction } from "@/lib/types"
import { StatusBadge } from "./status-badge"
import { Card } from "./ui/card"

interface TransactionRowProps {
  transaction: Transaction
  showActions?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TransactionRow({ transaction, showActions, onApprove, onReject }: TransactionRowProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium capitalize">{transaction.type}</span>
            <StatusBadge status={transaction.status} />
          </div>
          <div className="text-sm text-muted-foreground">
            Amount: <span className="font-mono font-semibold text-foreground">${transaction.amount.toFixed(2)}</span>
          </div>
          {transaction.method && (
            <div className="text-sm text-muted-foreground">
              Method: <span className="text-foreground">{transaction.method}</span>
            </div>
          )}
          {transaction.reference && (
            <div className="text-sm text-muted-foreground">
              Reference: <span className="font-mono text-foreground">{transaction.reference}</span>
            </div>
          )}
          {transaction.phone && (
            <div className="text-sm text-muted-foreground">
              Phone: <span className="font-mono text-foreground">{transaction.phone}</span>
            </div>
          )}
          {transaction.account && (
            <div className="text-sm text-muted-foreground">
              Account: <span className="font-mono text-foreground">{transaction.account}</span>
            </div>
          )}
          {transaction.adminRemark && (
            <div className="text-sm text-muted-foreground">
              Admin Remark: <span className="text-foreground italic">{transaction.adminRemark}</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground">{new Date(transaction.createdAt).toLocaleString()}</div>
        </div>

        {showActions && transaction.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove?.(transaction.id)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject?.(transaction.id)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
