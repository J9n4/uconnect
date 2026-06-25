<?php

namespace App\Http\Controllers;

use App\Models\HorarioAtencion;
use Illuminate\Http\Request;

class HorarioAtencionController extends Controller
{
    public function index()
    {
        return response()->json(HorarioAtencion::with(['profesor.usuario', 'estudiante.usuario'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_profesor' => 'required|integer|exists:Profesor,id_profesor',
            'id_estudiante' => 'nullable|integer|exists:Estudiante,id_estudiante',
            'dia_semana' => 'required|string|max:50',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'modalidad' => 'required|string|max:100',
            'ubicacion' => 'nullable|string|max:255',
            'estado' => 'required|string|max:50',
        ]);

        $horario = HorarioAtencion::create($validated);
        return response()->json($horario->load(['profesor.usuario', 'estudiante.usuario']), 201);
    }

    public function show($id)
    {
        $horario = HorarioAtencion::with(['profesor.usuario', 'estudiante.usuario'])->find($id);
        if (!$horario) return response()->json(['message' => 'Horario no encontrado'], 404);
        return response()->json($horario, 200);
    }

    public function update(Request $request, $id)
    {
        $horario = HorarioAtencion::find($id);
        if (!$horario) return response()->json(['message' => 'Horario no encontrado'], 404);

        $horario->update($request->all());
        return response()->json($horario, 200);
    }

    public function destroy($id)
    {
        $horario = HorarioAtencion::find($id);
        if (!$horario) return response()->json(['message' => 'Horario no encontrado'], 404);

        $horario->delete();
        return response()->json(['message' => 'Horario eliminado'], 200);
    }
}