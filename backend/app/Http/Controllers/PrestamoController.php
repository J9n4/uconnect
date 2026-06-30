<?php

namespace App\Http\Controllers;

use App\Models\Prestamo;
use App\Models\ActivityLog;
use App\Models\Usuario;
use Illuminate\Http\Request;

class PrestamoController extends Controller
{
    public function index()
    {
        return response()->json(Prestamo::with(['estudiante.usuario', 'equipo'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_estudiante' => 'required|integer',
            'id_equipo'     => 'required|integer|exists:Equipo,id_equipo',
            'fecha_solicitud'      => 'required|date',
            'fecha_prestamo'       => 'nullable|date',
            'fecha_devolucion_es'  => 'nullable|date',
            'fecha_devolucion_real'=> 'nullable|date',
            'estado'               => 'required|string|max:50',
            'observaciones'        => 'nullable|string',
        ]);

        // Resolver el id_estudiante real: puede venir como id_usuario o id_estudiante
        $estudianteId = $validated['id_estudiante'];
        $estudiante = \App\Models\Estudiante::with('usuario')->find($estudianteId);
        if (!$estudiante) {
            // Intentar buscar por id_usuario
            $estudiante = \App\Models\Estudiante::with('usuario')->where('id_usuario', $estudianteId)->first();
            if (!$estudiante) {
                return response()->json([
                    'message'  => 'Estudiante no encontrado.',
                    'errors'   => ['id_estudiante' => ["No existe un estudiante con ese ID."]]
                ], 422);
            }
            $validated['id_estudiante'] = $estudiante->id_estudiante;
        }

        $prestamo = Prestamo::create($validated);

        // Actualizar el estado del equipo a Agotado
        $equipo = \App\Models\Equipo::find($validated['id_equipo']);
        if ($equipo) {
            $equipo->estado = 'Agotado';
            $equipo->save();
        }

        // Log de actividad
        ActivityLog::registrar(
            'PRESTAMO',
            "Nuevo préstamo solicitado: Equipo #{$validated['id_equipo']} por Estudiante #{$validated['id_estudiante']}",
            $estudiante?->usuario,
            request()->ip(),
            request()->userAgent()
        );

        return response()->json($prestamo->load(['estudiante.usuario', 'equipo']), 201);
    }

    public function show($id)
    {
        $prestamo = Prestamo::with(['estudiante.usuario', 'equipo'])->find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);
        return response()->json($prestamo, 200);
    }

    public function update(Request $request, $id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);

        $prestamo->update($request->all());

        // Si se devuelve o cancela, liberar el equipo
        if (in_array($prestamo->estado, ['Devuelto', 'Cancelado'])) {
            $equipo = \App\Models\Equipo::find($prestamo->id_equipo);
            if ($equipo) {
                $equipo->estado = 'Disponible';
                $equipo->save();
            }
        }

        // Log de cambio de estado
        ActivityLog::registrar(
            'PRESTAMO',
            "Préstamo #{$id} actualizado a estado: {$prestamo->estado}",
            null,
            request()->ip(),
            request()->userAgent()
        );

        return response()->json($prestamo, 200);
    }

    public function destroy($id)
    {
        $prestamo = Prestamo::find($id);
        if (!$prestamo) return response()->json(['message' => 'Préstamo no encontrado'], 404);

        // Liberar equipo al eliminar la solicitud
        $equipo = \App\Models\Equipo::find($prestamo->id_equipo);
        if ($equipo) {
            $equipo->estado = 'Disponible';
            $equipo->save();
        }

        $prestamo->delete();
        return response()->json(['message' => 'Préstamo eliminado'], 200);
    }
}