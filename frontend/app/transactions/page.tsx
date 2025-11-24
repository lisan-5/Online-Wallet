"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { UserHeader } from "@/components/user-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TransactionRow } from "@/components/transaction-row";
import { api, getCached } from "@/lib/api";
import type { Transaction, TransactionType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | TransactionType>(
    "all"
  );
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // load cached/remote transactions
    fetchTransactions();

    // Check if there's a type parameter in URL
    const typeParam = searchParams.get("type");
    if (typeParam === "deposit" || typeParam === "withdraw") {
      setActiveFilter(typeParam as "deposit" | "withdraw");
    }
  }, [searchParams]);

  // Memoized filtered + paginated list to avoid extra state updates
  const filteredTransactions = useMemo(() => {
    const base =
      activeFilter === "all"
        ? transactions
        : transactions.filter((t) => t.type === activeFilter);
    const start = 0;
    const end = page * pageSize;
    return base.slice(start, end);
  }, [transactions, activeFilter, page, pageSize]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      // Try cached GET first (fast), TTL 30s
      const { data, fromCache } = await getCached<Transaction[]>(
        "/wallet/my-requests",
        30000
      );

      // Sort by date (newest first) and set
      const sorted = data
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      // If data came from cache, still update UI immediately but also
      // fire a background refresh to update cache in case of new items.
      setTransactions(sorted);

      if (fromCache) {
        // background refresh (no UI blocking)
        api
          .get<Transaction[]>("/wallet/my-requests")
          .then((resp) => {
            const refreshed = resp.data
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
            // update state only if changed length or newest timestamp differs
            if (
              refreshed.length !== transactions.length ||
              (refreshed[0] &&
                transactions[0] &&
                refreshed[0].id !== transactions[0].id)
            ) {
              setTransactions(refreshed);
            }
          })
          .catch(() => {
            /* ignore background errors */
          });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const FilterButton = ({
    filter,
    label,
  }: {
    filter: typeof activeFilter;
    label: string;
  }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeFilter === filter
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              View all your deposit and withdrawal requests
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            <FilterButton filter="all" label="All" />
            <FilterButton filter="deposit" label="Deposits" />
            <FilterButton filter="withdraw" label="Withdrawals" />
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredTransactions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {activeFilter === "all"
                  ? "No transactions found"
                  : `No ${activeFilter} requests found`}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
              {/* Load more button for large lists */}
              {transactions.length > filteredTransactions.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {!isLoading && transactions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {transactions.filter((t) => t.status === "pending").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {transactions.filter((t) => t.status === "approved").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {transactions.filter((t) => t.status === "rejected").length}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
