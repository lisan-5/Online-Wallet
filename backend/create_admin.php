<?php
// Script to create or verify an admin user.
// Usage: php create_admin.php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

// Bootstrap Laravel (console kernel) to access Eloquent.
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'admin@example.com';
$password = 'password123';

$existing = User::where('email', $email)->first();
if ($existing) {
    echo "Admin user already exists: {$existing->email}\n";
    exit(0);
}

$admin = User::create([
    'name' => 'Admin',
    'email' => $email,
    'password' => Hash::make($password),
    'role' => 'admin',
    'balance' => 0.00,
]);

echo "Created admin user: {$admin->email} with password {$password}\n";
