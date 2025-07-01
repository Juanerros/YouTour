const API_BASE_URL = 'http://localhost:5001/api';

export const continentesService = {
  // Obtener todos los continentes
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/paises/continentes`);
      if (!response.ok) throw new Error('Error al obtener los continentes');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo continente
  async create(continente) {
    try {
      const response = await fetch(`${API_BASE_URL}/paises/continentes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(continente),
      });
      if (!response.ok) throw new Error('Error al agregar el continente');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 