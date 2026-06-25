<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    protected $table = 'Equipo';
    protected $primaryKey = 'id_equipo';
    public $timestamps = false;
    protected $fillable = ['id_categoria', 'nombre', 'descripcion', 'estado', 'ubicacion', 'fecha_alta'];

    protected $casts = [
        'fecha_alta' => 'datetime',
    ];
}