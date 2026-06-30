<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use Illuminate\Http\Request;

class ProfesorController extends Controller
{
    public function index()
    {
        return response()->json(Profesor::with('usuario')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_profesor' => 'required|integer',
            'departamento' => 'required|string|max:255',
            'titulo' => 'nullable|string|max:255',
            'estado' => 'required|string|max:50',
        ]);

        $profesor = Profesor::create($validated);
        return response()->json($profesor, 201);
    }

    public function show($id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) return response()->json(['message' => 'Profesor no encontrado'], 404);
        return response()->json($profesor, 200);
    }

    public function update(Request $request, $id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) return response()->json(['message' => 'Profesor no encontrado'], 404);

        $profesor->update($request->all());
        return response()->json($profesor, 200);
    }

    public function destroy($id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) return response()->json(['message' => 'Profesor no encontrado'], 404);

        $profesor->delete();
        return response()->json(['message' => 'Profesor eliminado'], 200);
    }
}