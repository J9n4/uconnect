<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use App\Models\Equipo;
use App\Models\CategoriaEquipo;
use App\Models\Estudiante;
use App\Models\Profesor;
use App\Models\Administrador;
use App\Models\HorarioAtencion;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Insertar Categorías de Equipos
        $catLaptops = CategoriaEquipo::create([
            'nombre' => 'Laptops',
            'descripcion' => 'Computadoras portátiles para desarrollo',
            'estado' => 'Activo'
        ]);

        $catProy = CategoriaEquipo::create([
            'nombre' => 'Proyectores',
            'descripcion' => 'Equipos multimedia para presentaciones',
            'estado' => 'Activo'
        ]);

        $catElec = CategoriaEquipo::create([
            'nombre' => 'Electrónica',
            'descripcion' => 'Instrumental y componentes de electrónica',
            'estado' => 'Activo'
        ]);

        // 2. Insertar Equipos de prueba
        Equipo::create([
            'id_categoria' => $catElec->id_categoria,
            'nombre' => 'Osciloscopio Digital',
            'descripcion' => 'Osciloscopio digital de dos canales',
            'estado' => 'Disponible',
            'ubicacion' => 'Laboratorio de Electrónica',
            'fecha_alta' => now()
        ]);

        Equipo::create([
            'id_categoria' => $catElec->id_categoria,
            'nombre' => 'Kit Arduino Mega',
            'descripcion' => 'Kit de robótica y sensores Arduino',
            'estado' => 'Disponible',
            'ubicacion' => 'Laboratorio de Robótica',
            'fecha_alta' => now()
        ]);

        Equipo::create([
            'id_categoria' => $catLaptops->id_categoria,
            'nombre' => 'Notebook HP ProBook',
            'descripcion' => 'Notebook de préstamo para biblioteca. Intel i5 16GB RAM',
            'estado' => 'Disponible',
            'ubicacion' => 'Biblioteca Central',
            'fecha_alta' => now()
        ]);

        // 3. Insertar Usuarios base (Administrador, Profesor, Estudiante)
        // Admin
        $uAdmin = Usuario::create([
            'nombre' => 'Sofía',
            'apellido' => 'Valenzuela',
            'correo' => 'admin@unach.cl',
            'contrasena' => password_hash('admin123', PASSWORD_BCRYPT),
            'rol' => 'ADMIN',
            'estado' => 'Activo',
            'fecha_registro' => now()
        ]);
        Administrador::create([
            'id_administrador' => $uAdmin->id_usuario,
            'cargo' => 'TI & Servicios',
            'estado' => 'Activo'
        ]);

        // Profesor
        $uTeacher = Usuario::create([
            'nombre' => 'Miguel Ángel',
            'apellido' => 'Torres',
            'correo' => 'miguel@profesor.unach.cl',
            'contrasena' => password_hash('user123', PASSWORD_BCRYPT),
            'rol' => 'TEACHER',
            'estado' => 'Activo',
            'fecha_registro' => now()
        ]);
        Profesor::create([
            'id_profesor' => $uTeacher->id_usuario,
            'departamento' => 'Programación Orientada a Objetos',
            'titulo' => 'Doctor en Ciencias de la Computación',
            'estado' => 'Activo'
        ]);

        // Estudiante
        $uStudent = Usuario::create([
            'nombre' => 'Carlos',
            'apellido' => 'Martínez',
            'correo' => 'juan@alumno.unach.cl',
            'contrasena' => password_hash('user123', PASSWORD_BCRYPT),
            'rol' => 'STUDENT',
            'estado' => 'Activo',
            'fecha_registro' => now()
        ]);
        Estudiante::create([
            'id_estudiante' => $uStudent->id_usuario,
            'matricula' => '20240987',
            'carrera' => 'Ingeniería Informática',
            'semestre' => 5,
            'fecha_ingreso' => now(),
            'estado' => 'Activo'
        ]);

        // 4. Insertar Horarios de Atención iniciales (para agendamientos)
        HorarioAtencion::create([
            'id_profesor' => $uTeacher->id_usuario,
            'dia_semana' => 'Lunes',
            'hora_inicio' => '10:00',
            'hora_fin' => '12:00',
            'modalidad' => 'Presencial',
            'ubicacion' => 'Cubículo de Profesores 3',
            'estado' => 'Disponible'
        ]);

        HorarioAtencion::create([
            'id_profesor' => $uTeacher->id_usuario,
            'dia_semana' => 'Miércoles',
            'hora_inicio' => '15:00',
            'hora_fin' => '17:00',
            'modalidad' => 'Online',
            'ubicacion' => 'Google Meet',
            'estado' => 'Disponible'
        ]);
    }
}