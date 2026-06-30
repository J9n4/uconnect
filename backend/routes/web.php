<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ActivityLogController;

Route::get('/', function () {
    return view('welcome');
});

// Panel de logs para administradores (acceso directo desde el navegador)
Route::get('/admin/logs', [ActivityLogController::class, 'panel'])->name('admin.logs');

