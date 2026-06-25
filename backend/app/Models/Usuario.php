<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    // 1. Dile el nombre EXACTO de la tabla en Supabase (respetando mayúsculas)
    protected $table = 'Usuario';

    // 2. Dile cuál es tu llave primaria (porque no usas el clásico 'id')
    protected $primaryKey = 'id_usuario';

    // 3. Desactiva los timestamps automáticos si no tienes las columnas created_at y updated_at
    public $timestamps = false;

    // 4. Indica qué columnas puede llenar Angular desde un formulario
    protected $fillable = [
        'nombre', 
        'apellido', 
        'correo', 
        'contrasena', 
        'rol', 
        'estado', 
        'fecha_registro'
    ];

    protected $casts = [
        'fecha_registro' => 'datetime',
    ];
}