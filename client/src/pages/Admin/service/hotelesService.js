const API_BASE_URL = 'http://localhost:5001/api';

export const hotelesService = {
  // Obtener todos los hoteles
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/hoteles`);
      if (!response.ok) throw new Error('Error al obtener los hoteles');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Filtrar hoteles por país
  async getByPais(idPais) {
    try {
      const response = await fetch(`${API_BASE_URL}/hoteles/pais/${idPais}`);
      if (!response.ok) throw new Error('Error al filtrar hoteles por país');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo hotel
  async create(hotel) {
    try {
      const response = await fetch(`${API_BASE_URL}/hoteles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotel),
      });
      if (!response.ok) throw new Error('Error al agregar el hotel');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener países
  async getPaises() {
    try {
      const response = await fetch(`${API_BASE_URL}/paises`);
      if (!response.ok) throw new Error('Error al obtener los países');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener ciudades por país
  async getCiudadesByPais(idPais) {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades/pais/${idPais}`);
      if (!response.ok) throw new Error('Error al obtener las ciudades');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener amenidades disponibles
  async getAmenidades() {
    try {
      const response = await fetch(`${API_BASE_URL}/hoteles/amenidades`);
      if (!response.ok) throw new Error('Error al obtener las amenidades');
      const data = await response.json();
      return data.map(a => a.nombre);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 