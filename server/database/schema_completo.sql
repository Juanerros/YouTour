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

-- Estados de paquete
INSERT INTO paquete_estados (nombre) VALUES
('Creado'),
('Reservado'),
('Pagado'),
('En progreso'),
('Completado'),
('Cancelado');

-- Insertar algunos vuelos de ejemplo
INSERT INTO vuelos (origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo) VALUES
(1, 3, 'LATAM Airlines', 280.00, '1h 15m', 'Boeing 737', '08:30', '09:45', '2023-12-15'),
(1, 9, 'Iberia', 850.00, '12h 30m', 'Airbus A330', '21:15', '13:45', '2023-12-20'),
(5, 11, 'Air France', 750.00, '7h 45m', 'Boeing 777', '18:30', '07:15', '2023-12-18'),
(7, 8, 'Aeroméxico', 180.00, '2h 10m', 'Embraer E190', '10:00', '12:10', '2023-12-22'),
(9, 13, 'Alitalia', 220.00, '2h 30m', 'Airbus A320', '14:45', '17:15', '2023-12-25');

-- Insertar algunos hoteles de ejemplo
INSERT INTO hoteles (nombre, id_ciudad, rating, precio_noche, descripcion, amenidades) VALUES
('Hotel Radisson Montevideo Victoria Plaza', 3, 4.5, 120.00, 'Elegante hotel en el centro de Río de Janeiro', 'WiFi Gratis, Piscina, Spa, Gimnasio'),
('Gran Hotel Madrid', 9, 4.8, 180.00, 'Lujoso hotel en el corazón de Madrid', 'WiFi Gratis, Piscina, Spa, Restaurante, Bar'),
('New York Plaza', 5, 4.2, 220.00, 'Moderno hotel en Manhattan', 'WiFi Gratis, Gimnasio, Restaurante'),
('Cancún Paradise Resort', 8, 4.9, 350.00, 'Resort todo incluido frente al mar', 'WiFi Gratis, Piscinas, Spa, Playa privada, Restaurantes, Bares'),
('Hotel de Paris', 11, 4.7, 280.00, 'Elegante hotel en el centro de París', 'WiFi Gratis, Spa, Restaurante Gourmet');

-- Insertar algunas actividades de ejemplo
INSERT INTO actividades (nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad) VALUES
('City Tour Montevideo', 1, 3, 45.00, '4 horas', 'Recorrido por los principales atractivos de Río de Janeiro: Cristo Redentor, Pan de Azúcar y Copacabana.', 1),
('Paseo en Catamarán', 2, 3, 60.00, '3 horas', 'Navegación por la bahía de Río de Janeiro con vista panorámica de la ciudad.', 1),
('Tour del Bernabéu', 1, 9, 35.00, '2 horas', 'Visita guiada al estadio Santiago Bernabéu, casa del Real Madrid.', 1),
('Tour Gastronómico', 3, 9, 70.00, '4 horas', 'Degustación de tapas y vinos en los mejores bares de Madrid.', 1),
('Tour de Central Park', 1, 5, 25.00, '2 horas', 'Paseo guiado por el famoso parque de Manhattan.', 1),
('Excursión a Chichén Itzá', 4, 8, 120.00, '10 horas', 'Visita a las ruinas mayas de Chichén Itzá, una de las 7 maravillas del mundo moderno.', 2),
('Tour de la Torre Eiffel', 1, 11, 40.00, '2 horas', 'Visita guiada a la Torre Eiffel con acceso prioritario.', 1),
('La Perdiz', 3, 3, 35.00, '2 horas', 'Auténtica parrilla uruguaya con las mejores carnes y ambiente tradicional.', 1);