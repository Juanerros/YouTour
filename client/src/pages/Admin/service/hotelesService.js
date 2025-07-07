import axios from '../../../api/axios';

export const hotelesService = {
  // Obtener todos los hoteles
  async getAll() {
    try {
      const response = await axios.get('/hoteles');
      if (response.status !== 200) throw new Error('Error al obtener los hoteles');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Filtrar hoteles por país
  async getByPais(idPais) {
    try {
      const response = await axios.get(`/hoteles/pais/${idPais}`);
      if (response.status !== 200) throw new Error('Error al filtrar hoteles por país');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo hotel
  async create(hotel) {
    try {
      const response = await axios.post('/hoteles', { hotel });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar el hotel');
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
  },

  // Obtener amenidades disponibles
  async getAmenidades() {
    try {
      const response = await axios.get('/hoteles/amenidades');
      if (response.status !== 200) throw new Error('Error al obtener las amenidades');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 