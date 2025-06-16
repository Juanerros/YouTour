import './style.css'
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Datos ficticios para simular la respuesta de la API
const datosCarritosFicticios = [
  {
    id_carrito: 14,
    id_user: 27,
    id_paquete: 1,
    fecha_creacion: '2025-06-15 23:51:58',
    estado: 'Procesando',
    nombre: 'Paquete a París',
    precio_base: 1200.50,
    duracion_dias: 7,
    fecha_inicio: '2025-07-10',
    fecha_fin: '2025-07-17'
  },
  {
    id_carrito: 20,
    id_user: 15,
    id_paquete: 4,
    fecha_creacion: '2025-06-16 13:32:56',
    estado: 'Procesando',
    nombre: 'Tour por Madrid',
    precio_base: 950.75,
    duracion_dias: 5,
    fecha_inicio: '2025-08-05',
    fecha_fin: '2025-08-10'
  },
  {
    id_carrito: 21,
    id_user: 15,
    id_paquete: 5,
    fecha_creacion: '2025-06-16 13:34:32',
    estado: 'Procesando',
    nombre: 'Aventura en Cancún',
    precio_base: 1500.00,
    duracion_dias: 10,
    fecha_inicio: '2025-09-15',
    fecha_fin: '2025-09-25'
  },
  {
    id_carrito: 24,
    id_user: 2,
    id_paquete: 1,
    fecha_creacion: '2025-06-16 16:02:47',
    estado: 'Procesando',
    nombre: 'Escapada a Roma',
    precio_base: 1100.25,
    duracion_dias: 6,
    fecha_inicio: '2025-10-10',
    fecha_fin: '2025-10-16'
  },
  {
    id_carrito: 15,
    id_user: 15,
    id_paquete: 1,
    fecha_creacion: '2025-06-15 23:56:26',
    estado: 'Cancelado',
    nombre: 'Viaje a Nueva York',
    precio_base: 1800.00,
    duracion_dias: 8,
    fecha_inicio: '2025-08-20',
    fecha_fin: '2025-08-28'
  },
  {
    id_carrito: 22,
    id_user: 30,
    id_paquete: 8,
    fecha_creacion: '2025-06-16 15:43:19',
    estado: 'Activo',
    nombre: 'Tour por Tokio',
    precio_base: 2200.50,
    duracion_dias: 12,
    fecha_inicio: '2025-11-05',
    fecha_fin: '2025-11-17'
  },
  {
    id_carrito: 23,
    id_user: 25,
    id_paquete: 4,
    fecha_creacion: '2025-06-16 15:49:23',
    estado: 'Activo',
    nombre: 'Aventura en los Alpes',
    precio_base: 1350.75,
    duracion_dias: 9,
    fecha_inicio: '2025-12-10',
    fecha_fin: '2025-12-19'
  }
];

const OrdersManagement = () => {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los carritos (usando datos ficticios)
  const cargarCarritos = async () => {
    try {
      setLoading(true);
      // Simulamos un pequeño retraso para imitar la llamada a la API
      setTimeout(() => {
        // Filtrar solo los carritos en estado "Procesando"
        const carritosEnProceso = datosCarritosFicticios.filter(cart => cart.estado === 'Procesando');
        setCarritos(carritosEnProceso);
        setError(null);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error al cargar carritos:', err);
      setError('Error al cargar los carritos. Por favor, intente nuevamente.');
      setCarritos([]);
      setLoading(false);
    }
  };

  // Actualizar el estado del carrito
  const actualizarEstadoCarrito = async (idCarrito, nuevoEstado) => {
    try {
      // Simulamos la actualización del estado sin llamar a la API
      setTimeout(() => {
        // Actualizamos el estado localmente
        const carritosActualizados = datosCarritosFicticios.map(cart => {
          if (cart.id_carrito === idCarrito) {
            return { ...cart, estado: nuevoEstado };
          }
          return cart;
        });
        
        // Actualizamos los datos ficticios
        Object.assign(datosCarritosFicticios, carritosActualizados);
        
        toast.success(`Carrito ${idCarrito} actualizado a estado: ${nuevoEstado}`);
        // Recargar la lista de carritos
        cargarCarritos();
      }, 500);
    } catch (err) {
      console.error('Error al actualizar el carrito:', err);
      toast.error(`Error al actualizar el carrito: ${err.message}`);
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cargar carritos al montar el componente
  useEffect(() => {
    cargarCarritos();
  }, []);

  return (
    <div className="orders-management">
      <h1>Gestión de Carritos</h1>
      
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Cargando carritos...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : carritos.length === 0 ? (
        <div className="empty-container">
          <p>No hay carritos en estado "Procesando".</p>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla-pedidos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Paquete</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carritos.map((carrito) => (
                <tr key={carrito.id_carrito}>
                  <td>{carrito.id_carrito}</td>
                  <td>{carrito.id_user}</td>
                  <td>{carrito.nombre || carrito.id_paquete}</td>
                  <td>{formatearFecha(carrito.fecha_creacion)}</td>
                  <td>
                    <span className="estado-badge estado-proceso">
                      {carrito.estado}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-container">
                      <button 
                        className="btn-completar"
                        onClick={() => actualizarEstadoCarrito(carrito.id_carrito, 'Completado')}
                        title="Marcar como completado"
                      >
                        <FaCheck /> Completar
                      </button>
                      <button 
                        className="btn-cancelar"
                        onClick={() => actualizarEstadoCarrito(carrito.id_carrito, 'Cancelado')}
                        title="Cancelar carrito"
                      >
                        <FaTimes /> Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;