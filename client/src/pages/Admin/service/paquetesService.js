import axios from '../../../api/axios';

export const paquetesService = {
  // Obtener todos los paquetes
  async getAll() {
    try {
      const response = await axios.get('/paquetes');
      if (response.status !== 200) throw new Error('Error al obtener los paquetes');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener todos los paquetes con detalles completos
  async getAllDetallados() {
    try {
      const response = await axios.get('/paquetes/all/detallados');
      if (response.status !== 200) throw new Error('Error al obtener los paquetes detallados');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener paquete por ID
  async getById(id) {
    try {
      const response = await axios.get(`/paquetes/${id}`);
      if (response.status !== 200) throw new Error('Error al obtener el paquete');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Obtener paquete detallado por ID
  async getDetalladoById(id) {
    try {
      const response = await axios.get(`/paquetes/${id}/detallado`);
      if (response.status !== 200) throw new Error('Error al obtener el paquete detallado');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Crear nuevo paquete
  async create(paquete) {
    try {
      const response = await axios.post('/paquetes', { paquete });
      if (response.status !== 201 && response.status !== 200) throw new Error('Error al agregar el paquete');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Actualizar paquete
  async update(id, paquete) {
    try {
      const response = await axios.put(`/paquetes/${id}`, { paquete, });
      if (response.status !== 200) throw new Error('Error al actualizar el paquete');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Agregar actividad a paquete
  async addActividad(idPaquete, actividadData) {
    try {
      const response = await axios.post(`/paquetes/${idPaquete}/actividades`, { actividadData, });
      if (response.status !== 200) throw new Error('Error al agregar actividad al paquete');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Eliminar paquete
  async delete(id) {
    try {
      const response = await axios.delete(`/paquetes/${id}`, {
      });
      if (response.status !== 200) throw new Error('Error al eliminar el paquete');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}; 