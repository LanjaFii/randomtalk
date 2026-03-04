<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ConversationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageStatusController;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Dashboard (auth)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    // Conversations
    Route::get('/conversations', [ConversationController::class, 'index'])
        ->name('conversations.index');

    Route::post('/conversations', [ConversationController::class, 'store'])
        ->name('conversations.store');

    Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])
        ->name('conversations.show');

    Route::post('/conversations/random', [ConversationController::class, 'random'])
        ->name('conversations.random')
        ->middleware('auth');

    Route::post('/users/search', [ConversationController::class, 'search'])
        ->name('users.search');


    // Messages (ICI)
    Route::post(
        '/conversations/{conversation}/messages',
        [MessageController::class, 'store']
    )->name('messages.store');

    // Message status routes
    Route::post('/messages/{message}/delivered', [MessageStatusController::class, 'delivered'])
        ->name('messages.delivered');

    Route::post('/messages/{message}/seen', [MessageStatusController::class, 'seen'])
        ->name('messages.seen');
});

/*
|--------------------------------------------------------------------------
| Auth routes (Breeze / Fortify)
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
