-- Tablas para el sistema de paquetes turísticos

-- Tabla de paquetes turísticos
CREATE TABLE IF NOT EXISTS paquetes (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_dias INT NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    cantidad_personas INT NOT NULL DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

-- Tabla de relación entre paquetes y vuelos
CREATE TABLE IF NOT EXISTS paquete_vuelos (
    id_paquete_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_vuelo INT NOT NULL,
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id_vuelo)
);

-- Tabla de relación entre paquetes y hoteles
CREATE TABLE IF NOT EXISTS paquete_hoteles (
    id_paquete_hotel INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_hotel INT NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel)
);

-- Tabla de actividades adicionales para paquetes
CREATE TABLE IF NOT EXISTS paquete_actividades (
    id_paquete_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_actividad INT NOT NULL,
    fecha DATE,
    hora TIME,
    incluido_base BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad)
);

-- Tabla de personas en el paquete
CREATE TABLE IF NOT EXISTS paquete_personas (
    id_paquete_persona INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE,
    email VARCHAR(100),
    telefono VARCHAR(20),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE
);

-- Tabla de estado del paquete
CREATE TABLE IF NOT EXISTS paquete_estados (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de seguimiento de estado del paquete
CREATE TABLE IF NOT EXISTS paquete_seguimiento (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_estado INT NOT NULL,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_estado) REFERENCES paquete_estados(id_estado)
);

-- Inserción de estados de paquete
INSERT INTO paquete_estados (nombre) VALUES
('Creado'),
('Reservado'),
('Pagado'),
('En progreso'),
('Completado'),
('Cancelado');