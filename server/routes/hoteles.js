import express from 'express';
import HotelesService from '../services/HotelesService.js';
import HotelesController from '../controller/HotelesController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const hotelesService = new HotelesService(conex);
const hotelesController = new HotelesController(hotelesService);

router.get('/amenidades', hotelesController.getAllAmenidades);
router.get('/:id/amenidades', hotelesController.getAmenidadesByHotel);
router.get('/', hotelesController.getAllHoteles);
router.get('/ciudad/:id', hotelesController.getHotelesByCiudad);
router.get('/pais/:id', hotelesController.getHotelesByPais);
router.get('/precio/:min/:max', hotelesController.getHotelesByPrecio);
router.get('/:id', hotelesController.getHotelById);
router.post('/', hotelesController.createHotel);
router.put('/:id', hotelesController.updateHotel);
router.delete('/:id', hotelesController.deleteHotel);

export default router;