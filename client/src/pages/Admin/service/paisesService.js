import axios from '../../../api/axios';

export const paisesService = {
  // Obtener todos los países
  async getAll() {
    try {
      const response = await axios.get('/paises');
      if (response.status !== 200) throw new Error('Error al obtener los países');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo país
  async create(pais) {
    try {
      const response = await axios.post('/paises', { pais });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar el país');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 