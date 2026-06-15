<?php

namespace App\Http\Controllers;

use App\Models\HorarioAtencion;
use Illuminate\Http\Request;

class HorarioAtencionController extends Controller
{
    public function index()
    {
        return response()->json(HorarioAtencion::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dia_semana' => 'required|string|max:50',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'modalidad' => 'required|string|max:100',
            'ubicacion' => 'nullable|string|max:255',
            'estado' => 'required|string|max:50',
        ]);

        $horario = HorarioAtencion::create($validated);
        return response()->json($horario, 201);
    }

    public function show($id)
    {
        $horario = HorarioAtencion::find($id);
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