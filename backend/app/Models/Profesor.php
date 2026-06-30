<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    protected $table = 'Profesor';
    protected $primaryKey = 'id_profesor';
    public $timestamps = false;
    // La tabla real tiene id_usuario separado del id_profesor (auto-increment)
    protected $fillable = ['id_usuario', 'departamento', 'titulo', 'estado'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}