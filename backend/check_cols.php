<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$cols = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name = 'Horario_atencion'");
echo json_encode($cols);
