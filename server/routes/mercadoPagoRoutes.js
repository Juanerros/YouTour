import express from 'express';
import { createPreference } from '../controller/MercadoController.js';
const router = express.Router();

router.post('/mercado-pago/create', createPreference);

export default router;
