<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    protected $table = 'Estudiante';
    protected $primaryKey = 'id_estudiante';
    public $timestamps = false;
    protected $fillable = ['id_estudiante', 'matricula', 'carrera', 'semestre', 'fecha_ingreso', 'estado'];
}