const API_BASE_URL = 'http://localhost:5001/api';

export const ciudadesService = {
  // Obtener todas las ciudades
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades`);
      if (!response.ok) throw new Error('Error al obtener las ciudades');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener ciudades por país
  async getByPais(paisId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades/pais/${paisId}`);
      if (!response.ok) throw new Error('Error al obtener las ciudades por país');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nueva ciudad
  async create(ciudad) {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ciudad),
      });
      if (!response.ok) throw new Error('Error al agregar la ciudad');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 