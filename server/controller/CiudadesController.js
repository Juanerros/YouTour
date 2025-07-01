import handleError from '../utils/handleError.js';

class CiudadesController {
    constructor(ciudadesService) {
        this.ciudadesService = ciudadesService;
    }

    getAllCiudades = async (req, res) => {
        try {
            const ciudades = await this.ciudadesService.getAllCiudades();
            res.json(ciudades);
        } catch (err) {
            handleError(res, 'Error al obtener ciudades', err);
        }
    }

    getCiudadesByPais = async (req, res) => {
        try {
            const { id } = req.params;
            const ciudades = await this.ciudadesService.getCiudadesByPais(id);
            res.json(ciudades);
        } catch (err) {
            handleError(res, 'Error al obtener ciudades por país', err);
        }
    }

    getCiudadById = async (req, res) => {
        try {
            const { id } = req.params;
            const ciudad = await this.ciudadesService.getCiudadById(id);
            
            if (!ciudad) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }
            
            res.json(ciudad);
        } catch (err) {
            handleError(res, 'Error al obtener ciudad', err);
        }
    }

    createCiudad = async (req, res) => {
        try {
            const { nombre, codigo_aeropuerto, id_pais } = req.body;
            
            if (!nombre || !id_pais) {
                return handleError(res, 'Nombre y país son requeridos', null, 400);
            }

            // Validar que el país existe
            const paisExists = await this.ciudadesService.validatePaisExists(id_pais);
            if (!paisExists) {
                return handleError(res, 'El país especificado no existe', null, 400);
            }
            
            const insertId = await this.ciudadesService.createCiudad(nombre, codigo_aeropuerto, id_pais);
            
            res.status(201).json({
                id_ciudad: insertId,
                nombre,
                codigo_aeropuerto,
                id_pais
            });
        } catch (err) {
            handleError(res, 'Error al crear ciudad', err);
        }
    }

    updateCiudad = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, codigo_aeropuerto, id_pais } = req.body;
            
            if (!nombre || !id_pais) {
                return handleError(res, 'Nombre y país son requeridos', null, 400);
            }

            // Validar que el país existe
            const paisExists = await this.ciudadesService.validatePaisExists(id_pais);
            if (!paisExists) {
                return handleError(res, 'El país especificado no existe', null, 400);
            }
            
            const affectedRows = await this.ciudadesService.updateCiudad(id, nombre, codigo_aeropuerto, id_pais);
            
            if (affectedRows === 0) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }
            
            res.json({
                id_ciudad: parseInt(id),
                nombre,
                codigo_aeropuerto,
                id_pais
            });
        } catch (err) {
            handleError(res, 'Error al actualizar ciudad', err);
        }
    }

    deleteCiudad = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si hay vuelos asociados
            const hasVuelos = await this.ciudadesService.checkVuelosAssociated(id);
            if (hasVuelos) {
                return handleError(res, 'No se puede eliminar la ciudad porque tiene vuelos asociados', null, 400);
            }
            
            // Verificar si hay hoteles asociados
            const hasHoteles = await this.ciudadesService.checkHotelesAssociated(id);
            if (hasHoteles) {
                return handleError(res, 'No se puede eliminar la ciudad porque tiene hoteles asociados', null, 400);
            }
            
            // Verificar si hay actividades asociadas
            const hasActividades = await this.ciudadesService.checkActividadesAssociated(id);
            if (hasActividades) {
                return handleError(res, 'No se puede eliminar la ciudad porque tiene actividades asociadas', null, 400);
            }
            
            const affectedRows = await this.ciudadesService.deleteCiudad(id);
            
            if (affectedRows === 0) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }
            
            res.json({ message: 'Ciudad eliminada correctamente' });
        } catch (err) {
            handleError(res, 'Error al eliminar ciudad', err);
        }
    }
}

export default CiudadesController;