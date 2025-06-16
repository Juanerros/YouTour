const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

// Función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los carritos para administración
router.get('/all', async (req, res) => {
    try {
        const [carts] = await conex.execute(
            `SELECT * FROM carritos`
        );

        res.json({ carts });
    } catch (err) {
        handleError(res, 'Error al obtener los carritos para administración', err);
    }
});

// Actualizar estado del carrito (para administradores)
router.put('/:cartId/status', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { estado } = req.body;
        
        // Validar que el estado sea válido
        const estadosValidos = ['Activo', 'Procesando', 'Completado', 'Cancelado'];
        if (!estadosValidos.includes(estado)) {
            return handleError(res, 'Estado no válido', null, 400);
        }

        // Verificar si existe el carrito
        const [cart] = await conex.execute(
            'SELECT * FROM carritos WHERE id_carrito = ?',
            [cartId]
        );

        if (cart.length === 0) return handleError(res, 'El carrito no existe', null, 404);

        // Actualizar estado del carrito
        await conex.execute(
            'UPDATE carritos SET estado = ? WHERE id_carrito = ?',
            [estado, cartId]
        );

        res.json({
            success: true,
            message: `Estado del carrito actualizado a ${estado} exitosamente`
        });

    } catch (err) {
        handleError(res, 'Error al actualizar el estado del carrito', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});
module.exports = router;