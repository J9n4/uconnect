<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    public function index()
    {
        return response()->json(Estudiante::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_estudiante' => 'required|integer',
            'matricula' => 'required|string|max:100',
            'carrera' => 'required|string|max:255',
            'semestre' => 'required|integer',
            'fecha_ingreso' => 'nullable|date',
            'estado' => 'required|string|max:50',
        ]);

        $estudiante = Estudiante::create($validated);
        return response()->json($estudiante, 201);
    }

    public function show($id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) return response()->json(['message' => 'Estudiante no encontrado'], 404);
        return response()->json($estudiante, 200);
    }

    public function update(Request $request, $id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) return response()->json(['message' => 'Estudiante no encontrado'], 404);

        $estudiante->update($request->all());
        return response()->json($estudiante, 200);
    }

    public function destroy($id)
    {
        $estudiante = Estudiante::find($id);
        if (!$estudiante) return response()->json(['message' => 'Estudiante no encontrado'], 404);

        $estudiante->delete();
        return response()->json(['message' => 'Estudiante eliminado'], 200);
    }
}