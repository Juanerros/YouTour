import express from 'express';
import { createMercadoPagoCheckout } from './services/mercadoPago/createMercadoPagoCheckout.js';

const router = express.Router();

router.post('/api/mercadopago/create-checkout', async (req, res) => {
  const { title, price } = req.body;

  try {
    const preference = await createMercadoPagoCheckout(title, price);
    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el checkout' });
  }
});

export default router;
