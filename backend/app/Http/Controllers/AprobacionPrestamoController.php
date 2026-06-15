<?php

namespace App\Http\Controllers;

use App\Models\AprobacionPrestamo;
use Illuminate\Http\Request;

class AprobacionPrestamoController extends Controller
{
    public function index()
    {
        return response()->json(AprobacionPrestamo::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'accion' => 'required|string|max:255',
            'comentarios' => 'nullable|string',
            'fecha_accion' => 'required|date',
        ]);

        $aprobacion = AprobacionPrestamo::create($validated);
        return response()->json($aprobacion, 201);
    }

    public function show($id)
    {
        $aprobacion = AprobacionPrestamo::find($id);
        if (!$aprobacion) return response()->json(['message' => 'Aprobación no encontrada'], 404);
        return response()->json($aprobacion, 200);
    }

    public function update(Request $request, $id)
    {
        $aprobacion = AprobacionPrestamo::find($id);
        if (!$aprobacion) return response()->json(['message' => 'Aprobación no encontrada'], 404);

        $aprobacion->update($request->all());
        return response()->json($aprobacion, 200);
    }

    public function destroy($id)
    {
        $aprobacion = AprobacionPrestamo::find($id);
        if (!$aprobacion) return response()->json(['message' => 'Aprobación no encontrada'], 404);

        $aprobacion->delete();
        return response()->json(['message' => 'Aprobación eliminada'], 200);
    }
}