-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-06-2025 a las 23:56:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `portal_turistico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id_actividad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('Tour Guiado','Aventura','Gastronómico','Cultural','Relajación') NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id_actividad`, `nombre`, `tipo`, `id_ciudad`, `precio`, `duracion`, `descripcion`) VALUES
(1, 'City Tour Montevideo', 'Tour Guiado', 3, 45.00, '4 horas', 'Recorrido por los principales atractivos de Río de Janeiro: Cristo Redentor, Pan de Azúcar y Copacabana.'),
(2, 'Paseo en Catamarán', 'Aventura', 3, 60.00, '3 horas', 'Navegación por la bahía de Río de Janeiro con vista panorámica de la ciudad.'),
(3, 'Tour del Bernabéu', 'Tour Guiado', 9, 35.00, '2 horas', 'Visita guiada al estadio Santiago Bernabéu, casa del Real Madrid.'),
(4, 'Tour Gastronómico', 'Gastronómico', 9, 70.00, '4 horas', 'Degustación de tapas y vinos en los mejores bares de Madrid.'),
(5, 'Tour de Central Park', 'Tour Guiado', 5, 25.00, '2 horas', 'Paseo guiado por el famoso parque de Manhattan.'),
(6, 'Excursión a Chichén Itzá', 'Cultural', 8, 120.00, '10 horas', 'Visita a las ruinas mayas de Chichén Itzá, una de las 7 maravillas del mundo moderno.'),
(7, 'Tour de la Torre Eiffel', 'Tour Guiado', 11, 40.00, '2 horas', 'Visita guiada a la Torre Eiffel con acceso prioritario.'),
(8, 'La Perdiz', 'Gastronómico', 3, 35.00, '2 horas', 'Auténtica parrilla uruguaya con las mejores carnes y ambiente tradicional.'),
(9, 'asd', 'Cultural', 1, 123.00, '02:00:00', 'hola');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amenidades`
--

CREATE TABLE `amenidades` (
  `id_amenidad` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `amenidades`
--

INSERT INTO `amenidades` (`id_amenidad`, `nombre`, `descripcion`) VALUES
(1, 'WiFi', 'Acceso a internet inalámbrico'),
(2, 'Piscina', 'Piscina disponible para huéspedes'),
(3, 'Bar', 'Bar en el hotel'),
(4, 'Restaurante', 'Restaurante en el hotel'),
(5, 'Gimnasio', 'Gimnasio equipado'),
(6, 'Spa', 'Servicios de spa y masajes'),
(7, 'Estacionamiento', 'Estacionamiento para huéspedes'),
(8, 'Aire acondicionado', 'Habitaciones con aire acondicionado'),
(9, 'Desayuno incluido', 'Desayuno buffet incluido'),
(10, 'Servicio a la habitación', 'Servicio de comida a la habitación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carritos`
--

