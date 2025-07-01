const API_BASE_URL = 'http://localhost:5001/api';

export const actividadesService = {
  // Obtener todas las actividades
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/actividades`);
      if (!response.ok) throw new Error('Error al obtener las actividades');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nueva actividad
  async create(actividad) {
    try {
      const response = await fetch(`${API_BASE_URL}/actividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividad),
      });
      if (!response.ok) throw new Error('Error al agregar la actividad');
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
  }
}; 