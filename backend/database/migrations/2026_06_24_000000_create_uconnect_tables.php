<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Table: Usuario
        Schema::create('Usuario', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre');
            $table->string('apellido');
            $table->string('correo')->unique();
            $table->string('contrasena');
            $table->string('rol');
            $table->string('estado')->default('Activo');
            $table->timestamp('fecha_registro')->nullable();
        });

        // 2. Table: Estudiante
        Schema::create('Estudiante', function (Blueprint $table) {
            $table->unsignedBigInteger('id_estudiante')->primary();
            $table->string('matricula')->nullable();
            $table->string('carrera')->nullable();
            $table->integer('semestre')->nullable();
            $table->timestamp('fecha_ingreso')->nullable();
            $table->string('estado')->default('Activo');

            $table->foreign('id_estudiante')->references('id_usuario')->on('Usuario')->onDelete('cascade');
        });

        // 3. Table: Profesor
        Schema::create('Profesor', function (Blueprint $table) {
            $table->unsignedBigInteger('id_profesor')->primary();
            $table->string('departamento')->nullable();
            $table->string('titulo')->nullable();
            $table->string('estado')->default('Activo');

            $table->foreign('id_profesor')->references('id_usuario')->on('Usuario')->onDelete('cascade');
        });

        // 4. Table: Administrador
        Schema::create('Administrador', function (Blueprint $table) {
            $table->unsignedBigInteger('id_administrador')->primary();
            $table->string('cargo')->nullable();
            $table->string('estado')->default('Activo');

            $table->foreign('id_administrador')->references('id_usuario')->on('Usuario')->onDelete('cascade');
        });

        // 5. Table: Horario_atencion
        Schema::create('Horario_atencion', function (Blueprint $table) {
            $table->id('id_horario');
            $table->unsignedBigInteger('id_profesor');
            $table->unsignedBigInteger('id_estudiante')->nullable(); // Para agendamientos
            $table->string('dia_semana');
            $table->string('hora_inicio');
            $table->string('hora_fin');
            $table->string('modalidad');
            $table->string('ubicacion');
            $table->string('estado')->default('Disponible'); // Disponible, Reservado

            $table->foreign('id_profesor')->references('id_profesor')->on('Profesor')->onDelete('cascade');
            $table->foreign('id_estudiante')->references('id_estudiante')->on('Estudiante')->onDelete('set null');
        });

        // 6. Table: Categoria_equipo
        Schema::create('Categoria_equipo', function (Blueprint $table) {
            $table->id('id_categoria');
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('estado')->default('Activo');
        });

        // 7. Table: Equipo
        Schema::create('Equipo', function (Blueprint $table) {
            $table->id('id_equipo');
            $table->unsignedBigInteger('id_categoria')->nullable();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->string('estado')->default('Disponible'); // Disponible, Prestado, Mantenimiento
            $table->string('ubicacion')->nullable();
            $table->timestamp('fecha_alta')->nullable();

            $table->foreign('id_categoria')->references('id_categoria')->on('Categoria_equipo')->onDelete('set null');
        });

        // 8. Table: Prestamo
        Schema::create('Prestamo', function (Blueprint $table) {
            $table->id('id_prestamo');
            $table->unsignedBigInteger('id_estudiante');
            $table->unsignedBigInteger('id_equipo');
            $table->timestamp('fecha_solicitud')->useCurrent();
            $table->timestamp('fecha_prestamo')->nullable();
            $table->timestamp('fecha_devolucion_es')->nullable();
            $table->timestamp('fecha_devolucion_real')->nullable();
            $table->string('estado')->default('Pendiente'); // Pendiente, Aprobado, Rechazado, Devuelto
            $table->text('observaciones')->nullable();

            $table->foreign('id_estudiante')->references('id_estudiante')->on('Estudiante')->onDelete('cascade');
            $table->foreign('id_equipo')->references('id_equipo')->on('Equipo')->onDelete('cascade');
        });

        // 9. Table: Aprobacion_prestamo
        Schema::create('Aprobacion_prestamo', function (Blueprint $table) {
            $table->id('id_aprobacion');
            $table->unsignedBigInteger('id_prestamo');
            $table->unsignedBigInteger('id_admin');
            $table->string('accion'); // Aprobado, Rechazado
            $table->text('comentarios')->nullable();
            $table->timestamp('fecha_accion')->useCurrent();

            $table->foreign('id_prestamo')->references('id_prestamo')->on('Prestamo')->onDelete('cascade');
            $table->foreign('id_admin')->references('id_administrador')->on('Administrador')->onDelete('cascade');
        });

        // 10. Table: Mensaje
        Schema::create('Mensaje', function (Blueprint $table) {
            $table->id('id_mensaje');
            $table->unsignedBigInteger('id_emisor');
            $table->unsignedBigInteger('id_receptor');
            $table->string('asunto')->nullable();
            $table->text('contenido');
            $table->timestamp('fecha_envio')->useCurrent();
            $table->boolean('leido')->default(false);

            $table->foreign('id_emisor')->references('id_usuario')->on('Usuario')->onDelete('cascade');
            $table->foreign('id_receptor')->references('id_usuario')->on('Usuario')->onDelete('cascade');
        });

        // 11. Table: Notificacion
        Schema::create('Notificacion', function (Blueprint $table) {
            $table->id('id_notificacion');
            $table->unsignedBigInteger('id_usuario');
            $table->string('tipo');
            $table->string('titulo');
            $table->text('mensaje');
            $table->timestamp('fecha')->useCurrent();
            $table->boolean('leida')->default(false);

            $table->foreign('id_usuario')->references('id_usuario')->on('Usuario')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Notificacion');
        Schema::dropIfExists('Mensaje');
        Schema::dropIfExists('Aprobacion_prestamo');
        Schema::dropIfExists('Prestamo');
        Schema::dropIfExists('Equipo');
        Schema::dropIfExists('Categoria_equipo');
        Schema::dropIfExists('Horario_atencion');
        Schema::dropIfExists('Administrador');
        Schema::dropIfExists('Profesor');
        Schema::dropIfExists('Estudiante');
        Schema::dropIfExists('Usuario');
    }
};
