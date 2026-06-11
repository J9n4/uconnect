<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Administrador extends Model
{
    protected $table = 'Administrador';
    protected $primaryKey = 'id_administrador';
    public $timestamps = false;
    protected $fillable = ['id_administrador', 'cargo', 'estado'];
}