<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importación de los controladores del sistema
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\AdministradorController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\HorarioAtencionController;
use App\Http\Controllers\CategoriaEquipoController;
use App\Http\Controllers\EquipoController;
use App\Http\Controllers\PrestamoController;
use App\Http\Controllers\AprobacionPrestamoController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\NotificacionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Aquí se registran todos los endpoints que Angular va a consumir.
| El método apiResource genera automáticamente las rutas para:
| GET (listar y ver), POST (crear), PUT/PATCH (editar) y DELETE (borrar).
*/

use App\Http\Controllers\AuthController;

Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('profesores', ProfesorController::class);
Route::apiResource('administradores', AdministradorController::class);
Route::apiResource('estudiantes', EstudianteController::class);
Route::apiResource('horarios-atencion', HorarioAtencionController::class);
Route::apiResource('categorias-equipo', CategoriaEquipoController::class);
Route::apiResource('equipos', EquipoController::class);
Route::apiResource('prestamos', PrestamoController::class);
Route::apiResource('aprobaciones-prestamo', AprobacionPrestamoController::class);
Route::apiResource('mensajes', MensajeController::class);
Route::apiResource('notificaciones', NotificacionController::class);