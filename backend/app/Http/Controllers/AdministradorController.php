<?php

namespace App\Http\Controllers;

use App\Models\Administrador;
use Illuminate\Http\Request;

class AdministradorController extends Controller
{
    public function index()
    {
        return response()->json(Administrador::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_administrador' => 'required|integer',
            'cargo' => 'required|string|max:255',
            'estado' => 'required|string|max:50',
        ]);

        $administrador = Administrador::create($validated);
        return response()->json($administrador, 201);
    }

    public function show($id)
    {
        $administrador = Administrador::find($id);
        if (!$administrador) return response()->json(['message' => 'Administrador no encontrado'], 404);
        return response()->json($administrador, 200);
    }

    public function update(Request $request, $id)
    {
        $administrador = Administrador::find($id);
        if (!$administrador) return response()->json(['message' => 'Administrador no encontrado'], 404);

        $administrador->update($request->all());
        return response()->json($administrador, 200);
    }

    public function destroy($id)
    {
        $administrador = Administrador::find($id);
        if (!$administrador) return response()->json(['message' => 'Administrador no encontrado'], 404);

        $administrador->delete();
        return response()->json(['message' => 'Administrador eliminado'], 200);
    }
}