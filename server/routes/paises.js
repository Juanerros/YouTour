import express from 'express';
import PaisesService from '../services/PaisesService.js';
import PaisesController from '../controller/PaisesController.js';
import createConnection from '../config/conex.js';

const router = express.Router();

const conex = await createConnection();
const paisesService = new PaisesService(conex);
const paisesController = new PaisesController(paisesService);

// Rutas para continentes
router.get('/continentes', paisesController.getAllContinentes);
router.post('/continentes', paisesController.createContinente);

// Rutas para países
router.get('/', paisesController.getAllPaises);
router.get('/continente/:id', paisesController.getPaisesByContinente);
router.get('/:id', paisesController.getPaisById);
router.post('/', paisesController.createPais);
router.put('/:id', paisesController.updatePais);
router.delete('/:id', paisesController.deletePais);

export default router;