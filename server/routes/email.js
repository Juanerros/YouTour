import express from 'express';
import EmailService from '../services/EmailService.js';
import EmailController from '../controller/EmailController.js';
import createConnection from '../config/conex.js';

const router = express.Router();
const conex = await createConnection();
const emailService = new EmailService(conex);
const emailController = new EmailController(emailService);

router.post('/order-confirmation', emailController.sendOrderConfirmation);

export default router;