import axios from '../../../api/axios';

export const actividadesService = {
  // Obtener todas las actividades
  async getAll() {
    try {
      const response = await axios.get('/actividades');
      if (response.status !== 200) throw new Error('Error al obtener las actividades');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nueva actividad
  async create(actividad) {
    try {
      const response = await axios.post('/actividades', { actividad });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar la actividad');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener países
  async getPaises() {
    try {
      const response = await axios.get('/paises');
      if (response.status !== 200) throw new Error('Error al obtener los países');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener ciudades por país
  async getCiudadesByPais(idPais) {
    try {
      const response = await axios.get(`/ciudades/pais/${idPais}`);
      if (response.status !== 200) throw new Error('Error al obtener las ciudades');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 