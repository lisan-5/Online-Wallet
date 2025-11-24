"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserHeader } from "@/components/user-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TransactionRow } from "@/components/transaction-row";
import { api } from "@/lib/api";
import type { WalletBalance, Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch balance
      const balanceResponse = await api.get<WalletBalance>("/wallet/balance");
      setBalance(balanceResponse.data);

      // Fetch recent transactions
      const transactionsResponse = await api.get<Transaction[]>(
        "/wallet/my-requests"
      );
      // Show only the 5 most recent
      setRecentTransactions(transactionsResponse.data.slice(0, 5));
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UserHeader />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-12 space-y-10">
        {/* Balance Card */}
        <Card className="p-10 rounded-2xl shadow-xl bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-200">
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-blue-700">
              Current Balance
            </p>
            <p className="text-5xl font-extrabold font-mono text-blue-900 drop-shadow">
              ${balance?.balance?.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs text-blue-500">
              Balance updates after admin approval
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/deposit">
            <Button
              className="w-full h-24 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-transform duration-200"
              size="lg"
            >
              Request Deposit
            </Button>
          </Link>
          <Link href="/withdraw">
            <Button
              variant="outline"
              className="w-full h-24 text-xl font-bold border-2 border-blue-400 text-blue-700 bg-white shadow-lg hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
              size="lg"
            >
              Request Withdraw
            </Button>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6 mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-blue-900">
              Recent Transactions
            </h2>
            <Link href="/transactions">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:bg-blue-100"
              >
                View All
              </Button>
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <Card className="p-10 text-center text-blue-400 bg-blue-50 border border-blue-200 rounded-xl">
              No transactions yet. Start by requesting a deposit.
            </Card>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
