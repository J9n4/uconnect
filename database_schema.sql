-- Base de datos para Uconnect

CREATE DATABASE IF NOT EXISTS uconnect_db;
USE uconnect_db;

-- 1. Table: Usuario
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL,
    estado VARCHAR(255) DEFAULT 'Activo',
    fecha_registro TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Estudiante
CREATE TABLE IF NOT EXISTS Estudiante (
    id_estudiante BIGINT PRIMARY KEY,
    matricula VARCHAR(255) NULL,
    carrera VARCHAR(255) NULL,
    semestre INT NULL,
    fecha_ingreso TIMESTAMP NULL,
    estado VARCHAR(255) DEFAULT 'Activo',
    FOREIGN KEY (id_estudiante) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- 3. Table: Profesor
CREATE TABLE IF NOT EXISTS Profesor (
    id_profesor BIGINT PRIMARY KEY,
    departamento VARCHAR(255) NULL,
    titulo VARCHAR(255) NULL,
    estado VARCHAR(255) DEFAULT 'Activo',
    FOREIGN KEY (id_profesor) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- 4. Table: Administrador
CREATE TABLE IF NOT EXISTS Administrador (
    id_administrador BIGINT PRIMARY KEY,
    cargo VARCHAR(255) NULL,
    estado VARCHAR(255) DEFAULT 'Activo',
    FOREIGN KEY (id_administrador) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- 5. Table: Horario_atencion
CREATE TABLE IF NOT EXISTS Horario_atencion (
    id_horario BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_profesor BIGINT NOT NULL,
    id_estudiante BIGINT NULL,
    dia_semana VARCHAR(255) NOT NULL,
    hora_inicio VARCHAR(255) NOT NULL,
    hora_fin VARCHAR(255) NOT NULL,
    modalidad VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    estado VARCHAR(255) DEFAULT 'Disponible',
    FOREIGN KEY (id_profesor) REFERENCES Profesor(id_profesor) ON DELETE CASCADE,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante(id_estudiante) ON DELETE SET NULL
);

-- 6. Table: Categoria_equipo
CREATE TABLE IF NOT EXISTS Categoria_equipo (
    id_categoria BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    estado VARCHAR(255) DEFAULT 'Activo'
);

-- 7. Table: Equipo
CREATE TABLE IF NOT EXISTS Equipo (
    id_equipo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_categoria BIGINT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    estado VARCHAR(255) DEFAULT 'Disponible',
    ubicacion VARCHAR(255) NULL,
    fecha_alta TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES Categoria_equipo(id_categoria) ON DELETE SET NULL
);

-- 8. Table: Prestamo
CREATE TABLE IF NOT EXISTS Prestamo (
    id_prestamo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante BIGINT NOT NULL,
    id_equipo BIGINT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_prestamo TIMESTAMP NULL,
    fecha_devolucion_es TIMESTAMP NULL,
    fecha_devolucion_real TIMESTAMP NULL,
    estado VARCHAR(255) DEFAULT 'Pendiente',
    observaciones TEXT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante(id_estudiante) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo) ON DELETE CASCADE
);

-- 9. Table: Aprobacion_prestamo
CREATE TABLE IF NOT EXISTS Aprobacion_prestamo (
    id_aprobacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_prestamo BIGINT NOT NULL,
    id_admin BIGINT NOT NULL,
    accion VARCHAR(255) NOT NULL,
    comentarios TEXT NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_prestamo) REFERENCES Prestamo(id_prestamo) ON DELETE CASCADE,
    FOREIGN KEY (id_admin) REFERENCES Administrador(id_administrador) ON DELETE CASCADE
);

-- 10. Table: Mensaje
CREATE TABLE IF NOT EXISTS Mensaje (
    id_mensaje BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_emisor BIGINT NOT NULL,
    id_receptor BIGINT NOT NULL,
    asunto VARCHAR(255) NULL,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_emisor) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_receptor) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);

-- 11. Table: Notificacion
CREATE TABLE IF NOT EXISTS Notificacion (
    id_notificacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    tipo VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);


-- ==========================================
-- ================= INSERTS ================
-- ==========================================

-- Usuarios (contraseña es: 123456 encriptada con bcrypt)
-- Para testing en phpMyAdmin y la app, debes crear la contraseña con un hash bcrypt, 
-- aquí usaré el hash de "user123" y "admin123" sacado de tu seeder.

INSERT INTO Usuario (id_usuario, nombre, apellido, correo, contrasena, rol, estado, fecha_registro) VALUES 
(1, 'Sofía', 'Valenzuela', 'admin@unach.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Activo', NOW()),
(2, 'Miguel Ángel', 'Torres', 'miguel@profesor.unach.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TEACHER', 'Activo', NOW()),
(3, 'Carlos', 'Martínez', 'juan@alumno.unach.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STUDENT', 'Activo', NOW());
-- Nota: La contraseña para todos es 'password' por defecto en los hashes genéricos, pero si prefieres usa tus contraseñas y te funcionarán.

-- Administrador
INSERT INTO Administrador (id_administrador, cargo, estado) VALUES 
(1, 'TI & Servicios', 'Activo');

-- Profesor
INSERT INTO Profesor (id_profesor, departamento, titulo, estado) VALUES 
(2, 'Programación Orientada a Objetos', 'Doctor en Ciencias de la Computación', 'Activo');

-- Estudiante
INSERT INTO Estudiante (id_estudiante, matricula, carrera, semestre, fecha_ingreso, estado) VALUES 
(3, '20240987', 'Ingeniería Informática', 5, NOW(), 'Activo');

-- Categorías Equipos
INSERT INTO Categoria_equipo (id_categoria, nombre, descripcion, estado) VALUES 
(1, 'Laptops', 'Computadoras portátiles para desarrollo', 'Activo'),
(2, 'Proyectores', 'Equipos multimedia para presentaciones', 'Activo'),
(3, 'Electrónica', 'Instrumental y componentes de electrónica', 'Activo');

-- Equipos
INSERT INTO Equipo (id_equipo, id_categoria, nombre, descripcion, estado, ubicacion, fecha_alta) VALUES 
(1, 3, 'Osciloscopio Digital', 'Osciloscopio digital de dos canales', 'Disponible', 'Laboratorio de Electrónica', NOW()),
(2, 3, 'Kit Arduino Mega', 'Kit de robótica y sensores Arduino', 'Disponible', 'Laboratorio de Robótica', NOW()),
(3, 1, 'Notebook HP ProBook', 'Notebook de préstamo para biblioteca. Intel i5 16GB RAM', 'Disponible', 'Biblioteca Central', NOW());

-- Horarios de Atención
INSERT INTO Horario_atencion (id_profesor, dia_semana, hora_inicio, hora_fin, modalidad, ubicacion, estado) VALUES 
(2, 'Lunes', '10:00', '12:00', 'Presencial', 'Cubículo de Profesores 3', 'Disponible'),
(2, 'Miércoles', '15:00', '17:00', 'Online', 'Google Meet', 'Disponible');
