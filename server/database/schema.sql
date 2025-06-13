-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS youtour;
USE youtour;

-- Tabla de continentes
CREATE TABLE IF NOT EXISTS continentes (
    id_continente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de países
CREATE TABLE IF NOT EXISTS paises (
    id_pais INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_continente INT NOT NULL,
    FOREIGN KEY (id_continente) REFERENCES continentes(id_continente)
);

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS ciudades (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_aeropuerto VARCHAR(10),
    id_pais INT NOT NULL,
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais)
);

-- Tabla de vuelos
CREATE TABLE IF NOT EXISTS vuelos (
    id_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    origen INT NOT NULL,
    destino INT NOT NULL,
    aerolinea VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    duracion VARCHAR(20) NOT NULL,
    aeronave VARCHAR(100) NOT NULL,
    salida TIME NOT NULL,
    llegada TIME NOT NULL,
    fecha_vuelo DATE NOT NULL,
    FOREIGN KEY (origen) REFERENCES ciudades(id_ciudad),
    FOREIGN KEY (destino) REFERENCES ciudades(id_ciudad)
);

-- Tabla de hoteles
CREATE TABLE IF NOT EXISTS hoteles (
    id_hotel INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_ciudad INT NOT NULL,
    rating DECIMAL(3, 1) NOT NULL,
    precio_noche DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    amenidades TEXT,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);

-- Tabla de tipos de actividades
CREATE TABLE IF NOT EXISTS tipos_actividad (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de niveles de dificultad
CREATE TABLE IF NOT EXISTS niveles_dificultad (
    id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_tipo INT NOT NULL,
    id_ciudad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    duracion VARCHAR(50) NOT NULL,
    descripcion TEXT,
    id_dificultad INT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipos_actividad(id_tipo),
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad),
    FOREIGN KEY (id_dificultad) REFERENCES niveles_dificultad(id_nivel)
);

-- Inserción de datos de ejemplo
-- Continentes
INSERT INTO continentes (nombre) VALUES 
('América'), 
('Europa'), 
('Asia');

-- Países
INSERT INTO paises (nombre, id_continente) VALUES
('Argentina', 1),
('Brasil', 1),
('Estados Unidos', 1),
('México', 1),
('España', 2),
('Francia', 2),
('Italia', 2),
('Alemania', 2),
('Japón', 3),
('China', 3),
('India', 3),
('Tailandia', 3);

-- Ciudades
INSERT INTO ciudades (nombre, codigo_aeropuerto, id_pais) VALUES
('Buenos Aires', 'EZE', 1),
('Córdoba', 'COR', 1),
('Río de Janeiro', 'GIG', 2),
('São Paulo', 'GRU', 2),
('Nueva York', 'JFK', 3),
('Los Ángeles', 'LAX', 3),
('Ciudad de México', 'MEX', 4),
('Cancún', 'CUN', 4),
('Madrid', 'MAD', 5),
('Barcelona', 'BCN', 5),
('París', 'CDG', 6),
('Niza', 'NCE', 6),
('Roma', 'FCO', 7),
('Venecia', 'VCE', 7),
('Berlín', 'BER', 8),
('Múnich', 'MUC', 8),
('Tokio', 'HND', 9),
('Osaka', 'KIX', 9),
('Pekín', 'PEK', 10),
('Shanghái', 'PVG', 10),
('Nueva Delhi', 'DEL', 11),
('Mumbai', 'BOM', 11),
('Bangkok', 'BKK', 12),
('Phuket', 'HKT', 12);

-- Tipos de actividad
INSERT INTO tipos_actividad (nombre) VALUES
('Tour Guiado'),
('Aventura'),
('Gastronómico'),
('Cultural'),
('Relajación');

-- Niveles de dificultad
INSERT INTO niveles_dificultad (nombre) VALUES
('Fácil'),
('Moderado'),
('Difícil'),
('Extremo');