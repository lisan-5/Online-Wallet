"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import type { AuthResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>("/admin/auth/login", {
        email,
        password,
      });

      // Verify user is admin
      if (response.data.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      // Store auth data
      setAuth(response.data.token, response.data.user);

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-10 rounded-2xl shadow-2xl border border-yellow-200 bg-white/80 backdrop-blur">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-extrabold text-yellow-700 drop-shadow">
              Admin Login
            </h1>
            <p className="text-lg text-yellow-500">Access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-yellow-700 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
                className="rounded-lg border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-yellow-700 font-semibold"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                suppressHydrationWarning
                className="rounded-lg border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg rounded-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition-transform duration-200"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? "Signing in..." : "Sign In as Admin"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <Link
              href="/"
              className="text-yellow-500 hover:text-yellow-700 font-semibold"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
