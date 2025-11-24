"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { clearAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function UserHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    router.push("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="bg-linear-to-r from-sky-600 to-indigo-600 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white font-bold shadow-lg">
                W
              </span>
              <div className="hidden sm:block text-white">
                <h1 className="text-lg font-semibold leading-none">
                  Wallet System
                </h1>
                {user && (
                  <p className="text-sm opacity-90">
                    Welcome back
                    {user.name ? `, ${user.name.split(" ")[0]}` : ""}
                  </p>
                )}
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-white hover:underline">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-white hover:underline">
              Transactions
            </Link>
            <Link href="/deposit" className="text-white hover:underline">
              Deposit
            </Link>
            <Link href="/withdraw" className="text-white hover:underline">
              Withdraw
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
                <div className="text-sm">
                  <div className="font-medium leading-none">
                    {user?.name ?? "User"}
                  </div>
                </div>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                Logout
              </Button>
            </div>

            <button
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 md:hidden bg-white/5 rounded-lg p-3">
            <nav className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="text-white py-2 px-3 rounded hover:bg-white/10"
              >
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="text-white py-2 px-3 rounded hover:bg-white/10"
              >
                Transactions
              </Link>
              <Link
                href="/deposit"
                className="text-white py-2 px-3 rounded hover:bg-white/10"
              >
                Deposit
              </Link>
              <Link
                href="/withdraw"
                className="text-white py-2 px-3 rounded hover:bg-white/10"
              >
                Withdraw
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-white py-2 px-3 rounded hover:bg-white/10"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
