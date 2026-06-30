<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Profesor;
use App\Models\Estudiante;
use App\Models\Administrador;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $query = Usuario::query();
        if ($request->has('roles')) {
            $roles = array_map('strtoupper', explode(',', $request->query('roles')));
            $query->whereIn(\Illuminate\Support\Facades\DB::raw('UPPER(rol)'), $roles);
        } elseif ($request->has('rol')) {
            $query->where(\Illuminate\Support\Facades\DB::raw('UPPER(rol)'), strtoupper($request->query('rol')));
        }
        return response()->json($query->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'correo' => 'required|string|email|max:255|unique:Usuario,correo',
            'contrasena' => 'required|string|min:6',
            'rol' => 'required|string|max:50',
            'estado' => 'required|string|max:50',
            'fecha_registro' => 'nullable|date',
            // Campos opcionales para el perfil de rol
            'departamento' => 'nullable|string|max:255',
            'titulo' => 'nullable|string|max:255',
            'cargo' => 'nullable|string|max:255',
            'matricula' => 'nullable|string|max:255',
            'carrera' => 'nullable|string|max:255',
        ]);

        $validated['contrasena'] = password_hash($validated['contrasena'], PASSWORD_BCRYPT);

        // Extraer campos específicos de rol antes de crear el usuario
        $rolCampos = ['departamento', 'titulo', 'cargo', 'matricula', 'carrera'];
        $rolData = array_intersect_key($validated, array_flip($rolCampos));
        $usuarioData = array_diff_key($validated, array_flip($rolCampos));

        $usuario = Usuario::create($usuarioData);

        // Crear el registro en la tabla del rol correspondiente
        $rolNorm = strtoupper($usuario->rol);
        if ($rolNorm === 'TEACHER') {
            Profesor::create([
                'id_profesor' => $usuario->id_usuario,
                'departamento' => $rolData['departamento'] ?? 'Sin departamento',
                'titulo' => $rolData['titulo'] ?? null,
                'estado' => $usuario->estado ?? 'Activo',
            ]);
        } elseif ($rolNorm === 'STUDENT') {
            Estudiante::create([
                'id_estudiante' => $usuario->id_usuario,
                'matricula' => $rolData['matricula'] ?? null,
                'carrera' => $rolData['carrera'] ?? null,
                'estado' => $usuario->estado ?? 'Activo',
            ]);
        } elseif ($rolNorm === 'ADMIN') {
            Administrador::create([
                'id_administrador' => $usuario->id_usuario,
                'cargo' => $rolData['cargo'] ?? 'Sin cargo',
                'estado' => $usuario->estado ?? 'Activo',
            ]);
        }

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);
        return response()->json($usuario, 200);
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $data = $request->all();
        if (isset($data['contrasena']) && !empty($data['contrasena'])) {
            $data['contrasena'] = password_hash($data['contrasena'], PASSWORD_BCRYPT);
        }

        $usuario->update($data);
        return response()->json($usuario, 200);
    }

    public function destroy($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) return response()->json(['message' => 'Usuario no encontrado'], 404);

        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado'], 200);
    }
}