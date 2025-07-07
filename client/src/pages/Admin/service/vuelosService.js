import axios from '../../../api/axios';

export const vuelosService = {
  // Obtener todos los vuelos
  async getAll() {
    try {
      const response = await axios.get('/vuelos');
      if (response.status !== 200) throw new Error('Error al obtener los vuelos');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo vuelo
  async create(vuelo) {
    try {
      const response = await axios.post('/vuelos', { vuelo });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar el vuelo');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Eliminar vuelo
  async delete(id) {
    try {
      const response = await axios.delete(`/vuelos/${id}`);
      if (response.status !== 200) throw new Error('Error al eliminar el vuelo');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Actualizar vuelo
  async update(id, vueloActualizado) {
    try {
      const response = await axios.put(`/vuelos/${id}`, { vueloActualizado });
      if (response.status !== 200) throw new Error('Error al actualizar el vuelo');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 