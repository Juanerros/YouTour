import express from 'express';
import PaquetesService from '../services/PaquetesService.js';
import PaquetesController from '../controller/PaquetesController.js';
import createConnection from '../config/conex.js';

const router = express.Router();

const conex = await createConnection();
const paquetesService = new PaquetesService(conex);
const paquetesController = new PaquetesController(paquetesService);

// Obtener todos los paquetes
router.get('/', paquetesController.getAllPaquetes);

// Obtener un paquete específico
router.get('/:id', paquetesController.getPaqueteById);

// Obtener paquete con detalles completos
router.get('/:id/detallado', paquetesController.getPaqueteDetallado);

// Obtener todos los paquetes con detalles completos
router.get('/all/detallados', paquetesController.getPaquetesDetallados);

// Crear un nuevo paquete
router.post('/', paquetesController.createPaquete);

// Agregar vuelo a un paquete
router.post('/:id/vuelos', paquetesController.addVueloToPaquete);

// Agregar hotel a un paquete
router.post('/:id/hoteles', paquetesController.addHotelToPaquete);

// Agregar actividad a un paquete
router.post('/:id/actividades', paquetesController.addActividadToPaquete);

// Actualizar un paquete
router.put('/:id', paquetesController.updatePaquete);

// Eliminar actividad de un paquete
router.delete('/:id/actividades/:id_actividad', paquetesController.deleteActividadFromPaquete);

// Eliminar un paquete completo
router.delete('/:id', paquetesController.deletePaquete);

export default router;