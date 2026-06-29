<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
DB::statement('ALTER TABLE "Horario_atencion" ADD COLUMN id_estudiante BIGINT NULL REFERENCES "Estudiante"("id_estudiante") ON DELETE SET NULL');
echo "Column added successfully!";
