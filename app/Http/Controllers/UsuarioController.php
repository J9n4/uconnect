<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    // Este método devuelve todos los usuarios en formato JSON para Angular
    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios, 200);
    }
}