import { useState, useEffect } from 'react';
import axios from '../../../api/axios';

const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Procesando'); // Por defecto muestra los carritos en procesando
  const [mostrarCompletados, setMostrarCompletados] = useState(false);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      // Obtenemos los carritos en lugar de pedidos
      const response = await axios.get('/cart/admin');
      // Asegurarse de que pedidos siempre sea un array
      setPedidos(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error al obtener carritos:', err);
      setError('Error al cargar los carritos. Por favor, intente nuevamente.');
      setPedidos([]); // Establecer un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoPedido = async (idCarrito, nuevoEstado) => {
    try {
      setLoading(true);
      // Actualizamos el estado del carrito
      await axios.put(`/cart/${idCarrito}/status`, { estado: nuevoEstado });
      // Refrescar la lista de carritos
      await fetchPedidos();
      return { success: true };
    } catch (err) {
      console.error('Error al actualizar el estado del carrito:', err);
      setError('Error al actualizar el estado del carrito. Por favor, intente nuevamente.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Filtrar carritos según el estado seleccionado y la opción de mostrar completados
  // Asegurarse de que pedidos sea un array antes de filtrar
  const pedidosFiltrados = Array.isArray(pedidos) ? pedidos.filter(carrito => {
    if (mostrarCompletados && carrito.estado === 'Completado') return true;
    if (!mostrarCompletados && carrito.estado === 'Completado') return false;
    if (filtroEstado === 'Todos') return true;
    return carrito.estado === filtroEstado;
  }) : [];

  useEffect(() => {
    fetchPedidos();
  }, []);

  return {
    pedidos: pedidosFiltrados,
    loading,
    error,
    fetchPedidos,
    actualizarEstadoPedido,
    filtroEstado,
    setFiltroEstado,
    mostrarCompletados,
    setMostrarCompletados
  };
};

export default usePedidos;