import './style.css'
import axios from '../../../../api/axios';
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import useNotification from '../../../../hooks/useNotification';

const OrdersManagement = () => {
  const { notify } = useNotification();
  const [carritosProc, setCarritosProc] = useState([]);
  // Demas carritos que no están en estado "Procesando"
  const [carritosOtros, setCarritosOtros] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarVentas = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/admin/ventas/all');
      if (response.status == 200) {
        const ventasData = response.data.sales;
        setVentas(ventasData);
      }
    } catch (err) {
      notify(err.response.data.message || 'Error al obtener los pedidos', 'error');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los carritos
  const cargarCarritos = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/admin/all');
      if (response.status == 200) {
        const carritos = response.data.carts;
        const carritosEnProceso = carritos.filter(cart => cart.estado === 'Procesando');
        const carritosOtros = carritos.filter(cart => cart.estado !== 'Procesando');

        setCarritosOtros(carritosOtros);
        setCarritosProc(carritosEnProceso);
      }
    } catch (err) {
      notify(err.response.data.message || 'Error al obtener los pedidos', 'error');
      setCarritosProc([]);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el estado del carrito
  const actualizarEstadoCarrito = async (idCarrito, nuevoEstado) => {
    try {
      const response = await axios.put(`/admin/${idCarrito}/status`, { estado: nuevoEstado });

      if (response.status == 200) {
        notify(response.data.message, 'success')
        cargarCarritos();
        cargarVentas();
      }
    } catch (err) {
      notify(err.response.data.message || 'Error al actualizar el carrito', 'error');
    }
  };

  // Formatear fecha para mostrarAdd commentMore actions
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
    cargarVentas();
  }, []);

  return (
    <>
      <div className="orders-management">
        <h1>Gestión de Carritos</h1>

        <h2>Pedidos pendientes</h2>
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Cargando carritos...</p>
          </div>
        ) : carritosProc.length === 0 ? (
          <div className="empty-container">
            <p>No hay carritos pendientes.</p>
          </div>
        ) : (
          <div className="tabla-container">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID Usuario</th>
                  <th>ID Paquete</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carritosProc.map((carrito) => (
                  <tr key={carrito.id_carrito}>
                    <td>{carrito.id_carrito}</td>
                    <td>{carrito.id_user}</td>
                    <td>{carrito.nombre || carrito.id_paquete}</td>
                    <td>$ {carrito.total || 0}</td>
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
      <div className="orders-management">
        <h2>Ventas realizadas</h2>
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Cargando ventas...</p>
          </div>
        ) : ventas.length === 0 ? (
          <div className="empty-container">
            <p>No hay ventas.</p>
          </div>
        ) : (
          <div className="tabla-container">
            <table className="tabla-pedidos">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ID Carrito</th>
                  <th>Fecha y hora</th>
                  <th>Total</th>
                  <th>Metodo de pago</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>{venta.id_venta}</td>
                    <td>{venta.id_carrito}</td>
                    <td>{formatearFecha(venta.fecha_venta)}</td>
                    <td>{venta.total}</td>
                    <td>{venta.metodo_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersManagement;