<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    protected $table = 'Mensaje';
    protected $primaryKey = 'id_mensaje';
    public $timestamps = false;
    protected $fillable = ['id_emisor', 'id_receptor', 'asunto', 'contenido', 'fecha_envio', 'leido'];

    protected $casts = [
        'fecha_envio' => 'datetime',
    ];
}