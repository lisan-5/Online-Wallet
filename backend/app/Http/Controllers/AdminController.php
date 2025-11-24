<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        $pendingDeposits = WalletTransaction::pending()->deposits()->count();
        $pendingWithdrawals = WalletTransaction::pending()->withdrawals()->count();
        $totalUsers = User::where('role', 'user')->count();

        return response()->json([
            'pendingDeposits' => $pendingDeposits,
            'pendingWithdrawals' => $pendingWithdrawals,
            'totalUsers' => $totalUsers,
        ]);
    }

    /**
     * Get pending deposit requests
     */
    public function deposits()
    {
        $deposits = WalletTransaction::deposits()
            ->pending()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            $deposits->map(fn($t) => $this->formatTransaction($t))
        );
    }

    /**
     * Get pending withdrawal requests
     */
    public function withdrawals()
    {
        $withdrawals = WalletTransaction::withdrawals()
            ->pending()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            $withdrawals->map(fn($t) => $this->formatTransaction($t))
        );
    }

    /**
     * Approve deposit
     */
    public function approveDeposit(Request $request, $id)
    {
        $request->validate([
            'admin_remark' => 'nullable|string',
        ]);

        $transaction = WalletTransaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction already processed',
            ], 400);
        }

        DB::transaction(function () use ($transaction, $request) {
            // Update transaction status
            $transaction->update([
                'status' => 'approved',
                'admin_id' => $request->user()->id,
                'admin_remark' => $request->admin_remark,
            ]);

            // Add amount to user balance
            $user = $transaction->user;
            $user->balance += $transaction->amount;
            $user->save();
        });

        return response()->json([
            'message' => 'Deposit approved successfully',
            'transaction' => $this->formatTransaction($transaction->fresh()),
        ]);
    }

    /**
     * Reject deposit
     */
    public function rejectDeposit(Request $request, $id)
    {
        $request->validate([
            'admin_remark' => 'nullable|string',
        ]);

        $transaction = WalletTransaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction already processed',
            ], 400);
        }

        $transaction->update([
            'status' => 'rejected',
            'admin_id' => $request->user()->id,
            'admin_remark' => $request->admin_remark,
        ]);

        return response()->json([
            'message' => 'Deposit rejected successfully',
            'transaction' => $this->formatTransaction($transaction),
        ]);
    }

    /**
     * Approve withdrawal
     */
    public function approveWithdrawal(Request $request, $id)
    {
        $request->validate([
            'admin_remark' => 'nullable|string',
        ]);

        $transaction = WalletTransaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction already processed',
            ], 400);
        }

        $user = $transaction->user;

        // Check if user still has sufficient balance
        if (!$user->canWithdraw($transaction->amount)) {
            return response()->json([
                'message' => 'User has insufficient balance',
            ], 400);
        }

        DB::transaction(function () use ($transaction, $request, $user) {
            // Update transaction status
            $transaction->update([
                'status' => 'approved',
                'admin_id' => $request->user()->id,
                'admin_remark' => $request->admin_remark,
            ]);

            // Deduct amount from user balance
            $user->balance -= $transaction->amount;
            $user->save();
        });

        return response()->json([
            'message' => 'Withdrawal approved successfully',
            'transaction' => $this->formatTransaction($transaction->fresh()),
        ]);
    }

    /**
     * Reject withdrawal
     */
    public function rejectWithdrawal(Request $request, $id)
    {
        $request->validate([
            'admin_remark' => 'nullable|string',
        ]);

        $transaction = WalletTransaction::findOrFail($id);

        if ($transaction->status !== 'pending') {
            return response()->json([
                'message' => 'Transaction already processed',
            ], 400);
        }

        $transaction->update([
            'status' => 'rejected',
            'admin_id' => $request->user()->id,
            'admin_remark' => $request->admin_remark,
        ]);

        return response()->json([
            'message' => 'Withdrawal rejected successfully',
            'transaction' => $this->formatTransaction($transaction),
        ]);
    }

    /**
     * Get all users
     */
    public function users()
    {
        $users = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            $users->map(fn($u) => [
                'id' => (string) $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'balance' => (float) $u->balance,
                'createdAt' => $u->created_at->toISOString(),
            ])
        );
    }

    /**
     * Format transaction for API response
     */
    private function formatTransaction($transaction)
    {
        return [
            'id' => (string) $transaction->id,
            'userId' => (string) $transaction->user_id,
            'userName' => $transaction->user->name ?? null,
            'userEmail' => $transaction->user->email ?? null,
            'type' => $transaction->type,
            'amount' => (float) $transaction->amount,
            'method' => $transaction->payment_method ?? $transaction->withdraw_method,
            'reference' => $transaction->reference_number,
            'phone' => $transaction->phone_or_account,
            'account' => $transaction->phone_or_account,
            'status' => $transaction->status,
            'adminRemark' => $transaction->admin_remark,
            'createdAt' => $transaction->created_at->toISOString(),
            'updatedAt' => $transaction->updated_at->toISOString(),
        ];
    }
}
