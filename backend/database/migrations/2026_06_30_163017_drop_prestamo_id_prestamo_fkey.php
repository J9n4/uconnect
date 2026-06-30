<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // La constraint Prestamo_id_prestamo_fkey impide insertar préstamos sin una aprobación previa.
        // Esto no corresponde al flujo de la aplicación, por lo que se elimina.
        DB::statement('ALTER TABLE "Prestamo" DROP CONSTRAINT IF EXISTS "Prestamo_id_prestamo_fkey"');
    }

    public function down(): void
    {
        // Restaurar la constraint si se hace rollback
        DB::statement('ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_id_prestamo_fkey" FOREIGN KEY (id_prestamo) REFERENCES aprobacion_prestamo(id_aprobacion)');
    }
};
