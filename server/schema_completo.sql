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

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('Tour Guiado', 'Aventura', 'Gastronómico', 'Cultural', 'Relajación') NOT NULL,
    id_ciudad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    duracion VARCHAR(50) NOT NULL,
    descripcion TEXT,
    nivel_dificultad ENUM('Fácil', 'Moderado', 'Difícil', 'Extremo') NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);

-- Tabla de paquetes turísticos
CREATE TABLE IF NOT EXISTS paquetes (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    id_vuelo INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_dias INT NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    cantidad_personas INT NOT NULL DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('Creado', 'Reservado', 'Pagado', 'En progreso', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Creado'
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
INSERT INTO actividades (nombre, tipo, id_ciudad, precio, duracion, descripcion, nivel_dificultad) VALUES
('City Tour Montevideo', 'Tour Guiado', 3, 45.00, '4 horas', 'Recorrido por los principales atractivos de Río de Janeiro: Cristo Redentor, Pan de Azúcar y Copacabana.', 'Fácil'),
('Paseo en Catamarán', 'Aventura', 3, 60.00, '3 horas', 'Navegación por la bahía de Río de Janeiro con vista panorámica de la ciudad.', 'Fácil'),
('Tour del Bernabéu', 'Tour Guiado', 9, 35.00, '2 horas', 'Visita guiada al estadio Santiago Bernabéu, casa del Real Madrid.', 'Fácil'),
('Tour Gastronómico', 'Gastronómico', 9, 70.00, '4 horas', 'Degustación de tapas y vinos en los mejores bares de Madrid.', 'Fácil'),
('Tour de Central Park', 'Tour Guiado', 5, 25.00, '2 horas', 'Paseo guiado por el famoso parque de Manhattan.', 'Fácil'),
('Excursión a Chichén Itzá', 'Cultural', 8, 120.00, '10 horas', 'Visita a las ruinas mayas de Chichén Itzá, una de las 7 maravillas del mundo moderno.', 'Moderado'),
('Tour de la Torre Eiffel', 'Tour Guiado', 11, 40.00, '2 horas', 'Visita guiada a la Torre Eiffel con acceso prioritario.', 'Fácil'),
('La Perdiz', 'Gastronómico', 3, 35.00, '2 horas', 'Auténtica parrilla uruguaya con las mejores carnes y ambiente tradicional.', 'Fácil');


-- Tabla de carrito de compras
CREATE TABLE IF NOT EXISTS carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_paquete INT NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo', 'Procesando', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Activo',
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete),
    UNIQUE KEY unique_user_active_cart (id_user, estado)
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_paquete INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'Confirmado', 'En Proceso', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete)
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    comision DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

/*

Table: users
Columns:
id_user int AI PK 
name varchar(100) 
dni varchar(20) 
phone varchar(20) 
created_at timestamp 
updated_at timestamp

Table: paquetes
id_paquete int AI PK 
nombre varchar(100) 
descripcion text 
duracion_dias int 
precio_base decimal(10,2) 
cantidad_personas int 
fecha_creacion datetime 
fecha_inicio date 
fecha_fin date 
estado enum('Creado','Reservado','Pagado','En progreso','Completado','Cancelado')

*/

-- Insertar un paquete de ejemplo
INSERT INTO paquetes (
    nombre, 
    descripcion, 
    duracion_dias,
    precio_base,
    cantidad_personas,
    fecha_inicio,
    fecha_fin,
    estado
) 
VALUES (
    'Tour Buenos Aires',
    'Tour completo por la ciudad',
    5,
    25000.00,
    10,
    '2024-03-20',
    '2024-03-25',
    'Creado'
);

-- Insertar un carrito activo
INSERT INTO carritos (id_user, id_paquete, estado) 
VALUES (2, 1, 'Activo');

-- Insertar un pedido
INSERT INTO pedidos (id_user, id_paquete, estado, total, metodo_pago) 
VALUES (2, 1, 'Pendiente', 25000, 'Mercado Pago');

-- Insertar una venta
INSERT INTO ventas (id_pedido, total, comision, metodo_pago) 
VALUES (1, 25000, 1250, 'Mercado Pago');

-- Insertar otro pedido completado
INSERT INTO pedidos (id_user, id_paquete, estado, total, metodo_pago) 
VALUES (2, 1, 'Completado', 30000, 'Ualá');

-- Insertar venta para el pedido completado
INSERT INTO ventas (id_pedido, total, comision, metodo_pago) 
VALUES (2, 30000, 1500, 'Ualá');