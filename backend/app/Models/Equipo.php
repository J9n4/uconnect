<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    protected $table = 'Equipo';
    protected $primaryKey = 'id_equipo';
    public $timestamps = false;
    protected $fillable = ['nombre', 'descripcion', 'estado', 'ubicacion', 'fecha_alta'];
}