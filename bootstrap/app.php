<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\UpdateUserActivity;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__.'/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->web(append: [
            // Inertia
            HandleInertiaRequests::class,

            // UI preferences (dark/light, sidebar…)
            HandleAppearance::class,

            // ⚡ Met à jour status + last_seen
            UpdateUserActivity::class,

            // Optimisation assets
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Cookies non chiffrés (UI state)
        $middleware->encryptCookies(except: [
            'appearance',
            'sidebar_state',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
