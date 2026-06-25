<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AprobacionPrestamo extends Model
{
    protected $table = 'Aprobacion_prestamo';
    protected $primaryKey = 'id_aprobacion';
    public $timestamps = false;
    protected $fillable = ['id_prestamo', 'id_admin', 'accion', 'comentarios', 'fecha_accion'];
}