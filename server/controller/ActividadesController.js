import handleError from '../utils/handleError.js';

class ActividadesController {
    constructor(actividadesService) {
        this.actividadesService = actividadesService;
    }

    getAllActividades = async (req, res) => {
        try {
            const actividades = await this.actividadesService.getAllActividades();
            res.json(actividades);
        } catch (err) {
            handleError(res, 'Error al obtener actividades', err);
        }
    }

    getActividadesByCiudad = async (req, res) => {
        const { id } = req.params;
        try {
            const actividades = await this.actividadesService.getActividadesByCiudad(id);
            res.json(actividades);
        } catch (err) {
            handleError(res, 'Error al obtener actividades por ciudad', err);
        }
    }

    getActividadesByPais = async (req, res) => {
        const { id } = req.params;
        try {
            const actividades = await this.actividadesService.getActividadesByPais(id);
            res.json(actividades);
        } catch (err) {
            handleError(res, 'Error al obtener actividades por país', err);
        }
    }

    getActividadesByTipo = async (req, res) => {
        const { id } = req.params;
        try {
            const actividades = await this.actividadesService.getActividadesByTipo(id);
            res.json(actividades);
        } catch (err) {
            handleError(res, 'Error al obtener actividades por tipo', err);
        }
    }

    getActividadById = async (req, res) => {
        const { id } = req.params;
        try {
            const actividad = await this.actividadesService.getActividadById(id);
            if (!actividad) {
                return handleError(res, 'Actividad no encontrada', null, 404);
            }
            res.json(actividad);
        } catch (err) {
            handleError(res, 'Error al obtener actividad', err);
        }
    }

    createActividad = async (req, res) => {
        const { nombre, tipo, id_ciudad, precio, duracion } = req.body;
        
        if (!nombre || !tipo || !id_ciudad || !precio || !duracion) {
            return handleError(res, 'Nombre, tipo, ciudad, precio, duración son requeridos', null, 400);
        }
        
        try {
            // Verificar que la ciudad exista
            const ciudadExists = await this.actividadesService.validateCiudadExists(id_ciudad);
            if (!ciudadExists) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }
            
            const actividadId = await this.actividadesService.createActividad(req.body);
            res.status(201).json({
                id_actividad: actividadId,
                ...req.body
            });
        } catch (err) {
            handleError(res, 'Error al crear actividad', err);
        }
    }

    updateActividad = async (req, res) => {
        const { id } = req.params;
        const { nombre, id_tipo, id_ciudad, precio, duracion } = req.body;
        
        if (!nombre || !id_tipo || !id_ciudad || !precio || !duracion) {
            return handleError(res, 'Nombre, tipo, ciudad, precio, duración son requeridos', null, 400);
        }
        
        try {
            // Verificar que la ciudad exista
            const ciudadExists = await this.actividadesService.validateCiudadExists(id_ciudad);
            if (!ciudadExists) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }
            
            // Verificar que el tipo exista
            const tipoExists = await this.actividadesService.validateTipoExists(id_tipo);
            if (!tipoExists) {
                return handleError(res, 'Tipo de actividad no encontrado', null, 404);
            }
            
            const updated = await this.actividadesService.updateActividad(id, req.body);
            if (!updated) {
                return handleError(res, 'Actividad no encontrada', null, 404);
            }
            
            res.json({
                id_actividad: parseInt(id),
                ...req.body
            });
        } catch (err) {
            handleError(res, 'Error al actualizar actividad', err);
        }
    }

    deleteActividad = async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await this.actividadesService.deleteActividad(id);
            if (!deleted) {
                return handleError(res, 'Actividad no encontrada', null, 404);
            }
            
            res.json({ message: 'Actividad eliminada correctamente' });
        } catch (err) {
            handleError(res, 'Error al eliminar actividad', err);
        }
    }
}

export default ActividadesController;