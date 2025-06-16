const { createConnection, handleError, express } = require('./../config/setup');
const router = express.Router();

let conex;
const init = async () => conex = await createConnection();
init();

// Obtener el carrito activo del usuario
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        console.log(userId);

        const [cart] = await conex.execute(
            `SELECT c.id_carrito, c.id_user, c.id_paquete, c.estado,
                    p.nombre, p.descripcion, p.precio_base, p.duracion_dias, 
                    p.fecha_inicio, p.fecha_fin
             FROM carritos c 
             INNER JOIN paquetes p ON c.id_paquete = p.id_paquete 
             WHERE c.id_user = ? AND c.estado = 'Activo'`,
            [userId]
        );

        if (cart.length === 0) return handleError(res, 'El carrito no existe', null, 404);

        res.json({ cart: cart[0] });
    } catch (err) {
        handleError(res, 'Error al obtener el carrito', err);
    }
});

// Obtener todos los carritos del usuario (no solo el activo)
router.get('/:userId/all', async (req, res) => {
    try {
        const { userId } = req.params;

        const [carts] = await conex.execute(
            `SELECT c.*, p.nombre, p.precio_base, p.duracion_dias, p.fecha_inicio, p.fecha_fin
             FROM carritos c 
             INNER JOIN paquetes p ON c.id_paquete = p.id_paquete 
             WHERE c.id_user = ? AND c.estado != 'Activo'`,
            [userId]
        );

        res.json({ carts });
    } catch (err) {
        handleError(res, 'Error al obtener los carritos', err);
    }
});

// Agregar un paquete al carrito
router.post('/add', async (req, res) => {
    try {
        const { userId, paqueteId } = req.body;

        // Verificar si ya existe un carrito activo
        const [existingCart] = await conex.execute(
            "SELECT * FROM carritos WHERE id_user = ? AND estado = 'Activo'",
            [userId]
        );

        if (existingCart.length > 0) return handleError(res, 'Ya tiene un paquete en el carrito', null, 409);

        // Crear nuevo carrito
        await conex.execute(
            'INSERT INTO carritos (id_user, id_paquete) VALUES (?, ?)',
            [userId, paqueteId]
        );

        res.status(201).json({ message: 'Paquete agregado al carrito exitosamente' });
    } catch (err) {
        handleError(res, 'Error al agregar al carrito', err);
    }
});

// Actualizar estado del carrito a 'Procesando' (checkout)
router.put('/:cartId/checkout', async (req, res) => {
    try {
        const { cartId } = req.params;

        // Obtener información del carrito
        const [cart] = await conex.execute(
            `SELECT c.*, p.precio_base as total 
                 FROM carritos c 
                 INNER JOIN paquetes p ON c.id_paquete = p.id_paquete 
                 WHERE c.id_carrito = ? AND c.estado = 'Activo'`,
            [cartId]
        );

        if (cart.length === 0) return handleError(res, 'El carrito no existe o no esta activo', null, 404);

        // Actualizar estado del carrito
        await conex.execute(
            "UPDATE carritos SET estado = 'Procesando' WHERE id_carrito = ?",
            [cartId]
        );

        res.json({
            message: 'Checkout exitoso, tu pedido sera proce'
        });

    } catch (err) {
        handleError(res, 'Error en el proceso de checkout', err);
    }
});

// Eliminar paquete del carrito
router.delete('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        console.log(cartId);

        // Verificar si existe el carrito y obtener información del paquete
        const [cart] = await conex.execute(
            `SELECT * FROM carritos WHERE id_carrito = ? AND estado = 'Activo'`,
            [cartId]
        );

        if (cart.length === 0) return handleError(res, 'El carrito no existe o no está activo', null, 404);

        // Eliminar el carrito (cambiar estado a 'Cancelado')
        await conex.execute(
            "DELETE FROM carritos WHERE id_carrito = ?",
            [cartId]
        );

        res.json({
            message: 'Paquete eliminado del carrito exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al eliminar el paquete del carrito', err);
    }
});

// cancelar paquete del carrito
router.post('/cancel/:cartId', async (req, res) => {
    const { cartId } = req.params;

    console.log('carrito:' + cartId);

    try {

        // Verificar si existe el carrito y obtener información del paquete
        const [cart] = await conex.execute(
            `SELECT * FROM carritos WHERE id_carrito = ? AND estado != 'Activo'`,
            [cartId]
        );

        if (cart.length === 0) return handleError(res, 'El carrito no existe o no está activo', null, 404);

        // Cancerlar el carrito
        await conex.execute(
            "UPDATE carritos SET estado = 'Cancelado' WHERE id_carrito = ?",
            [cartId]
        );

        res.json({
            message: 'Paquete cancelado del carrito exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al eliminar el paquete del carrito', err);
    }
});

// Completar venta
router.post('/complete-sale', async (req, res) => {
    try {
        const { cartId, total, comision, metodoPago } = req.body;

        // Obtener información del pedido
        const [pedido] = await conex.execute(
            'SELECT * FROM carritos WHERE id_carrito = ?',
            [cartId]
        );

        if (pedido.length === 0) return handleError(res, 'El pedido no existe', null, 404);

        // Registrar venta
        await conex.execute(
            `INSERT INTO ventas (id_carrito, total, comision, metodo_pago) 
                 VALUES (?, ?, ?, ?)`,
            [cartId, total, comision, pedido[0].metodo_pago]
        );

        // Actualizar estado del pedido
        await conex.execute(
            "UPDATE carritos SET estado = 'Completado' WHERE id_pedido = ?",
            [cartId]
        );

        res.json({ message: 'Venta completada exitosamente' });
    } catch (err) {
        handleError(res, 'Error al completar la venta', err);
    }
});

module.exports = router;