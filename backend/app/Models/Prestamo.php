<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model
{
    protected $table = 'Prestamo';
    protected $primaryKey = 'id_prestamo';
    public $timestamps = false;
    protected $fillable = ['id_estudiante', 'id_equipo', 'fecha_solicitud', 'fecha_prestamo', 'fecha_devolucion_es', 'fecha_devolucion_real', 'estado', 'observaciones'];

    protected $casts = [
        'fecha_solicitud' => 'datetime',
        'fecha_prestamo' => 'datetime',
        'fecha_devolucion_es' => 'datetime',
        'fecha_devolucion_real' => 'datetime',
    ];
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'id_estudiante', 'id_estudiante');
    }

    public function equipo()
    {
        return $this->belongsTo(Equipo::class, 'id_equipo', 'id_equipo');
    }
}
