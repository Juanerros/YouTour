const API_BASE_URL = 'http://localhost:5001/api';

export const paquetesService = {
  // Obtener todos los paquetes
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/paquetes`);
      if (!response.ok) throw new Error('Error al obtener los paquetes');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener paquete por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/paquetes/${id}`);
      if (!response.ok) throw new Error('Error al obtener el paquete');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo paquete
  async create(paquete) {
    try {
      const response = await fetch(`${API_BASE_URL}/paquetes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paquete),
      });
      if (!response.ok) throw new Error('Error al agregar el paquete');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Agregar actividad a paquete
  async addActividad(idPaquete, actividadData) {
    try {
      const response = await fetch(`${API_BASE_URL}/paquetes/${idPaquete}/actividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividadData),
      });
      if (!response.ok) throw new Error('Error al agregar actividad al paquete');
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 