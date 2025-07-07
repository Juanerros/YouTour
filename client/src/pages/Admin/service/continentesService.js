import axios from '../../../api/axios';

export const continentesService = {
  // Obtener todos los continentes
  async getAll() {
    try {
      const response = await axios.get('/paises/continentes');
      if (response.status !== 200) throw new Error('Error al obtener los continentes');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo continente
  async create(continente) {
    try {
      const response = await axios.post('/paises/continentes', { continente });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar el continente');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 