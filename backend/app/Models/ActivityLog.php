<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $fillable = [
        'id_usuario',
        'accion',
        'descripcion',
        'ip',
        'user_agent',
        'rol',
        'nombre_usuario',
        'correo_usuario',
    ];

    /**
     * Helper estático para registrar una acción de forma sencilla.
     */
    public static function registrar(
        string $accion,
        ?string $descripcion = null,
        ?Usuario $usuario = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): void {
        self::create([
            'id_usuario'      => $usuario?->id_usuario,
            'accion'          => strtoupper($accion),
            'descripcion'     => $descripcion,
            'ip'              => $ip,
            'user_agent'      => $userAgent,
            'rol'             => $usuario?->rol,
            'nombre_usuario'  => $usuario ? "{$usuario->nombre} {$usuario->apellido}" : null,
            'correo_usuario'  => $usuario?->correo,
        ]);
    }
}
