<?php

namespace App\Http\Controllers;

use App\Models\HorarioAtencion;
use App\Models\Profesor;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HorarioAtencionController extends Controller
{
    public function index()
    {
        return response()->json(HorarioAtencion::with(['profesor.usuario', 'estudiante.usuario'])->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_profesor'   => 'required|integer',
            'id_estudiante' => 'nullable|integer',
            'dia_semana'    => 'required|string|max:50',
            'hora_inicio'   => 'required|string',
            'hora_fin'      => 'required|string',
            'modalidad'     => 'required|string|max:100',
            'ubicacion'     => 'nullable|string|max:255',
            'estado'        => 'required|string|max:50',
        ]);

        // El frontend envía id_usuario del profesor; necesitamos resolver el id_profesor real
        $idDesdeRequest = $validated['id_profesor'];

        // Intentar encontrar el Profesor por id_profesor directo
        $profesor = Profesor::find($idDesdeRequest);

        // Si no se encontró, buscar por id_usuario
        if (!$profesor) {
            $profesor = Profesor::where('id_usuario', $idDesdeRequest)->first();
        }

        // Si aún no existe, verificar que el usuario existe y crear el registro Profesor
        if (!$profesor) {
            $usuario = Usuario::find($idDesdeRequest);
            if (!$usuario) {
                return response()->json(['message' => 'El usuario indicado no existe en la BD.'], 422);
            }
            $profesor = Profesor::create([
                'id_usuario'   => $idDesdeRequest,
                'departamento' => 'Sin departamento',
                'titulo'       => null,
                'estado'       => 'Activo',
            ]);
        }

        // Mapear nombre del día a una fecha concreta de la semana en curso
        $diasMap = [
            'Lunes'     => 1, 'Martes'  => 2, 'Miércoles' => 3,
            'Miercoles' => 3, 'Jueves'  => 4, 'Viernes'   => 5,
            'Sábado'    => 6, 'Sabado'  => 6, 'Domingo'   => 0,
        ];
        $diaNombre = $validated['dia_semana'];
        $diaNro = $diasMap[$diaNombre] ?? 1;
        // Calcular la fecha del próximo lunes de la semana actual
        $fechaDia = Carbon::now()->startOfWeek()->addDays($diaNro - 1)->format('Y-m-d');

        $data = [
            'id_profesor'   => $profesor->id_profesor,
            'id_estudiante' => $validated['id_estudiante'] ?? null,
            'dia_semana'    => $fechaDia . ' ' . $validated['hora_inicio'],
            'hora_inicio'   => $validated['hora_inicio'],
            'hora_fin'      => $validated['hora_fin'],
            'modalidad'     => $validated['modalidad'],
            'ubicacion'     => $validated['ubicacion'] ?? null,
            'estado'        => $validated['estado'],
        ];

        $horario = HorarioAtencion::create($data);
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