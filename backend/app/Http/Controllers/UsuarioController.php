<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json(Usuario::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'correo' => 'required|string|email|max:255',
            'contrasena' => 'required|string|min:6',
            'rol' => 'required|string|max:50',
            'estado' => 'required|string|max:50',
            'fecha_registro' => 'nullable|date',
        ]);

        $usuario = Usuario::create($validated);
        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);
        return response()->json($usuario, 200);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $usuario->update($request->all());
        return response()->json($usuario, 200);
    }

    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}