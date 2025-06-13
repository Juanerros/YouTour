# YouTour

<p align="center">
  <img src="./client/public/img/youTourLogo.png" alt="Logo de YouTour" width="200"/>
</p>

## 📋 Sobre el Proyecto

YouTour es una aplicación web de comercio electrónico escalable para paquetes turísticos. La plataforma permite a los usuarios registrados explorar y comprar paquetes de viaje que incluyen transporte de ida y vuelta, alojamiento con desayuno y servicios adicionales como atracciones pagas y alquiler de automóviles.

### Arquitectura
- **Frontend:** React + Vite
  - React Router DOM (navegación)
  - React Icons (iconografía)
  - React Toastify (notificaciones)
  - Axios (peticiones HTTP)

- **Backend:** Node.js + Express
  - JWT (autenticación)
  - Bcrypt (cifrado de contraseñas)
  - MySQL2 (conexión a base de datos)
  - Cors (seguridad de API)
  - Dotenv (variables de entorno)

- **Base de Datos:** MySQL

### Distribución de Tareas
El proyecto está dividido en dos equipos principales:

**Equipo E-commerce:**
- Frontend: Antelo Santino
  - Desarrollo de interfaz de usuario
  - Implementación de carrito de compras
  - Integración con APIs de pago
- Backend: Cottier Juan Francisco
  - Desarrollo de API REST
  - Gestión de base de datos
  - Integración de servicios

**Equipo Administrador:**
- Frontend: Enrriquez Ezequiel
  - Panel de administración
  - Dashboards y reportes
  - Gestión de CRUD
- Backend: Gonzalez Thiago
  - API de administración
  - Seguridad y autenticación
  - Gestión de base de datos

## 🔐 Seguridad

La aplicación implementa múltiples capas de seguridad:

- **Autenticación:**
  - JWT (JSON Web Tokens) para manejo de sesiones
  - Tokens de acceso y renovación
  - Almacenamiento seguro de contraseñas con Bcrypt

- **Protección de Datos:**
  - Validación de entrada para prevenir SQL Injection
  - Sanitización de datos
  - CORS configurado para endpoints específicos
  - Variables de entorno para datos sensibles

## 💻 Flujo de Compra

1. **Registro/Login de Usuario**
   - Autenticación segura con JWT
   - Validación de datos

2. **Exploración de Paquetes**
   - Catálogo filtrable
   - Detalles completos de paquetes

3. **Proceso de Compra**
   - Añadir paquete al carrito
   - Selección de cantidad de personas
   - Personalización de servicios adicionales
   - Checkout seguro con MercadoPago/Uala

## ⚙️ Panel Administrativo

Gestión completa CRUD para:
- Vuelos
- Paquetes
- Destinos
- Usuarios
- Servicios adicionales

## ✍️ Autores

Este proyecto fue desarrollado como parte del curso de Tecnicatura en Programación en E.E.S.T N°1.

