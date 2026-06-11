<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HorarioAtencion extends Model
{
    protected $table = 'Horario_atencion';
    protected $primaryKey = 'id_horario';
    public $timestamps = false;
    protected $fillable = ['dia_semana', 'hora_inicio', 'hora_fin', 'modalidad', 'ubicacion', 'estado'];
}