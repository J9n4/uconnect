<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ActivityLogController extends Controller
{
    /**
     * Vista HTML del panel de logs (accesible desde el navegador en :8000/admin/logs)
     */
    public function panel(Request $request)
    {
        $query = ActivityLog::orderBy('created_at', 'desc');

        // Filtros opcionales por query string
        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }
        if ($request->filled('buscar')) {
            $search = $request->buscar;
            $query->where(function ($q) use ($search) {
                $q->where('nombre_usuario', 'ilike', "%$search%")
                  ->orWhere('correo_usuario', 'ilike', "%$search%")
                  ->orWhere('descripcion', 'ilike', "%$search%");
            });
        }
        if ($request->filled('rol')) {
            $query->where('rol', $request->rol);
        }

        $logs = $query->limit(500)->get();

        // Estadísticas
        $totalLogs = ActivityLog::count();
        $logsHoy   = ActivityLog::whereDate('created_at', today())->count();
        $acciones  = ActivityLog::select('accion', DB::raw('count(*) as total'))
                        ->groupBy('accion')
                        ->orderByDesc('total')
                        ->get();
        $usuariosActivos = ActivityLog::select('correo_usuario')
                            ->whereNotNull('correo_usuario')
                            ->distinct()
                            ->count();

        return response()
            ->view('admin.logs', compact('logs', 'totalLogs', 'logsHoy', 'acciones', 'usuariosActivos'))
            ->header('Content-Security-Policy', "frame-ancestors *");
    }

    /**
     * API JSON para obtener logs (si se necesita en el futuro)
     */
    public function index(Request $request)
    {
        $logs = ActivityLog::orderBy('created_at', 'desc')->limit(200)->get();
        return response()->json($logs);
    }

    /**
     * Registrar un log manualmente desde otra parte del sistema
     */
    public function store(Request $request)
    {
        $log = ActivityLog::create($request->only([
            'id_usuario', 'accion', 'descripcion', 'ip', 'user_agent',
            'rol', 'nombre_usuario', 'correo_usuario'
        ]));
        return response()->json($log, 201);
    }
}
