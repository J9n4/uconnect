<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function index()
    {
        return response()->json(Notificacion::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|string|max:255',
            'titulo' => 'required|string|max:255',
            'mensaje' => 'required|string',
            'fecha' => 'required|date',
            'leida' => 'required|string|max:10',
        ]);

        $notificacion = Notificacion::create($validated);
        return response()->json($notificacion, 201);
    }

    public function show($id)
    {
        $notificacion = Notificacion::find($id);
        if (!$notificacion) return response()->json(['message' => 'Notificación no encontrada'], 404);
        return response()->json($notificacion, 200);
    }

    public function update(Request $request, $id)
    {
        $notificacion = Notificacion::find($id);
        if (!$notificacion) return response()->json(['message' => 'Notificación no encontrada'], 404);

        $notificacion->update($request->all());
        return response()->json($notificacion, 200);
    }

    public function destroy($id)
    {
        $notificacion = Notificacion::find($id);
        if (!$notificacion) return response()->json(['message' => 'Notificación no encontrada'], 404);

        $notificacion->delete();
        return response()->json(['message' => 'Notificación eliminada'], 200);
    }
}