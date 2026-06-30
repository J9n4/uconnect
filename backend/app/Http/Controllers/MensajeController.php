<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use App\Models\ActivityLog;
use App\Models\Usuario;
use Illuminate\Http\Request;

class MensajeController extends Controller
{
    public function index(Request $request)
    {
        $query = Mensaje::query();
        if ($request->has('usuario_id')) {
            $userId = $request->query('usuario_id');
            $query->where('id_emisor', $userId)->orWhere('id_receptor', $userId);
        }
        return response()->json($query->get(), 200);
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

        // Log de actividad
        $emisor = Usuario::find($validated['id_emisor']);
        $receptor = Usuario::find($validated['id_receptor']);
        ActivityLog::registrar(
            'MENSAJE',
            "Mensaje enviado a: " . ($receptor ? "{$receptor->nombre} {$receptor->apellido}" : "#{$validated['id_receptor']}"),
            $emisor,
            request()->ip(),
            request()->userAgent()
        );

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