import express from 'express';
import AdminService from '../services/AdminService.js';
import AdminController from '../controller/AdminController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const adminService = new AdminService(conex);
const adminController = new AdminController(adminService);

router.get('/all', adminController.getAllCarts);
router.get('/ventas/all', adminController.getAllSales);
router.put('/:cartId/status', adminController.updateCartStatus);

export default router;