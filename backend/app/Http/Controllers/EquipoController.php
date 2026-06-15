<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use Illuminate\Http\Request;

class EquipoController extends Controller
{
    public function index()
    {
        return response()->json(Equipo::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'required|string|max:50',
            'ubicacion' => 'nullable|string|max:255',
            'fecha_alta' => 'nullable|date',
        ]);

        $equipo = Equipo::create($validated);
        return response()->json($equipo, 201);
    }

    public function show($id)
    {
        $equipo = Equipo::find($id);
        if (!$equipo) return response()->json(['message' => 'Equipo no encontrado'], 404);
        return response()->json($equipo, 200);
    }

    public function update(Request $request, $id)
    {
        $equipo = Equipo::find($id);
        if (!$equipo) return response()->json(['message' => 'Equipo no encontrado'], 404);

        $equipo->update($request->all());
        return response()->json($equipo, 200);
    }

    public function destroy($id)
    {
        $equipo = Equipo::find($id);
        if (!$equipo) return response()->json(['message' => 'Equipo no encontrado'], 404);

        $equipo->delete();
        return response()->json(['message' => 'Equipo eliminado'], 200);
    }
}