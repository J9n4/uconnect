<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\ResetPasswordMail;

use App\Models\Estudiante;
use App\Models\Profesor;
use App\Models\Administrador;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'correo'     => 'required|email',
            'contrasena' => 'required|string',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        // Soportar contraseñas en texto plano (legacy) y bcrypt
        $passwordOk = false;
        if (strlen($usuario->contrasena) === 60 && str_starts_with($usuario->contrasena, '$2')) {
            // Hash bcrypt → verificar con password_verify
            $passwordOk = password_verify($request->contrasena, $usuario->contrasena);
        } else {
            // Texto plano (legacy) → comparación directa
            $passwordOk = ($request->contrasena === $usuario->contrasena);
        }

        if (!$usuario || !$passwordOk) {
            return response()->json(['message' => 'Credenciales inválidas.'], 401);
        }

        // Construir datos extendidos según el rol
        $extra = [];
        if ($usuario->rol === 'STUDENT') {
            $estudiante = Estudiante::find($usuario->id_usuario);
            $extra = [
                'matricula' => $estudiante?->matricula,
                'carrera'   => $estudiante?->carrera,
            ];
        } elseif ($usuario->rol === 'TEACHER') {
            $profesor = Profesor::find($usuario->id_usuario);
            $extra = [
                'departamento' => $profesor?->departamento,
                'titulo'       => $profesor?->titulo,
                'id_profesor'  => $profesor?->id_profesor,
            ];
        } elseif ($usuario->rol === 'ADMIN') {
            $admin = Administrador::find($usuario->id_usuario);
            $extra = [
                'cargo' => $admin?->cargo,
            ];
        }

        return response()->json(array_merge($usuario->toArray(), $extra), 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['correo' => 'required|email']);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario) {
            return response()->json(['message' => 'No encontramos un usuario con ese correo electrónico.'], 404);
        }

        // Generar un token único
        $token = Str::random(60);

        // Guardar en password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $usuario->correo],
            [
                'email' => $usuario->correo,
                'token' => hash('sha256', $token),
                'created_at' => Carbon::now()
            ]
        );

        // Enviar el correo
        Mail::to($usuario->correo)->send(new ResetPasswordMail($token, $usuario->correo));

        return response()->json(['message' => 'Te hemos enviado un enlace para restablecer tu contraseña.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'correo' => 'required|email',
            'contrasena' => 'required|min:6|confirmed', // Espera un campo contrasena_confirmation en el front
        ]);

        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->correo)
            ->first();

        if (!$reset || !hash_equals($reset->token, hash('sha256', $request->token))) {
            return response()->json(['message' => 'Este token de recuperación es inválido.'], 400);
        }

        // Verificar si el token ha expirado (ej. 60 minutos)
        if (Carbon::parse($reset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->correo)->delete();
            return response()->json(['message' => 'Este token de recuperación ha expirado.'], 400);
        }

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado.'], 404);
        }

        // Actualizar contraseña
        $usuario->contrasena = password_hash($request->contrasena, PASSWORD_BCRYPT);
        $usuario->save();

        // Borrar el token
        DB::table('password_reset_tokens')->where('email', $request->correo)->delete();

        return response()->json(['message' => 'Tu contraseña ha sido restablecida con éxito.']);
    }
}
