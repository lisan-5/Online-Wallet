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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      // Store auth data
      setAuth(response.data.token, response.data.user);

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-10 rounded-2xl shadow-2xl border border-blue-200 bg-white/80 backdrop-blur">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow">
              Welcome Back
            </h1>
            <p className="text-lg text-blue-500">
              Sign in to access your wallet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                suppressHydrationWarning
                className="rounded-lg border-blue-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-700 font-semibold">
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
                className="rounded-lg border-blue-300 focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-lg hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-transform duration-200"
              disabled={isLoading}
              suppressHydrationWarning
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
