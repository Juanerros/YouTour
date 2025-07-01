import axios from '../../../api/axios';

export const pedidosService = {
  // Obtener todos los carritos/pedidos
  async getAll() {
    try {
      const response = await axios.get('/admin/all');
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Error al obtener los pedidos');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener los pedidos');
    }
  },

  // Actualizar estado de carrito/pedido
  async updateStatus(idCarrito, nuevoEstado) {
    try {
      await axios.put(`/cart/${idCarrito}/status`, { estado: nuevoEstado });
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar el estado del carrito');
    }
  }
}; 