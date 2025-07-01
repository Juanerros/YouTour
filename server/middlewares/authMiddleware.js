import { verifyToken } from '../utils/jwt.js';

export default function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // disponible en el controlador
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
