<?php

namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Request a deposit
     */
    public function requestDeposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'method' => 'nullable|string',
            'reference' => 'nullable|string',
        ]);

        $transaction = WalletTransaction::create([
            'user_id' => $request->user()->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'payment_method' => $request->method,
            'reference_number' => $request->reference,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Deposit request submitted successfully',
            'transaction' => $this->formatTransaction($transaction),
        ], 201);
    }

    /**
     * Request a withdrawal
     */
    public function requestWithdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'method' => 'nullable|string',
            'phone' => 'nullable|string',
            'account' => 'nullable|string',
        ]);

        $user = $request->user();

        // Check if user has sufficient balance
        if (!$user->canWithdraw($request->amount)) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 400);
        }

        $transaction = WalletTransaction::create([
            'user_id' => $user->id,
            'type' => 'withdrawal',
            'amount' => $request->amount,
            'withdraw_method' => $request->method,
            'phone_or_account' => $request->phone ?? $request->account,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted successfully',
            'transaction' => $this->formatTransaction($transaction),
        ], 201);
    }

    /**
     * Get user's transaction requests
     */
    public function myRequests(Request $request)
    {
        $transactions = WalletTransaction::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            $transactions->map(fn($t) => $this->formatTransaction($t))
        );
    }

    /**
     * Get user's balance
     */
    public function balance(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'balance' => (float) $user->balance,
            'currency' => 'USD',
        ]);
    }

    /**
     * Format transaction for API response
     */
    private function formatTransaction($transaction)
    {
        return [
            'id' => (string) $transaction->id,
            'userId' => (string) $transaction->user_id,
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
