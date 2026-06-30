<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'Estudiante';
    protected $primaryKey = 'id_estudiante';
    public $timestamps = false;
    protected $fillable = ['id_usuario', 'matricula', 'carrera', 'semestre', 'fecha_ingreso', 'estado'];

    protected $casts = [
        'fecha_ingreso' => 'datetime',
    ];

    public function usuario()
    {
        // id_usuario es la FK en la tabla Estudiante que apunta a Usuario.id_usuario
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}