import handleError from '../utils/handleError.js';

class PaquetesController {
    constructor(paquetesService) {
        this.paquetesService = paquetesService;
    }

    getAllPaquetes = async (req, res) => {
        try {
            const paquetes = await this.paquetesService.getAllPaquetes();
            res.json(paquetes);
        } catch (err) {
            handleError(res, err);
        }
    }

    getPaqueteById = async (req, res) => {
        const { id } = req.params;

        try {
            const paquete = await this.paquetesService.getPaqueteById(id);
            res.json(paquete);
        } catch (err) {
            handleError(res, err);
        }
    }

    getPaqueteDetallado = async (req, res) => {
        const { id } = req.params;

        try {
            const paqueteDetallado = await this.paquetesService.getPaqueteDetallado(id);
            res.json(paqueteDetallado);
        } catch (err) {
            handleError(res, err);
        }
    }

    getPaquetesDetallados = async (req, res) => {
        try {
            const paquetesDetallados = await this.paquetesService.getPaquetesDetallados();
            res.json(paquetesDetallados);
        } catch (err) {
            handleError(res, err);
        }
    }

    createPaquete = async (req, res) => {
        const { 
            nombre, 
            descripcion, 
            precio_base, 
            duracion_dias, 
            cantidad_personas, 
            fecha_inicio, 
            fecha_fin, 
            vuelo_id, 
            hotel_id,
            id_status = 1 // Estado por defecto
        } = req.body;

        if (!nombre || !descripcion || !precio_base || !duracion_dias || !cantidad_personas || !fecha_inicio || !fecha_fin) {
            return handleError(res, { message: 'Todos los campos requeridos deben ser proporcionados', status: 400 });
        }

        try {
            const paquete = await this.paquetesService.createPaquete({
                nombre,
                descripcion,
                precio_base,
                duracion_dias,
                cantidad_personas,
                fecha_inicio,
                fecha_fin,
                vuelo_id,
                hotel_id,
                id_status
            });
            res.status(201).json(paquete);
        } catch (err) {
            handleError(res, err);
        }
    }

    addVueloToPaquete = async (req, res) => {
        const { id } = req.params;
        const { id_vuelo } = req.body;

        if (!id_vuelo) return handleError(res, { message: 'El ID del vuelo es requerido', status: 400 });

        try {
            const result = await this.paquetesService.addVueloToPaquete(id, id_vuelo);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    addHotelToPaquete = async (req, res) => {
        const { id } = req.params;
        const { id_hotel } = req.body;

        if (!id_hotel) return handleError(res, { message: 'El ID del hotel es requerido', status: 400 });

        try {
            const result = await this.paquetesService.addHotelToPaquete(id, id_hotel);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    addActividadToPaquete = async (req, res) => {
        const { id } = req.params;
        const { id_actividad } = req.body;

        if (!id_actividad) return handleError(res, { message: 'El ID de la actividad es requerido', status: 400 });

        try {
            const result = await this.paquetesService.addActividadToPaquete(id, id_actividad);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    updatePaquete = async (req, res) => {
        const { id } = req.params;
        const { 
            nombre, 
            descripcion, 
            precio_base, 
            duracion_dias, 
            cantidad_personas, 
            fecha_inicio, 
            fecha_fin, 
            vuelo_id, 
            hotel_id 
        } = req.body;

        if (!nombre || !descripcion || !precio_base || !duracion_dias || !cantidad_personas || !fecha_inicio || !fecha_fin) {
            return handleError(res, { message: 'Todos los campos requeridos deben ser proporcionados', status: 400 });
        }

        try {
            const paquete = await this.paquetesService.updatePaquete(id, {
                nombre,
                descripcion,
                precio_base,
                duracion_dias,
                cantidad_personas,
                fecha_inicio,
                fecha_fin,
                vuelo_id,
                hotel_id
            });
            res.json(paquete);
        } catch (err) {
            handleError(res, err);
        }
    }

    deleteActividadFromPaquete = async (req, res) => {
        const { id, id_actividad } = req.params;

        try {
            const result = await this.paquetesService.deleteActividadFromPaquete(id, id_actividad);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    deletePersonaFromPaquete = async (req, res) => {
        const { id, id_persona } = req.params;

        try {
            const result = await this.paquetesService.deletePersonaFromPaquete(id, id_persona);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    async deletePaquete(req, res) {
        const { id } = req.params;

        try {
            const result = await this.paquetesService.deletePaquete(id);
            res.json(result);
        } catch (err) {
            handleError(res, err);
        }
    }

    async getAllPaqueteStatus(req, res) {
        try {
            const status = await this.paquetesService.getAllPaqueteStatus();
            res.json(status);
        } catch (err) {
            handleError(res, err);
        }
    }
}

export default PaquetesController;