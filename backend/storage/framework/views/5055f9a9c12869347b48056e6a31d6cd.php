<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>uConnect | Panel de Logs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0f172a;
            --surface: #1e293b;
            --surface2: #263148;
            --border: #334155;
            --accent: #3b82f6;
            --accent-light: rgba(59,130,246,0.15);
            --text: #e2e8f0;
            --muted: #94a3b8;
            --success: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --info: #38bdf8;
            --purple: #a78bfa;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
        }

        /* HEADER */
        .header {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .logo {
            background: var(--accent);
            color: white;
            font-weight: 800;
            font-size: 1.1rem;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-title h1 {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text);
        }

        .header-title p {
            font-size: 0.75rem;
            color: var(--muted);
        }

        .live-badge {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: var(--success);
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .live-dot {
            width: 8px;
            height: 8px;
            background: var(--success);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        /* MAIN CONTENT */
        .container {
            padding: 2rem;
            max-width: 1600px;
            margin: 0 auto;
        }

        /* STATS GRID */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: transform 0.2s, border-color 0.2s;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            border-color: var(--accent);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .icon-blue { background: rgba(59,130,246,0.15); }
        .icon-green { background: rgba(34,197,94,0.15); }
        .icon-yellow { background: rgba(245,158,11,0.15); }
        .icon-purple { background: rgba(167,139,250,0.15); }

        .stat-info h3 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text);
            line-height: 1;
        }

        .stat-info p {
            font-size: 0.8rem;
            color: var(--muted);
            margin-top: 0.25rem;
        }

        /* FILTERS */
        .filters-bar {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.25rem 1.5rem;
            display: flex;
            gap: 1rem;
            align-items: flex-end;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            flex: 1;
            min-width: 160px;
        }

        .filter-group label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .filter-group input,
        .filter-group select {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text);
            padding: 0.6rem 0.9rem;
            font-size: 0.85rem;
            font-family: 'Inter', sans-serif;
            outline: none;
            transition: border-color 0.2s;
        }

        .filter-group input:focus,
        .filter-group select:focus {
            border-color: var(--accent);
        }

        .filter-group select option {
            background: var(--surface);
        }

        .btn-filter {
            background: var(--accent);
            color: white;
            border: none;
            padding: 0.65rem 1.5rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            transition: background 0.2s;
            white-space: nowrap;
        }

        .btn-filter:hover { background: #2563eb; }

        .btn-reset {
            background: transparent;
            color: var(--muted);
            border: 1px solid var(--border);
            padding: 0.65rem 1.2rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .btn-reset:hover { border-color: var(--muted); color: var(--text); }

        /* TABLE */
        .table-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
        }

        .table-header {
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border);
        }

        .table-header h3 {
            font-size: 1rem;
            font-weight: 600;
        }

        .result-count {
            font-size: 0.8rem;
            color: var(--muted);
            background: var(--bg);
            padding: 0.3rem 0.75rem;
            border-radius: 20px;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead tr {
            background: var(--bg);
        }

        th {
            padding: 0.85rem 1rem;
            text-align: left;
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            white-space: nowrap;
        }

        tbody tr {
            border-top: 1px solid var(--border);
            transition: background 0.15s;
        }

        tbody tr:hover {
            background: var(--surface2);
        }

        td {
            padding: 0.85rem 1rem;
            font-size: 0.85rem;
            vertical-align: middle;
        }

        .user-cell {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .user-cell strong {
            color: var(--text);
            font-weight: 600;
        }

        .user-cell small {
            color: var(--muted);
            font-size: 0.75rem;
        }

        /* BADGES DE ACCIÓN */
        .badge {
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .badge-LOGIN    { background: rgba(34,197,94,0.15);  color: #4ade80; }
        .badge-LOGOUT   { background: rgba(100,116,139,0.2); color: #94a3b8; }
        .badge-MENSAJE  { background: rgba(59,130,246,0.15); color: #60a5fa; }
        .badge-PRESTAMO { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .badge-REGISTRO { background: rgba(167,139,250,0.15); color: #c4b5fd; }
        .badge-ERROR    { background: rgba(239,68,68,0.15);  color: #f87171; }
        .badge-DEFAULT  { background: rgba(148,163,184,0.15); color: #94a3b8; }

        /* ROL BADGES */
        .rol-ADMIN      { color: #f87171; }
        .rol-TEACHER    { color: #60a5fa; }
        .rol-PROFESOR   { color: #60a5fa; }
        .rol-STUDENT    { color: #4ade80; }
        .rol-ESTUDIANTE { color: #4ade80; }

        .ip-text {
            font-family: 'Courier New', monospace;
            font-size: 0.78rem;
            color: var(--muted);
        }

        .date-text {
            color: var(--muted);
            font-size: 0.8rem;
            white-space: nowrap;
        }

        .desc-text {
            color: var(--text);
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--muted);
        }

        .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-state h3 { font-size: 1.1rem; color: var(--text); margin-bottom: 0.5rem; }

        /* ACCION CHART */
        .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }

        .breakdown-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }

        .breakdown-card:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
        }

        .breakdown-card .count {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--accent);
        }

        .breakdown-card .label {
            font-size: 0.75rem;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.25rem;
        }

        .section-title {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 0.75rem;
        }
    </style>
</head>
<body>

<header class="header">
    <div class="header-left">
        <div class="logo">u</div>
        <div class="header-title">
            <h1>uConnect · Panel de Logs</h1>
            <p>Registro de actividad del sistema</p>
        </div>
    </div>
    <div class="live-badge">
        <div class="live-dot"></div>
        Sistema Activo
    </div>
</header>

<div class="container">

    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon icon-blue">📋</div>
            <div class="stat-info">
                <h3><?php echo e($totalLogs); ?></h3>
                <p>Total de registros</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon icon-green">📅</div>
            <div class="stat-info">
                <h3><?php echo e($logsHoy); ?></h3>
                <p>Actividad de hoy</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon icon-yellow">👥</div>
            <div class="stat-info">
                <h3><?php echo e($usuariosActivos); ?></h3>
                <p>Usuarios con actividad</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon icon-purple">⚡</div>
            <div class="stat-info">
                <h3><?php echo e($acciones->count()); ?></h3>
                <p>Tipos de acciones</p>
            </div>
        </div>
    </div>

    
    <?php if($acciones->isNotEmpty()): ?>
    <p class="section-title">Desglose por acción</p>
    <div class="breakdown-grid">
        <?php $__currentLoopData = $acciones; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ac): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <a class="breakdown-card" href="<?php echo e(request()->fullUrlWithQuery(['accion' => $ac->accion])); ?>">
            <div class="count"><?php echo e($ac->total); ?></div>
            <div class="label"><?php echo e($ac->accion); ?></div>
        </a>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
    <?php endif; ?>

    
    <form method="GET" action="">
        <div class="filters-bar">
            <div class="filter-group">
                <label>Buscar usuario o descripción</label>
                <input type="text" name="buscar" value="<?php echo e(request('buscar')); ?>" placeholder="Nombre, email, descripción...">
            </div>
            <div class="filter-group" style="max-width: 160px;">
                <label>Acción</label>
                <select name="accion">
                    <option value="">Todas</option>
                    <?php $__currentLoopData = $acciones; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ac): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value="<?php echo e($ac->accion); ?>" <?php if(request('accion') === $ac->accion): echo 'selected'; endif; ?>><?php echo e($ac->accion); ?></option>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </select>
            </div>
            <div class="filter-group" style="max-width: 140px;">
                <label>Rol</label>
                <select name="rol">
                    <option value="">Todos</option>
                    <option value="ADMIN" <?php if(request('rol') === 'ADMIN'): echo 'selected'; endif; ?>>ADMIN</option>
                    <option value="TEACHER" <?php if(request('rol') === 'TEACHER'): echo 'selected'; endif; ?>>TEACHER</option>
                    <option value="STUDENT" <?php if(request('rol') === 'STUDENT'): echo 'selected'; endif; ?>>STUDENT</option>
                </select>
            </div>
            <button type="submit" class="btn-filter">Filtrar</button>
            <a href="<?php echo e(route('admin.logs')); ?>" class="btn-reset">Limpiar</a>
        </div>
    </form>

    
    <div class="table-card">
        <div class="table-header">
            <h3>Registros de actividad</h3>
            <span class="result-count"><?php echo e($logs->count()); ?> resultados</span>
        </div>

        <?php if($logs->isEmpty()): ?>
        <div class="empty-state">
            <div class="icon">🔍</div>
            <h3>No hay registros todavía</h3>
            <p>La actividad aparecerá aquí automáticamente cuando los usuarios realicen acciones en el sistema.</p>
        </div>
        <?php else: ?>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Acción</th>
                        <th>Descripción</th>
                        <th>IP</th>
                        <th>Fecha y Hora</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $__currentLoopData = $logs; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $log): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php
                        $badgeClass = match($log->accion) {
                            'LOGIN'    => 'badge-LOGIN',
                            'LOGOUT'   => 'badge-LOGOUT',
                            'MENSAJE'  => 'badge-MENSAJE',
                            'PRESTAMO' => 'badge-PRESTAMO',
                            'REGISTRO' => 'badge-REGISTRO',
                            'ERROR'    => 'badge-ERROR',
                            default    => 'badge-DEFAULT',
                        };
                        $rolClass = 'rol-' . strtoupper($log->rol ?? '');
                    ?>
                    <tr>
                        <td style="color: var(--muted); font-size: 0.75rem;"><?php echo e($log->id); ?></td>
                        <td>
                            <div class="user-cell">
                                <strong><?php echo e($log->nombre_usuario ?? 'Sistema'); ?></strong>
                                <small><?php echo e($log->correo_usuario ?? '—'); ?></small>
                            </div>
                        </td>
                        <td>
                            <span class="<?php echo e($rolClass); ?>" style="font-size: 0.8rem; font-weight: 600;">
                                <?php echo e($log->rol ?? '—'); ?>

                            </span>
                        </td>
                        <td>
                            <span class="badge <?php echo e($badgeClass); ?>"><?php echo e($log->accion); ?></span>
                        </td>
                        <td>
                            <span class="desc-text" title="<?php echo e($log->descripcion); ?>">
                                <?php echo e($log->descripcion ?? '—'); ?>

                            </span>
                        </td>
                        <td>
                            <span class="ip-text"><?php echo e($log->ip ?? '—'); ?></span>
                        </td>
                        <td>
                            <span class="date-text">
                                <?php echo e(\Carbon\Carbon::parse($log->created_at)->format('d/m/Y H:i:s')); ?>

                            </span>
                        </td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
    </div>

</div>

<script>
    // Auto-refresh every 30 seconds
    setTimeout(() => location.reload(), 30000);
</script>

</body>
</html>
<?php /**PATH C:\Proyectos\uconnect\backend\resources\views/admin/logs.blade.php ENDPATH**/ ?>