export default function handleError(res, err) {
  // Si el error es un string, convertirlo a objeto
  if (typeof err === 'string') {
    err = { message: err, status: 500 };
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Errores internos (500+) - mostrar mensaje genérico al cliente
  if (status >= 500) {
    console.error(`[${status}] Error interno:`, message);
    if (err.stack) console.error('Stack:', err.stack);
    if (err.cause) console.error('Causa:', err.cause);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

  // Errores de cliente (400-499) - mostrar mensaje personalizado
  console.warn(`[${status}] ${message}`);
  return res.status(status).json({ message });
}