import handleError from '../utils/handleError.js';

class PaisesController {
    constructor(paisesService) {
        this.paisesService = paisesService;
        
        // Bind methods to preserve 'this' context
        this.getAllContinentes = this.getAllContinentes.bind(this);
        this.createContinente = this.createContinente.bind(this);
        this.getAllPaises = this.getAllPaises.bind(this);
        this.getPaisesByContinente = this.getPaisesByContinente.bind(this);
        this.getPaisById = this.getPaisById.bind(this);
        this.createPais = this.createPais.bind(this);
        this.updatePais = this.updatePais.bind(this);
        this.deletePais = this.deletePais.bind(this);
    }

    // Métodos para continentes
    async getAllContinentes(req, res) {
        try {
            const continentes = await this.paisesService.getAllContinentes();
            res.json(continentes);
        } catch (err) {
            handleError(res, 500, 'Error al obtener continentes', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L20-20');
        }
    }

    async createContinente(req, res) {
        const { nombre } = req.body;
        
        if (!nombre) {
            return handleError(res, 400, 'El nombre del continente es requerido', null, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L27-27');
        }
        
        try {
            const continente = await this.paisesService.createContinente(nombre);
            res.status(201).json(continente);
        } catch (err) {
            if (err.message === 'El continente ya existe') {
                handleError(res, 400, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L34-34');
            } else {
                handleError(res, 500, 'Error al crear continente', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L36-36');
            }
        }
    }

    // Métodos para países
    async getAllPaises(req, res) {
        try {
            const paises = await this.paisesService.getAllPaises();
            res.json(paises);
        } catch (err) {
            handleError(res, 500, 'Error al obtener países', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L45-45');
        }
    }

    async getPaisesByContinente(req, res) {
        const { id } = req.params;
        
        try {
            const paises = await this.paisesService.getPaisesByContinente(id);
            res.json(paises);
        } catch (err) {
            handleError(res, 500, 'Error al obtener países por continente', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L54-54');
        }
    }

    async getPaisById(req, res) {
        const { id } = req.params;
        
        try {
            const pais = await this.paisesService.getPaisById(id);
            res.json(pais);
        } catch (err) {
            if (err.message === 'País no encontrado') {
                handleError(res, 404, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L63-63');
            } else {
                handleError(res, 500, 'Error al obtener país', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L65-65');
            }
        }
    }

    async createPais(req, res) {
        const { nombre, id_continente } = req.body;
        
        if (!nombre || !id_continente) {
            return handleError(res, 400, 'El nombre del país y el ID del continente son requeridos', null, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L73-73');
        }
        
        try {
            const pais = await this.paisesService.createPais(nombre, id_continente);
            res.status(201).json(pais);
        } catch (err) {
            if (err.message === 'Continente no encontrado') {
                handleError(res, 404, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L80-80');
            } else if (err.message === 'El país ya existe') {
                handleError(res, 400, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L82-82');
            } else {
                handleError(res, 500, 'Error al crear país', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L84-84');
            }
        }
    }

    async updatePais(req, res) {
        const { id } = req.params;
        const { nombre, id_continente } = req.body;
        
        if (!nombre || !id_continente) {
            return handleError(res, 400, 'El nombre del país y el ID del continente son requeridos', null, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L93-93');
        }
        
        try {
            const pais = await this.paisesService.updatePais(id, nombre, id_continente);
            res.json(pais);
        } catch (err) {
            if (err.message === 'País no encontrado') {
                handleError(res, 404, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L100-100');
            } else if (err.message === 'Continente no encontrado') {
                handleError(res, 404, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L102-102');
            } else {
                handleError(res, 500, 'Error al actualizar país', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L104-104');
            }
        }
    }

    async deletePais(req, res) {
        const { id } = req.params;
        
        try {
            const result = await this.paisesService.deletePais(id);
            res.json(result);
        } catch (err) {
            if (err.message === 'País no encontrado') {
                handleError(res, 404, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L115-115');
            } else if (err.message === 'No se puede eliminar el país porque tiene ciudades asociadas') {
                handleError(res, 400, err.message, err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L117-117');
            } else {
                handleError(res, 500, 'Error al eliminar país', err, '/c:/repos/JuanRepo/JuanRepo/server/controller/PaisesController.js#L119-119');
            }
        }
    }
}

export default PaisesController;