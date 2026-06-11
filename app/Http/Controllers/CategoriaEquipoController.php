<?php

namespace App\Http\Controllers;

use App\Models\CategoriaEquipo;
use Illuminate\Http\Request;

class CategoriaEquipoController extends Controller
{
    public function index()
    {
        return response()->json(CategoriaEquipo::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'required|string|max:50',
        ]);

        $categoria = CategoriaEquipo::create($validated);
        return response()->json($categoria, 201);
    }

    public function show($id)
    {
        $categoria = CategoriaEquipo::find($id);
        if (!$categoria) return response()->json(['message' => 'Categoría no encontrada'], 404);
        return response()->json($categoria, 200);
    }

    public function update(Request $request, $id)
    {
        $categoria = CategoriaEquipo::find($id);
        if (!$categoria) return response()->json(['message' => 'Categoría no encontrada'], 404);

        $categoria->update($request->all());
        return response()->json($categoria, 200);
    }

    public function destroy($id)
    {
        $categoria = CategoriaEquipo::find($id);
        if (!$categoria) return response()->json(['message' => 'Categoría no encontrada'], 404);

        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada'], 200);
    }
}