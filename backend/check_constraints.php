<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$result = DB::select("
    SELECT 
        c.conname AS constraint_name,
        c.contype AS constraint_type,
        a.attname AS column_name,
        f.relname AS references_table,
        fa.attname AS references_column
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
    LEFT JOIN pg_class f ON f.oid = c.confrelid
    LEFT JOIN pg_attribute fa ON fa.attnum = ANY(c.confkey) AND fa.attrelid = c.confrelid
    WHERE c.conrelid = '\"Prestamo\"'::regclass
    ORDER BY c.contype
");

echo json_encode($result, JSON_PRETTY_PRINT);
