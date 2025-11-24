"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AdminHeader } from "@/components/admin-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TransactionRow } from "@/components/transaction-row";
import { AdminActionDialog } from "@/components/admin-action-dialog";
import { api } from "@/lib/api";
import type { Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Transaction[]>("/admin/requests/deposits");
      // Sort by date (oldest pending first)
      const sorted = response.data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      setDeposits(sorted);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load deposits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    setSelectedId(id);
    setDialogAction("approve");
    setIsDialogOpen(true);
  };

  const handleReject = (id: string) => {
    setSelectedId(id);
    setDialogAction("reject");
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async (remark: string) => {
    if (!selectedId) return;

    setIsProcessing(true);

    try {
      const endpoint =
        dialogAction === "approve"
          ? `/admin/approve-deposit/${selectedId}`
          : `/admin/reject-deposit/${selectedId}`;

      await api.post(endpoint, { remark: remark || undefined });

      toast({
        title: "Success",
        description: `Deposit ${dialogAction}d successfully`,
      });

      // Refresh the list
      await fetchDeposits();
      setIsDialogOpen(false);
      setSelectedId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || `Failed to ${dialogAction} deposit`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = deposits.filter((d) => d.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-12 space-y-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">
                Deposit Requests
              </h1>
              <p className="text-lg text-blue-500">
                Review and manage deposit requests
              </p>
            </div>
            <Card className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-yellow-100 via-white to-yellow-50 border border-yellow-300">
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </Card>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : deposits.length === 0 ? (
            <Card className="p-12 text-center bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-400 text-lg">
                No deposit requests found
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <TransactionRow
                  key={deposit.id}
                  transaction={deposit}
                  showActions
                  onApprove={handleApprove}
                  onReject={handleReject}
                  className="hover:shadow-xl transition-shadow duration-200"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AdminActionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmAction}
        action={dialogAction}
        isLoading={isProcessing}
      />
    </div>
  );
}
