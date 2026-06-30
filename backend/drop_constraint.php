<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
DB::statement('ALTER TABLE "Mensaje" DROP CONSTRAINT IF EXISTS "Mensaje_id_mensaje_fkey"');
echo "Done\n";
