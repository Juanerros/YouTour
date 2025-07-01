import express from 'express';
import VuelosService from '../services/VuelosService.js';
import VuelosController from '../controller/VuelosController.js';
import createConnection from '../config/conex.js';

const router = express.Router();

const conex = await createConnection();
const vuelosService = new VuelosService(conex);
const vuelosController = new VuelosController(vuelosService);

// Obtener todos los vuelos
router.get('/', vuelosController.getAllVuelos);

// Obtener vuelos por origen
router.get('/origen/:id', vuelosController.getVuelosByOrigen);

// Obtener vuelos por destino
router.get('/destino/:id', vuelosController.getVuelosByDestino);

// Obtener vuelos por fecha
router.get('/fecha/:fecha', vuelosController.getVuelosByFecha);

// Obtener un vuelo específico
router.get('/:id', vuelosController.getVueloById);

// Crear un nuevo vuelo
router.post('/', vuelosController.createVuelo);

// Actualizar un vuelo existente
router.put('/:id', vuelosController.updateVuelo);

// Eliminar un vuelo
router.delete('/:id', vuelosController.deleteVuelo);

export default router;