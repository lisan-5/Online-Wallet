<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// User Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// User Wallet Routes
Route::prefix('wallet')->middleware('auth:sanctum')->group(function () {
    Route::post('/request-deposit', [WalletController::class, 'requestDeposit']);
    Route::post('/request-withdraw', [WalletController::class, 'requestWithdraw']);
    Route::get('/my-requests', [WalletController::class, 'myRequests']);
    Route::get('/balance', [WalletController::class, 'balance']);
});

// Admin Authentication Routes
Route::prefix('admin/auth')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
    });
});

// Admin Routes
Route::prefix('admin')->middleware(['auth:sanctum', EnsureUserIsAdmin::class])->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/requests/deposits', [AdminController::class, 'deposits']);
    Route::get('/requests/withdrawals', [AdminController::class, 'withdrawals']);
    Route::post('/approve-deposit/{id}', [AdminController::class, 'approveDeposit']);
    Route::post('/reject-deposit/{id}', [AdminController::class, 'rejectDeposit']);
    Route::post('/approve-withdrawal/{id}', [AdminController::class, 'approveWithdrawal']);
    Route::post('/reject-withdrawal/{id}', [AdminController::class, 'rejectWithdrawal']);
    Route::get('/users', [AdminController::class, 'users']);
});
