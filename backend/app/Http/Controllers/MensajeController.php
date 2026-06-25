<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use Illuminate\Http\Request;

class MensajeController extends Controller
{
    public function index()
    {
        return response()->json(Mensaje::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_emisor' => 'required|integer',
            'id_receptor' => 'required|integer',
            'asunto' => 'nullable|string|max:255',
            'contenido' => 'required|string',
            'fecha_envio' => 'required|date',
            'leido' => 'required|boolean',
        ]);

        $mensaje = Mensaje::create($validated);
        return response()->json($mensaje, 201);
    }

    public function show($id)
    {
        $mensaje = Mensaje::find($id);
        if (!$mensaje) return response()->json(['message' => 'Mensaje no encontrado'], 404);
        return response()->json($mensaje, 200);
    }

    public function update(Request $request, $id)
    {
        $mensaje = Mensaje::find($id);
        if (!$mensaje) return response()->json(['message' => 'Mensaje no encontrado'], 404);

        $mensaje->update($request->all());
        return response()->json($mensaje, 200);
    }

    public function destroy($id)
    {
        $mensaje = Mensaje::find($id);
        if (!$mensaje) return response()->json(['message' => 'Mensaje no encontrado'], 404);

        $mensaje->delete();
        return response()->json(['message' => 'Mensaje eliminado'], 200);
    }
}