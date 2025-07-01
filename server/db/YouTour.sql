
--
-- Table structure for table `actividades`
--

DROP TABLE IF EXISTS `actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades` (
  `id_actividad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('Tour Guiado','Aventura','Gastronómico','Cultural','Relajación') NOT NULL,
  `id_ciudad` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` varchar(50) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_actividad`),
  KEY `id_ciudad` (`id_ciudad`),
  CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades`
--

LOCK TABLES `actividades` WRITE;
/*!40000 ALTER TABLE `actividades` DISABLE KEYS */;
INSERT INTO `actividades` VALUES (1,'City Tour Montevideo','Tour Guiado',3,45.00,'4 horas','Recorrido por los principales atractivos de Río de Janeiro: Cristo Redentor, Pan de Azúcar y Copacabana.'),(2,'Paseo en Catamarán','Aventura',3,60.00,'3 horas','Navegación por la bahía de Río de Janeiro con vista panorámica de la ciudad.'),(3,'Tour del Bernabéu','Tour Guiado',9,35.00,'2 horas','Visita guiada al estadio Santiago Bernabéu, casa del Real Madrid.'),(4,'Tour Gastronómico','Gastronómico',9,70.00,'4 horas','Degustación de tapas y vinos en los mejores bares de Madrid.'),(5,'Tour de Central Park','Tour Guiado',5,25.00,'2 horas','Paseo guiado por el famoso parque de Manhattan.'),(6,'Excursión a Chichén Itzá','Cultural',8,120.00,'10 horas','Visita a las ruinas mayas de Chichén Itzá, una de las 7 maravillas del mundo moderno.'),(7,'Tour de la Torre Eiffel','Tour Guiado',11,40.00,'2 horas','Visita guiada a la Torre Eiffel con acceso prioritario.'),(8,'La Perdiz','Gastronómico',3,35.00,'2 horas','Auténtica parrilla uruguaya con las mejores carnes y ambiente tradicional.'),(9,'asd','Cultural',1,123.00,'02:00:00','hola');
/*!40000 ALTER TABLE `actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `amenidades`
--

DROP TABLE IF EXISTS `amenidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenidades` (
  `id_amenidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_amenidad`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenidades`
--

LOCK TABLES `amenidades` WRITE;
/*!40000 ALTER TABLE `amenidades` DISABLE KEYS */;
INSERT INTO `amenidades` VALUES (1,'WiFi','Acceso a internet inalámbrico'),(2,'Piscina','Piscina disponible para huéspedes'),(3,'Bar','Bar en el hotel'),(4,'Restaurante','Restaurante en el hotel'),(5,'Gimnasio','Gimnasio equipado'),(6,'Spa','Servicios de spa y masajes'),(7,'Estacionamiento','Estacionamiento para huéspedes'),(8,'Aire acondicionado','Habitaciones con aire acondicionado'),(9,'Desayuno incluido','Desayuno buffet incluido'),(10,'Servicio a la habitación','Servicio de comida a la habitación');
/*!40000 ALTER TABLE `amenidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id_carrito` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_paquete` int NOT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Activo','Procesando','Completado','Cancelado') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`id_carrito`),
  UNIQUE KEY `unique_user_active_cart` (`id_user`,`estado`),
  KEY `id_paquete` (`id_paquete`),
  CONSTRAINT `carritos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  CONSTRAINT `carritos_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (7,2,1,'2025-06-15 21:58:25','Completado'),(8,24,1,'2025-06-15 22:01:39','Completado'),(9,26,4,'2025-06-15 22:19:41','Activo'),(10,27,4,'2025-06-15 22:23:13','Activo');
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudades` (
  `id_ciudad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `codigo_aeropuerto` varchar(10) DEFAULT NULL,
  `id_pais` int NOT NULL,
  PRIMARY KEY (`id_ciudad`),
  KEY `id_pais` (`id_pais`),
  CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`id_pais`) REFERENCES `paises` (`id_pais`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudades`
--

LOCK TABLES `ciudades` WRITE;
/*!40000 ALTER TABLE `ciudades` DISABLE KEYS */;
INSERT INTO `ciudades` VALUES (1,'Buenos Aires','EZE',1),(2,'Córdoba','COR',1),(3,'Río de Janeiro','GIG',2),(4,'São Paulo','GRU',2),(5,'Nueva York','JFK',3),(6,'Los Ángeles','LAX',3),(7,'Ciudad de México','MEX',4),(8,'Cancún','CUN',4),(9,'Madrid','MAD',5),(10,'Barcelona','BCN',5),(11,'París','CDG',6),(12,'Niza','NCE',6),(13,'Roma','FCO',7),(14,'Venecia','VCE',7),(15,'Berlín','BER',8),(16,'Múnich','MUC',8),(17,'Tokio','HND',9),(18,'Osaka','KIX',9),(19,'Pekín','PEK',10),(20,'Shanghái','PVG',10),(21,'Nueva Delhi','DEL',11),(22,'Mumbai','BOM',11),(23,'Bangkok','BKK',12),(24,'Phuket','HKT',12);
/*!40000 ALTER TABLE `ciudades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `continentes`
--

DROP TABLE IF EXISTS `continentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `continentes` (
  `id_continente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_continente`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `continentes`
--

LOCK TABLES `continentes` WRITE;
/*!40000 ALTER TABLE `continentes` DISABLE KEYS */;
INSERT INTO `continentes` VALUES (1,'América'),(2,'Europa'),(3,'Asia'),(4,'Oceania'),(6,'Antartida'),(12,'Suramérica');
/*!40000 ALTER TABLE `continentes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_amenidades`
--

DROP TABLE IF EXISTS `hotel_amenidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_amenidades` (
  `id_hotel` int NOT NULL,
  `id_amenidad` int NOT NULL,
  PRIMARY KEY (`id_hotel`,`id_amenidad`),
  KEY `id_amenidad` (`id_amenidad`),
  CONSTRAINT `hotel_amenidades_ibfk_1` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`),
  CONSTRAINT `hotel_amenidades_ibfk_2` FOREIGN KEY (`id_amenidad`) REFERENCES `amenidades` (`id_amenidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_amenidades`
--

LOCK TABLES `hotel_amenidades` WRITE;
/*!40000 ALTER TABLE `hotel_amenidades` DISABLE KEYS */;
INSERT INTO `hotel_amenidades` VALUES (6,1),(7,1),(6,2),(7,2);
/*!40000 ALTER TABLE `hotel_amenidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoteles`
--

DROP TABLE IF EXISTS `hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoteles` (
  `id_hotel` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_ciudad` int NOT NULL,
  `rating` decimal(3,1) NOT NULL,
  `precio_noche` decimal(10,2) NOT NULL,
  `descripcion` text,
  `ubicacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_hotel`),
  KEY `id_ciudad` (`id_ciudad`),
  CONSTRAINT `hoteles_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoteles`
--

LOCK TABLES `hoteles` WRITE;
/*!40000 ALTER TABLE `hoteles` DISABLE KEYS */;
INSERT INTO `hoteles` VALUES (1,'Hotel Radisson Montevideo Victoria Plaza',3,4.5,120.00,'Elegante hotel en el centro de Río de Janeiro',NULL),(2,'Gran Hotel Madrid',9,4.8,180.00,'Lujoso hotel en el corazón de Madrid',NULL),(3,'New York Plaza',5,4.2,220.00,'Moderno hotel en Manhattan',NULL),(4,'Cancún Paradise Resort',8,4.9,350.00,'Resort todo incluido frente al mar',NULL),(5,'Hotel de Paris',11,4.7,280.00,'Elegante hotel en el centro de París',NULL),(6,'prueba',3,2.0,2.00,'asd prueba','asd'),(7,'asd',3,2.0,2.00,'asd','asd');
/*!40000 ALTER TABLE `hoteles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id_login` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `failed_attempts` int NOT NULL DEFAULT '0',
  `lock_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_login`),
  UNIQUE KEY `email` (`email`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `login_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (2,2,'botonera@gmail.com','$2b$12$yNBWqhOjZFZazmCxHkbHW.8CAL3hsQulA5Ut5V45YPIFU8fFm3mZy',0,0,NULL,'2025-06-13 00:33:42','2025-06-13 00:38:12'),(13,15,'youtour.no.reply@gmail.com','$2b$12$rUVxtLIKmoMW0MraSjREHOU8XF4umrJRIe3wIhqNwFf.aVx/injCS',1,0,NULL,'2025-06-13 15:49:44','2025-06-13 15:52:39'),(14,20,'juan@gmail.com','$2b$12$85DfQBFJm0jxso45HSaK1OOQLoNXHO6doUBMyNgzbPHaxMlEAV4c6',0,0,NULL,'2025-06-15 15:09:22','2025-06-15 15:09:22'),(15,24,'papudel8@gmail.com','$2b$12$3/beTRIF6Rf0vRVNfSd/rug907NLjBLLQGKHpoXvSRo5HhDGEPc/W',0,0,NULL,'2025-06-15 20:49:30','2025-06-15 20:49:30'),(16,25,'santi.ante@hotmail.com.ar','$2b$12$WkmOX.WJyzcMVaD462KLpu.PYbzpp.DrPHlLcuA1bUOQpzd7f69nq',0,0,NULL,'2025-06-15 21:29:16','2025-06-15 21:29:16'),(17,26,'juangottier0@gmail.com','$2b$12$obI7P669mKQEaWlo65kPVeRb/juAJtFhiqHp29lmJhN0mW7tZkhXe',0,0,NULL,'2025-06-15 22:17:45','2025-06-15 22:17:45'),(18,27,'juancottier0@gmail.com','$2b$12$U0lFeXz1Myzg9HWYON/Yxe0QSRWNJpn2FZQdX1VcFHXmz.9nf54Cq',0,0,NULL,'2025-06-15 22:21:10','2025-06-15 22:21:10');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paises`
--

DROP TABLE IF EXISTS `paises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paises` (
  `id_pais` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_continente` int NOT NULL,
  PRIMARY KEY (`id_pais`),
  KEY `id_continente` (`id_continente`),
  CONSTRAINT `paises_ibfk_1` FOREIGN KEY (`id_continente`) REFERENCES `continentes` (`id_continente`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paises`
--

LOCK TABLES `paises` WRITE;
/*!40000 ALTER TABLE `paises` DISABLE KEYS */;
INSERT INTO `paises` VALUES (1,'Argentina',1),(2,'Brasil',1),(3,'Estados Unidos',1),(4,'México',1),(5,'España',2),(6,'Francia',2),(7,'Italia',2),(8,'Alemania',2),(9,'Japón',3),(10,'China',3),(11,'India',3),(12,'Tailandia',3);
/*!40000 ALTER TABLE `paises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquete_actividades`
--

DROP TABLE IF EXISTS `paquete_actividades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquete_actividades` (
  `id_paquete_actividad` int NOT NULL AUTO_INCREMENT,
  `id_paquete` int NOT NULL,
  `id_actividad` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `incluido_base` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_paquete_actividad`),
  KEY `id_paquete` (`id_paquete`),
  KEY `id_actividad` (`id_actividad`),
  CONSTRAINT `paquete_actividades_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE,
  CONSTRAINT `paquete_actividades_ibfk_2` FOREIGN KEY (`id_actividad`) REFERENCES `actividades` (`id_actividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquete_actividades`
--

LOCK TABLES `paquete_actividades` WRITE;
/*!40000 ALTER TABLE `paquete_actividades` DISABLE KEYS */;
/*!40000 ALTER TABLE `paquete_actividades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquete_hoteles`
--

DROP TABLE IF EXISTS `paquete_hoteles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquete_hoteles` (
  `id_paquete_hotel` int NOT NULL AUTO_INCREMENT,
  `id_paquete` int NOT NULL,
  `id_hotel` int NOT NULL,
  `fecha_entrada` date NOT NULL,
  `fecha_salida` date NOT NULL,
  PRIMARY KEY (`id_paquete_hotel`),
  KEY `id_paquete` (`id_paquete`),
  KEY `id_hotel` (`id_hotel`),
  CONSTRAINT `paquete_hoteles_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE,
  CONSTRAINT `paquete_hoteles_ibfk_2` FOREIGN KEY (`id_hotel`) REFERENCES `hoteles` (`id_hotel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquete_hoteles`
--

LOCK TABLES `paquete_hoteles` WRITE;
/*!40000 ALTER TABLE `paquete_hoteles` DISABLE KEYS */;
/*!40000 ALTER TABLE `paquete_hoteles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquete_personas`
--

DROP TABLE IF EXISTS `paquete_personas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquete_personas` (
  `id_paquete_persona` int NOT NULL AUTO_INCREMENT,
  `id_paquete` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_paquete_persona`),
  KEY `id_paquete` (`id_paquete`),
  CONSTRAINT `paquete_personas_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquete_personas`
--

LOCK TABLES `paquete_personas` WRITE;
/*!40000 ALTER TABLE `paquete_personas` DISABLE KEYS */;
/*!40000 ALTER TABLE `paquete_personas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquete_vuelos`
--

DROP TABLE IF EXISTS `paquete_vuelos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquete_vuelos` (
  `id_paquete_vuelo` int NOT NULL AUTO_INCREMENT,
  `id_paquete` int NOT NULL,
  `id_vuelo` int NOT NULL,
  PRIMARY KEY (`id_paquete_vuelo`),
  KEY `id_paquete` (`id_paquete`),
  KEY `id_vuelo` (`id_vuelo`),
  CONSTRAINT `paquete_vuelos_ibfk_1` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`) ON DELETE CASCADE,
  CONSTRAINT `paquete_vuelos_ibfk_2` FOREIGN KEY (`id_vuelo`) REFERENCES `vuelos` (`id_vuelo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquete_vuelos`
--

LOCK TABLES `paquete_vuelos` WRITE;
/*!40000 ALTER TABLE `paquete_vuelos` DISABLE KEYS */;
/*!40000 ALTER TABLE `paquete_vuelos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paquetes`
--

DROP TABLE IF EXISTS `paquetes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paquetes` (
  `id_paquete` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `duracion_dias` int NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `cantidad_personas` int NOT NULL DEFAULT '1',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('Creado','Reservado','Pagado','En progreso','Completado','Cancelado') NOT NULL DEFAULT 'Creado',
  PRIMARY KEY (`id_paquete`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paquetes`
--

LOCK TABLES `paquetes` WRITE;
/*!40000 ALTER TABLE `paquetes` DISABLE KEYS */;
INSERT INTO `paquetes` VALUES (1,'Tour Buenos Aires','Tour completo por la ciudad',5,25000.00,10,'2025-06-15 17:34:18','2024-03-20','2024-03-25','Creado'),(4,'Tour Buenos Aires','Tour completo por la ciudad',5,25000.00,10,'2025-06-15 21:58:25','2024-03-20','2024-03-25','Creado');
/*!40000 ALTER TABLE `paquetes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_paquete` int NOT NULL,
  `fecha_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Pendiente','Confirmado','En Proceso','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_user` (`id_user`),
  KEY `id_paquete` (`id_paquete`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquetes` (`id_paquete`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (9,2,1,'2025-06-15 22:09:58','Completado',25000.00,'uala');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Juan','58222111','1234567890','2025-06-13 00:33:42','2025-06-13 00:33:42'),(15,'Admin Ventas','12345678','1234567890','2025-06-13 15:49:44','2025-06-13 15:49:44'),(20,'Juan Cottier','87654321','1212121212','2025-06-15 15:09:21','2025-06-15 15:09:21'),(24,'Ezequiel','12345671','1234567896','2025-06-15 20:49:29','2025-06-15 20:49:29'),(25,'Santino Antelo','47678109','1123663800','2025-06-15 21:29:15','2025-06-15 21:29:15'),(26,'Juan Cottier','12345677','1234567892','2025-06-15 22:17:45','2025-06-15 22:17:45'),(27,'Juan Cottier','11131222','1234432111','2025-06-15 22:21:10','2025-06-15 22:21:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `fecha_venta` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `comision` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vuelos`
--

DROP TABLE IF EXISTS `vuelos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vuelos` (
  `id_vuelo` int NOT NULL AUTO_INCREMENT,
  `origen` int NOT NULL,
  `destino` int NOT NULL,
  `aerolinea` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` varchar(20) NOT NULL,
  `aeronave` varchar(100) NOT NULL,
  `salida` datetime NOT NULL,
  `llegada` datetime NOT NULL,
  `fecha_vuelo` date NOT NULL,
  PRIMARY KEY (`id_vuelo`),
  KEY `origen` (`origen`),
  KEY `destino` (`destino`),
  CONSTRAINT `vuelos_ibfk_1` FOREIGN KEY (`origen`) REFERENCES `ciudades` (`id_ciudad`),
  CONSTRAINT `vuelos_ibfk_2` FOREIGN KEY (`destino`) REFERENCES `ciudades` (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vuelos`
--

LOCK TABLES `vuelos` WRITE;
/*!40000 ALTER TABLE `vuelos` DISABLE KEYS */;
INSERT INTO `vuelos` VALUES (1,1,3,'LATAM Airlines',280.00,'1h 15m','Boeing 737','2025-06-14 08:30:00','2025-06-14 09:45:00','2023-12-15'),(2,1,9,'Iberia',850.00,'12h 30m','Airbus A330','2025-06-14 21:15:00','2025-06-14 13:45:00','2023-12-20'),(3,5,11,'Air France',750.00,'7h 45m','Boeing 777','2025-06-14 18:30:00','2025-06-14 07:15:00','2023-12-18'),(4,7,8,'Aeroméxico',180.00,'2h 10m','Embraer E190','2025-06-14 10:00:00','2025-06-14 12:10:00','2023-12-22'),(5,9,13,'Alitalia',220.00,'2h 30m','Airbus A320','2025-06-14 14:45:00','2025-06-14 17:15:00','2023-12-25'),(6,1,3,'Aerolíneas Argentinas',123.00,'34.00','Boeing 737','2025-06-16 10:00:00','2025-06-17 20:00:00','2025-06-16');
/*!40000 ALTER TABLE `vuelos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 20:27:47
