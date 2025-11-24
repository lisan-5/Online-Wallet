import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-10 rounded-2xl shadow-2xl border border-blue-200 bg-white/80 backdrop-blur space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow">
            Online Wallet System
          </h1>
          <p className="text-lg text-blue-500">
            Secure digital wallet for deposits and withdrawals
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg rounded-lg hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-transform duration-200"
              size="lg"
            >
              User Login
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button
              variant="outline"
              className="w-full h-12 text-lg font-bold border-2 border-blue-400 text-blue-700 bg-white shadow-lg rounded-lg hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
              size="lg"
            >
              Create Account
            </Button>
          </Link>
          <Link href="/admin/login" className="block">
            <Button
              variant="secondary"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg rounded-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition-transform duration-200"
              size="lg"
            >
              Admin Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
