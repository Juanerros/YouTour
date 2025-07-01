import { useState, useEffect } from 'react';
import { pedidosService } from '../service/pedidosService';
import useNotification from '../../../hooks/useNotification';

const usePedidos = () => {
  const { notify } = useNotification();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Procesando');
  const [mostrarCompletados, setMostrarCompletados] = useState(false);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAll();
      setPedidos(data);
      setError(null);
    } catch (err) {
      notify(err.message || 'Error al obtener los pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstadoPedido = async (idCarrito, nuevoEstado) => {
    try {
      setLoading(true);
      await pedidosService.updateStatus(idCarrito, nuevoEstado);
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