import express from 'express';
import CiudadesService from '../services/CiudadesService.js';
import CiudadesController from '../controller/CiudadesController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const ciudadesService = new CiudadesService(conex);
const ciudadesController = new CiudadesController(ciudadesService);

router.get('/', ciudadesController.getAllCiudades);
router.get('/pais/:id', ciudadesController.getCiudadesByPais);
router.get('/:id', ciudadesController.getCiudadById);
router.post('/', ciudadesController.createCiudad);
router.put('/:id', ciudadesController.updateCiudad);
router.delete('/:id', ciudadesController.deleteCiudad);

export default router;