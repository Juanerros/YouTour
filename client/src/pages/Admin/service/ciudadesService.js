import axios from '../../../api/axios';

export const ciudadesService = {
  // Obtener todas las ciudades
  async getAll() {
    try {
      const response = await axios.get('/ciudades');
      if (response.status !== 200) throw new Error('Error al obtener las ciudades');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener ciudades por país
  async getByPais(paisId) {
    try {
      const response = await axios.get(`/ciudades/pais/${paisId}`);
      if (response.status !== 200) throw new Error('Error al obtener las ciudades por país');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nueva ciudad
  async create(ciudad) {
    try {
      const response = await axios.post('/ciudades', { ciudad });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar la ciudad');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 