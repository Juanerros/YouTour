import handleError from '../utils/handleError.js';
import { generateToken } from '../utils/jwt.js';

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await this.authService.login(email, password);

      const token = generateToken({
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // usar HTTPS en producción
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24, // 1 día
      });

      res.status(200).json({
        message: 'Se logueó correctamente',
        user: { ...user, pass: '[Hidden]' }
      });

    } catch (err) {
      handleError(res, err);
    }
  }

  logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada' });
  };

  register = async (req, res) => {
    try {
      const { email, pass, name, dni } = req.body;
      
      // Validar datos de entrada
      if (!email || !pass || !name || !dni) {
        return handleError(res, { status: 400, message: 'Email, contraseña, nombre y DNI son requeridos' });
      }

      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: 'Usuario registrado correctamente',
        user: { ...user, pass: '[Hidden]' }
      });
    } catch (err) {
      handleError(res, err);
    }
  }
}

export default AuthController;
