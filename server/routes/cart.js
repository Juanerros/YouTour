import express from 'express';
import CartService from '../services/CartService.js';
import CartController from '../controller/CartController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const cartService = new CartService(conex);
const cartController = new CartController(cartService);

router.get('/:userId', cartController.getActiveCart);
router.get('/:userId/all', cartController.getAllCarts);
router.post('/add', cartController.addToCart);
router.put('/:cartId/checkout', cartController.checkoutCart);
router.delete('/:cartId', cartController.removeFromCart);
router.post('/cancel/:cartId', cartController.cancelCart);
router.post('/complete-sale', cartController.completeSale);

export default router;