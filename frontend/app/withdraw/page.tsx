"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserHeader } from "@/components/user-header";
import { api } from "@/lib/api";
import type { WithdrawRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { HiArrowDownTray, HiInformationCircle } from "react-icons/hi2";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const amountNum = Number.parseFloat(amount);
    if (!amount || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestData: WithdrawRequest = {
        amount: amountNum,
        method: method || undefined,
        phone: phone || undefined,
        account: account || undefined,
      };

      await api.post("/wallet/request-withdraw", requestData);

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });

      // Redirect to transactions page
      router.push("/transactions?type=withdraw");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to submit withdrawal request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-secondary-foreground shadow-md">
                <HiArrowDownTray size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Request Withdrawal</h1>
                <p className="text-sm text-muted-foreground">
                  Submit a withdrawal request for admin approval
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Withdrawal Method</Label>
                  <Input
                    id="method"
                    type="text"
                    placeholder="e.g., Bank Transfer, Mobile Money, PayPal"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account Number</Label>
                  <Input
                    id="account"
                    type="text"
                    placeholder="Bank account or payment account number"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 bg-muted/60 p-4 rounded-lg border-l-4 border-secondary">
                <HiInformationCircle className="mt-1 text-secondary-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Note</p>
                  <p>
                    Your withdrawal request will be reviewed by an admin. Once
                    approved, the amount will be deducted from your wallet
                    balance and processed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
