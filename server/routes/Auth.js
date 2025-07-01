import express from 'express';
import AuthService from '../services/AuthService.js';
import AuthController from '../controller/AuthController.js';
import createConnection from '../config/conex.js';
import requireAuth from '../middlewares/authMiddleware.js';

const router = express.Router();

const conex = await createConnection();
const authService = new AuthService(conex);
const authController = new AuthController(authService);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, (req, res) => {
    res.json({
        message: 'Usuario autenticado',
        user: req.user
    });
});

export default router;