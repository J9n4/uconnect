<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Equipo;
use App\Models\CategoriaEquipo;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Insertar Categorías de Equipos
        CategoriaEquipo::create([
            'nombre' => 'Laptops',
            'descripcion' => 'Computadoras portátiles para desarrollo',
            'estado' => 'Activo'
        ]);

        CategoriaEquipo::create([
            'nombre' => 'Proyectores',
            'descripcion' => 'Equipos multimedia para presentaciones',
            'estado' => 'Activo'
        ]);

        // 2. Insertar Equipos de prueba
        Equipo::create([
            'nombre' => 'Laptop HP ProBook G9',
            'descripcion' => 'Core i7, 16GB RAM, 512GB SSD',
            'estado' => 'Disponible',
            'ubicacion' => 'Laboratorio de Cómputo 1',
            'fecha_alta' => now()
        ]);

        Equipo::create([
            'nombre' => 'Proyector Epson PowerLite',
            'descripcion' => 'Proyector FullHD 4000 lúmenes',
            'estado' => 'En mantenimiento',
            'ubicacion' => 'Almacén Central',
            'fecha_alta' => now()
        ]);

        // 3. Insertar Usuarios base (Administrador)
        Usuario::create([
            'nombre' => 'Carlos',
            'apellido' => 'Mendoza',
            'correo' => 'admin@uconnect.com',
            'contrasena' => password_hash('admin123', PASSWORD_BCRYPT),
            'rol' => 'Administrador',
            'estado' => 'Activo',
            'fecha_registro' => now()
        ]);
    }
}