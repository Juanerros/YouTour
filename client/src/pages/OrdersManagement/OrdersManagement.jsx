import './style.css'
import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrdersManagement = () => {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los carritos en estado "Procesando"
  const cargarCarritos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart/admin/all');
      // Filtrar solo los carritos en estado "Procesando"
      const carritosEnProceso = response.data.carts.filter(cart => cart.estado === 'Procesando');
      setCarritos(carritosEnProceso);
      setError(null);
    } catch (err) {
      console.error('Error al cargar carritos:', err);
      setError('Error al cargar los carritos. Por favor, intente nuevamente.');
      setCarritos([]);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el estado del carrito
  const actualizarEstadoCarrito = async (idCarrito, nuevoEstado) => {
    try {
      await axios.put(`/api/cart/${idCarrito}/status`, { estado: nuevoEstado });
      toast.success(`Carrito ${idCarrito} actualizado a estado: ${nuevoEstado}`);
      // Recargar la lista de carritos
      cargarCarritos();
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