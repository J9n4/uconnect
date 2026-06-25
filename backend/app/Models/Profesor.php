<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    protected $table = 'Profesor';
    protected $primaryKey = 'id_profesor';
    public $timestamps = false;
    protected $fillable = ['id_profesor', 'departamento', 'titulo', 'estado'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_profesor', 'id_usuario');
    }
}