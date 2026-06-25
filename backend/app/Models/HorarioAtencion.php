<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HorarioAtencion extends Model
{
    protected $table = 'Horario_atencion';
    protected $primaryKey = 'id_horario';
    public $timestamps = false;
    protected $fillable = ['id_profesor', 'id_estudiante', 'dia_semana', 'hora_inicio', 'hora_fin', 'modalidad', 'ubicacion', 'estado'];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'id_profesor', 'id_profesor');
    }

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'id_estudiante', 'id_estudiante');
    }
}