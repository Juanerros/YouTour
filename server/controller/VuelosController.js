import handleError from '../utils/handleError.js';

class VuelosController {
  constructor(vuelosService) {
    this.vuelosService = vuelosService;
  }

  getAllVuelos = async (req, res) => {
    try {
      const vuelos = await this.vuelosService.getAllVuelos();
      res.json(vuelos);
    } catch (err) {
      handleError(res, 'Error al obtener vuelos', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L12-12');
    }
  }

  getVuelosByOrigen = async (req, res) => {
    const { id } = req.params;
    try {
      const vuelos = await this.vuelosService.getVuelosByOrigen(id);
      res.json(vuelos);
    } catch (err) {
      handleError(res, 'Error al obtener vuelos por origen', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L21-21');
    }
  }

  getVuelosByDestino = async (req, res) => {
    const { id } = req.params;
    try {
      const vuelos = await this.vuelosService.getVuelosByDestino(id);
      res.json(vuelos);
    } catch (err) {
      handleError(res, 'Error al obtener vuelos por destino', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L31-31');
    }
  }

  getVuelosByFecha = async (req, res) => {
    const { fecha } = req.params;
    try {
      const vuelos = await this.vuelosService.getVuelosByFecha(fecha);
      res.json(vuelos);
    } catch (err) {
      handleError(res, 'Error al obtener vuelos por fecha', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L41-41');
    }
  }

  getVueloById = async (req, res) => {
    const { id } = req.params;
    try {
      const vuelo = await this.vuelosService.getVueloById(id);
      res.json(vuelo);
    } catch (err) {
      if (err.status === 404) {
        handleError(res, err.message, err, 404, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L51-51');
      } else {
        handleError(res, 'Error al obtener vuelo', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L53-53');
      }
    }
  }

  createVuelo = async (req, res) => {
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = req.body;
    
    if (!origen || !destino || !aerolinea || !precio || !duracion || !aeronave || !salida || !llegada || !fecha_vuelo) {
      return handleError(res, 'Todos los campos son requeridos', null, 400, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L60-60');
    }
    
    try {
      const vuelo = await this.vuelosService.createVuelo(req.body);
      res.status(201).json(vuelo);
    } catch (err) {
      if (err.status === 404) {
        handleError(res, err.message, err, 404, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L67-67');
      } else {
        handleError(res, 'Error al crear vuelo', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L69-69');
      }
    }
  }

  updateVuelo = async (req, res) => {
    const { id } = req.params;
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = req.body;
    
    if (!origen || !destino || !aerolinea || !precio || !duracion || !aeronave || !salida || !llegada || !fecha_vuelo) {
      return handleError(res, 'Todos los campos son requeridos', null, 400, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L77-77');
    }
    
    try {
      const vueloActualizado = await this.vuelosService.updateVuelo(id, req.body);
      res.json(vueloActualizado);
    } catch (err) {
      if (err.status === 404) {
        handleError(res, err.message, err, 404, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L84-84');
      } else {
        handleError(res, 'Error al actualizar vuelo', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L86-86');
      }
    }
  }

  deleteVuelo = async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await this.vuelosService.deleteVuelo(id);
      res.json(result);
    } catch (err) {
      if (err.status === 404) {
        handleError(res, err.message, err, 404, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L97-97');
      } else {
        handleError(res, 'Error al eliminar vuelo', err, 500, '/c:/repos/JuanRepo/JuanRepo/server/controller/VuelosController.js#L99-99');
      }
    }
  }
}

export default VuelosController;