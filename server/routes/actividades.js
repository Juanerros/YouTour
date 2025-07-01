import express from 'express';
import ActividadesService from '../services/ActividadesService.js';
import ActividadesController from '../controller/ActividadesController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const actividadesService = new ActividadesService(conex);
const actividadesController = new ActividadesController(actividadesService);

router.get('/', actividadesController.getAllActividades);
router.get('/ciudad/:id', actividadesController.getActividadesByCiudad);
router.get('/pais/:id', actividadesController.getActividadesByPais);
router.get('/tipo/:id', actividadesController.getActividadesByTipo);
router.get('/:id', actividadesController.getActividadById);
router.post('/', actividadesController.createActividad);
router.put('/:id', actividadesController.updateActividad);
router.delete('/:id', actividadesController.deleteActividad);

export default router;