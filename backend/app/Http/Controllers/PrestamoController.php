<?php

namespace App\Http\Controllers;

use App\Models\Prestamo;
use Illuminate\Http\Request;

class PrestamoController extends Controller
{
    public function index()
    {
        return response()->json(Prestamo::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha_solicitud' => 'required|date',
            'fecha_prestamo' => 'nullable|date',
            'fecha_devolucion_es' => 'nullable|date',
            'fecha_devolucion_real' => 'nullable|date',
            'estado' => 'required|string|max:50',
            'observaciones' => 'nullable|string',
        ]);

        $prestamo = Prestamo::create($validated);
        return response()->json($prestamo, 201);
    }

    public function show($id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);
        return response()->json($prestamo, 200);
    }

    public function update(Request $request, $id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);

        $prestamo->update($request->all());
        return response()->json($prestamo, 200);
    }

    public function destroy($id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);

        $prestamo->delete();
        return response()->json(['message' => 'Préstamo eliminado'], 200);
    }
}