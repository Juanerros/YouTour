const API_BASE_URL = 'http://localhost:5001/api';

export const paisesService = {
  // Obtener todos los países
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/paises`);
      if (!response.ok) throw new Error('Error al obtener los países');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo país
  async create(pais) {
    try {
      const response = await fetch(`${API_BASE_URL}/paises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pais),
      });
      if (!response.ok) throw new Error('Error al agregar el país');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 