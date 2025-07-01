const API_BASE_URL = 'http://localhost:5001/api';

export const vuelosService = {
  // Obtener todos los vuelos
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/vuelos`);
      if (!response.ok) throw new Error('Error al obtener los vuelos');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo vuelo
  async create(vuelo) {
    try {
      const response = await fetch(`${API_BASE_URL}/vuelos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vuelo),
      });
      if (!response.ok) throw new Error('Error al agregar el vuelo');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Eliminar vuelo
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/vuelos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el vuelo');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Actualizar vuelo
  async update(id, vueloActualizado) {
    try {
      const response = await fetch(`${API_BASE_URL}/vuelos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vueloActualizado),
      });
      if (!response.ok) throw new Error('Error al actualizar el vuelo');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 