CREATE TABLE `carritos` (
  `id_carrito` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `estado` enum('Activo','Procesando','Completado','Cancelado') NOT NULL DEFAULT 'Activo',
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `carritos`
--

INSERT INTO `carritos` (`id_carrito`, `id_user`, `id_paquete`, `estado`, `total`) VALUES
(7, 2, 1, 'Completado', 25000.00),
(8, 24, 1, 'Completado', 30000.00),
(9, 26, 4, 'Cancelado', 225239.00),
(10, 27, 1, 'Completado', 20000.00),
(11, 15, 1, 'Cancelado', 25000.00),
(14, 26, 4, 'Activo', 400000.00),
(16, 26, 1, 'Procesando', 2510000.00),
(17, 15, 1, 'Procesando', 25000.00),
(18, 15, 1, 'Activo', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo_aeropuerto` varchar(10) DEFAULT NULL,
  `id_pais` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `nombre`, `codigo_aeropuerto`, `id_pais`) VALUES
(1, 'Buenos Aires', 'EZE', 1),
(2, 'Córdoba', 'COR', 1),
(3, 'Río de Janeiro', 'GIG', 2),
(4, 'São Paulo', 'GRU', 2),
(5, 'Nueva York', 'JFK', 3),
(6, 'Los Ángeles', 'LAX', 3),
(7, 'Ciudad de México', 'MEX', 4),
(8, 'Cancún', 'CUN', 4),
(9, 'Madrid', 'MAD', 5),
(10, 'Barcelona', 'BCN', 5),
(11, 'París', 'CDG', 6),
(12, 'Niza', 'NCE', 6),
(13, 'Roma', 'FCO', 7),
(14, 'Venecia', 'VCE', 7),
(15, 'Berlín', 'BER', 8),
(16, 'Múnich', 'MUC', 8),
(17, 'Tokio', 'HND', 9),
(18, 'Osaka', 'KIX', 9),
(19, 'Pekín', 'PEK', 10),
(20, 'Shanghái', 'PVG', 10),
(21, 'Nueva Delhi', 'DEL', 11),
(22, 'Mumbai', 'BOM', 11),
(23, 'Bangkok', 'BKK', 12),
(24, 'Phuket', 'HKT', 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `continentes`
--

CREATE TABLE `continentes` (
  `id_continente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `continentes`
--

INSERT INTO `continentes` (`id_continente`, `nombre`) VALUES
(1, 'América'),
(2, 'Europa'),
(3, 'Asia'),
(4, 'Oceania'),
(6, 'Antartida'),
(12, 'Suramérica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hoteles`
--

CREATE TABLE `hoteles` (
  `id_hotel` int(11) NOT NULL,
  `id_ciudad` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `precio_noche` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `hoteles`
--

INSERT INTO `hoteles` (`id_hotel`, `id_ciudad`, `nombre`, `rating`, `precio_noche`, `descripcion`) VALUES
(1, 1, 'Mega Hotel', 0.9, 10000.00, 'El mega hotel mas famoso'),
(7, 7, 'Hotel Berreta', 1.2, 1000.00, 'Casi el mejor hotel');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hotel_amenidades`
--

CREATE TABLE `hotel_amenidades` (
  `id_hotel` int(11) NOT NULL,
  `id_amenidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `hotel_amenidades`
--

INSERT INTO `hotel_amenidades` (`id_hotel`, `id_amenidad`) VALUES
(1, 1),
(1, 2),
(7, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE `login` (
  `id_login` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `failed_attempts` int(11) NOT NULL DEFAULT 0,
  `lock_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`id_login`, `id_user`, `email`, `pass`, `isAdmin`, `failed_attempts`, `lock_until`, `created_at`, `updated_at`) VALUES
(2, 2, 'botonera@gmail.com', '$2b$12$yNBWqhOjZFZazmCxHkbHW.8CAL3hsQulA5Ut5V45YPIFU8fFm3mZy', 0, 0, NULL, '2025-06-13 03:33:42', '2025-06-13 03:38:12'),
(13, 15, 'youtour.no.reply@gmail.com', '$2b$12$rUVxtLIKmoMW0MraSjREHOU8XF4umrJRIe3wIhqNwFf.aVx/injCS', 1, 0, NULL, '2025-06-13 18:49:44', '2025-06-13 18:52:39'),
(14, 20, 'juan@gmail.com', '$2b$12$85DfQBFJm0jxso45HSaK1OOQLoNXHO6doUBMyNgzbPHaxMlEAV4c6', 0, 0, NULL, '2025-06-15 18:09:22', '2025-06-15 18:09:22'),
(15, 24, 'papudel8@gmail.com', '$2b$12$3/beTRIF6Rf0vRVNfSd/rug907NLjBLLQGKHpoXvSRo5HhDGEPc/W', 0, 0, NULL, '2025-06-15 23:49:30', '2025-06-15 23:49:30'),
(16, 25, 'santi.ante@hotmail.com.ar', '$2b$12$WkmOX.WJyzcMVaD462KLpu.PYbzpp.DrPHlLcuA1bUOQpzd7f69nq', 0, 0, NULL, '2025-06-16 00:29:16', '2025-06-16 00:29:16'),
(17, 26, 'juangottier0@gmail.com', '$2b$12$obI7P669mKQEaWlo65kPVeRb/juAJtFhiqHp29lmJhN0mW7tZkhXe', 0, 0, NULL, '2025-06-16 01:17:45', '2025-06-26 17:23:32'),
(18, 27, 'juancottier0@gmail.com', '$2b$12$U0lFeXz1Myzg9HWYON/Yxe0QSRWNJpn2FZQdX1VcFHXmz.9nf54Cq', 0, 0, NULL, '2025-06-16 01:21:10', '2025-06-16 01:21:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paises`
--

CREATE TABLE `paises` (
  `id_pais` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_continente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paises`
--

INSERT INTO `paises` (`id_pais`, `nombre`, `id_continente`) VALUES
(1, 'Argentina', 1),
(2, 'Brasil', 1),
(3, 'Estados Unidos', 1),
(4, 'México', 1),
(5, 'España', 2),
(6, 'Francia', 2),
(7, 'Italia', 2),
(8, 'Alemania', 2),
(9, 'Japón', 3),
(10, 'China', 3),
(11, 'India', 3),
(12, 'Tailandia', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquetes`
--

CREATE TABLE `paquetes` (
  `id_paquete` int(11) NOT NULL,
  `id_vuelo` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion_dias` int(11) NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `cantidad_personas` int(11) NOT NULL DEFAULT 1,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Creado','Reservado','Pagado','En progreso','Completado','Cancelado') NOT NULL DEFAULT 'Creado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paquetes`
--

INSERT INTO `paquetes` (`id_paquete`, `id_vuelo`, `nombre`, `descripcion`, `duracion_dias`, `precio_base`, `cantidad_personas`, `fecha_creacion`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(1, 1, 'Tour Buenos Aires', 'Tour completo por la ciudad', 5, 25000.00, 10, '2025-06-15 17:34:18', '2024-03-20', '2024-03-25', 'Creado'),
(4, 6, 'Tour Buenos Aires', 'Tour completo por la ciudad', 5, 25000.00, 10, '2025-06-15 21:58:25', '2024-03-20', '2024-03-25', 'Creado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete_actividades`
--

CREATE TABLE `paquete_actividades` (
  `id_paquete_actividad` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `incluido_base` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paquete_actividades`
--

INSERT INTO `paquete_actividades` (`id_paquete_actividad`, `id_paquete`, `id_actividad`, `fecha`, `hora`, `incluido_base`) VALUES
(1, 1, 4, '2025-06-19', '17:29:01', 0),
(2, 1, 5, '2025-06-28', '17:29:47', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete_hoteles`
--

CREATE TABLE `paquete_hoteles` (
  `id_paquete_hotel` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `id_hotel` int(11) NOT NULL,
  `fecha_entrada` date NOT NULL,
  `fecha_salida` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `paquete_hoteles`
--

INSERT INTO `paquete_hoteles` (`id_paquete_hotel`, `id_paquete`, `id_hotel`, `fecha_entrada`, `fecha_salida`) VALUES
(1, 1, 1, '2025-06-19', '2025-06-20'),
(2, 4, 7, '2025-06-20', '2025-06-27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_paquete` int(11) DEFAULT NULL,
  `icono` varchar(30) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio` double(10,2) NOT NULL DEFAULT 1.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_paquete`, `icono`, `nombre`, `precio`) VALUES
(1, 1, 'car', 'Estacionamiento 24hrs', 10000.00),
(2, 1, 'heart', 'Seguro de viajero', 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `name`, `dni`, `phone`, `created_at`, `updated_at`) VALUES
(2, 'Juan', '58222111', '1234567890', '2025-06-13 03:33:42', '2025-06-13 03:33:42'),
(15, 'Admin Ventas', '12345678', '1234567890', '2025-06-13 18:49:44', '2025-06-13 18:49:44'),
(20, 'Juan Cottier', '87654321', '1212121212', '2025-06-15 18:09:21', '2025-06-15 18:09:21'),
(24, 'Ezequiel', '12345671', '1234567896', '2025-06-15 23:49:29', '2025-06-15 23:49:29'),
(25, 'Santino Antelo', '47678109', '1123663800', '2025-06-16 00:29:15', '2025-06-16 00:29:15'),
(26, 'Juan Cottier', '12345677', '1234567892', '2025-06-16 01:17:45', '2025-06-16 01:17:45'),
(27, 'Juan Cottier', '11131222', '1234432111', '2025-06-16 01:21:10', '2025-06-16 01:21:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_carrito` int(11) NOT NULL,
  `fecha_venta` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_carrito`, `fecha_venta`, `total`, `metodo_pago`) VALUES
(9, 8, '2025-06-24 15:57:45', 200000.00, 'Mercado Pago'),
(10, 7, '2025-06-26 14:16:09', 25000.00, ''),
(11, 14, '2025-06-26 21:46:16', 225000.00, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelos`
--

CREATE TABLE `vuelos` (
  `id_vuelo` int(11) NOT NULL,
  `origen` int(11) NOT NULL,
  `destino` int(11) NOT NULL,
  `aerolinea` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` varchar(20) NOT NULL,
  `aeronave` varchar(100) NOT NULL,
  `salida` datetime NOT NULL,
  `llegada` datetime NOT NULL,
  `fecha_vuelo` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `vuelos`
--

INSERT INTO `vuelos` (`id_vuelo`, `origen`, `destino`, `aerolinea`, `precio`, `duracion`, `aeronave`, `salida`, `llegada`, `fecha_vuelo`) VALUES
(1, 1, 3, 'LATAM Airlines', 280.00, '1h 15m', 'Boeing 737', '2025-06-14 08:30:00', '2025-06-14 09:45:00', '2023-12-15'),
(2, 1, 9, 'Iberia', 850.00, '12h 30m', 'Airbus A330', '2025-06-14 21:15:00', '2025-06-14 13:45:00', '2023-12-20'),
(3, 5, 11, 'Air France', 750.00, '7h 45m', 'Boeing 777', '2025-06-14 18:30:00', '2025-06-14 07:15:00', '2023-12-18'),
(4, 7, 8, 'Aeroméxico', 180.00, '2h 10m', 'Embraer E190', '2025-06-14 10:00:00', '2025-06-14 12:10:00', '2023-12-22'),
(5, 9, 13, 'Alitalia', 220.00, '2h 30m', 'Airbus A320', '2025-06-14 14:45:00', '2025-06-14 17:15:00', '2023-12-25'),
(6, 1, 3, 'Aerolíneas Argentinas', 123.00, '34.00', 'Boeing 737', '2025-06-16 10:00:00', '2025-06-17 20:00:00', '2025-06-16');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `amenidades`
--
ALTER TABLE `amenidades`
  ADD PRIMARY KEY (`id_amenidad`);

--
-- Indices de la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_paquete` (`id_paquete`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD KEY `id_pais` (`id_pais`);

--
-- Indices de la tabla `continentes`
--
ALTER TABLE `continentes`
  ADD PRIMARY KEY (`id_continente`);

--
-- Indices de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  ADD PRIMARY KEY (`id_hotel`),
  ADD KEY `fk_hoteles_ciudades` (`id_ciudad`);

--
-- Indices de la tabla `hotel_amenidades`
--
ALTER TABLE `hotel_amenidades`
  ADD PRIMARY KEY (`id_hotel`,`id_amenidad`),
  ADD KEY `id_amenidad` (`id_amenidad`);

--
-- Indices de la tabla `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id_login`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id_pais`),
  ADD KEY `id_continente` (`id_continente`);

--
-- Indices de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  ADD PRIMARY KEY (`id_paquete`),
  ADD KEY `fk_paquetes_vuelos` (`id_vuelo`);

--
-- Indices de la tabla `paquete_actividades`
--
ALTER TABLE `paquete_actividades`
  ADD PRIMARY KEY (`id_paquete_actividad`),
  ADD KEY `id_paquete` (`id_paquete`),
  ADD KEY `id_actividad` (`id_actividad`);

--
-- Indices de la tabla `paquete_hoteles`
--
ALTER TABLE `paquete_hoteles`
  ADD PRIMARY KEY (`id_paquete_hotel`),
  ADD KEY `id_paquete` (`id_paquete`),
  ADD KEY `id_hotel` (`id_hotel`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `id_paquete` (`id_paquete`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_pedido` (`id_carrito`);

--
-- Indices de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD PRIMARY KEY (`id_vuelo`),
  ADD KEY `origen` (`origen`),
  ADD KEY `destino` (`destino`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `amenidades`
--
ALTER TABLE `amenidades`
  MODIFY `id_amenidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `carritos`
--
ALTER TABLE `carritos`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `continentes`
--
ALTER TABLE `continentes`
  MODIFY `id_continente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  MODIFY `id_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `login`
--
ALTER TABLE `login`
  MODIFY `id_login` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `paises`
--
ALTER TABLE `paises`
  MODIFY `id_pais` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `paquetes`
--
ALTER TABLE `paquetes`
  MODIFY `id_paquete` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `paquete_actividades`
--
ALTER TABLE `paquete_actividades`
  MODIFY `id_paquete_actividad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `paquete_hoteles`
--
ALTER TABLE `paquete_hoteles`
  MODIFY `id_paquete_hotel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `vuelos`
--
ALTER TABLE `vuelos`
  MODIFY `id_vuelo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`);

--
-- Filtros para la tabla `carritos`
--
ALTER TABLE `carritos`
  ADD CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `carritos_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`);

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`id_pais`) REFERENCES `paises` (`id_pais`);

--
-- Filtros para la tabla `hoteles`
--
ALTER TABLE `hoteles`
  ADD CONSTRAINT `fk_hoteles_ciudades` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `hotel_amenidades`
--
ALTER TABLE `hotel_amenidades`
  ADD CONSTRAINT `hotel_amenidades_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`),
  ADD CONSTRAINT `hotel_amenidades_ibfk_2` FOREIGN KEY (`id_amenidad`) REFERENCES `amenidades` (`id_amenidad`);

--
-- Filtros para la tabla `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `paises`
--
ALTER TABLE `paises`
  ADD CONSTRAINT `paises_ibfk_1` FOREIGN KEY (`id_continente`) REFERENCES `continentes` (`id_continente`);

--
-- Filtros para la tabla `paquetes`
--
ALTER TABLE `paquetes`
  ADD CONSTRAINT `fk_paquetes_vuelos` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id_vuelo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `paquete_actividades`
--
ALTER TABLE `paquete_actividades`
  ADD CONSTRAINT `paquete_actividades_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE,
  ADD CONSTRAINT `paquete_actividades_ibfk_2` FOREIGN KEY (`id_actividad`) REFERENCES `actividades` (`id_actividad`);

--
-- Filtros para la tabla `paquete_hoteles`
--
ALTER TABLE `paquete_hoteles`
  ADD CONSTRAINT `paquete_hoteles_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE,
  ADD CONSTRAINT `paquete_hoteles_ibfk_2` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`);

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id_carrito`);

--
-- Filtros para la tabla `vuelos`
--
ALTER TABLE `vuelos`
  ADD CONSTRAINT `vuelos_ibfk_1` FOREIGN KEY (`origen`) REFERENCES `ciudades` (`id_ciudad`),
  ADD CONSTRAINT `vuelos_ibfk_2` FOREIGN KEY (`destino`) REFERENCES `ciudades` (`id_ciudad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
