<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Prestamo extends Model
{
    protected $table = 'Prestamo';
    protected $primaryKey = 'id_prestamo';
    public $timestamps = false;
    protected $fillable = ['fecha_solicitud', 'fecha_prestamo', 'fecha_devolucion_es', 'fecha_devolucion_real', 'estado', 'observaciones'];
}
