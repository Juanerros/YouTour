const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

// Función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const [pedidos] = await conex.execute(
            `SELECT p.*, u.nombre as nombre_usuario, pq.nombre as nombre_paquete 
             FROM pedidos p 
             INNER JOIN users u ON p.id_user = u.id_user 
             INNER JOIN paquetes pq ON p.id_paquete = pq.id_paquete 
             ORDER BY p.fecha_pedido DESC`
        );
        res.json(pedidos);
    } catch (err) {
        handleError(res, 'Error al obtener pedidos', err);
    }
});

// Obtener un pedido específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [pedido] = await conex.execute(
            `SELECT p.*, u.nombre as nombre_usuario, pq.nombre as nombre_paquete 
             FROM pedidos p 
             INNER JOIN users u ON p.id_user = u.id_user 
             INNER JOIN paquetes pq ON p.id_paquete = pq.id_paquete 
             WHERE p.id_pedido = ?`,
            [id]
        );

        if (pedido.length === 0) return handleError(res, 'Pedido no encontrado', null, 404);

        res.json(pedido[0]);
    } catch (err) {
        handleError(res, 'Error al obtener el pedido', err);
    }
});

// Actualizar el estado de un pedido
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        const estadosValidos = ['Pendiente', 'Confirmado', 'En Proceso', 'Completado', 'Cancelado'];
        if (!estadosValidos.includes(estado)) {
            return handleError(res, 'Estado no válido', null, 400);
        }

        // Verificar que el pedido exista
        const [pedidoExistente] = await conex.execute(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [id]
        );

        if (pedidoExistente.length === 0) {
            return handleError(res, 'Pedido no encontrado', null, 404);
        }

        // Actualizar el estado del pedido
        await conex.execute(
            'UPDATE pedidos SET estado = ? WHERE id_pedido = ?',
            [estado, id]
        );

        // Si el pedido se completa o cancela, actualizar el carrito asociado
        if (estado === 'Completado' || estado === 'Cancelado') {
            await conex.execute(
                `UPDATE carritos c 
                 INNER JOIN pedidos p ON c.id_paquete = p.id_paquete AND c.id_user = p.id_user 
                 SET c.estado = ? 
                 WHERE p.id_pedido = ?`,
                [estado, id]
            );
        }

        // Obtener el pedido actualizado
        const [pedidoActualizado] = await conex.execute(
            `SELECT p.*, u.nombre as nombre_usuario, pq.nombre as nombre_paquete 
             FROM pedidos p 
             INNER JOIN users u ON p.id_user = u.id_user 
             INNER JOIN paquetes pq ON p.id_paquete = pq.id_paquete 
             WHERE p.id_pedido = ?`,
            [id]
        );

        res.json({
            message: `Estado del pedido actualizado a ${estado}`,
            pedido: pedidoActualizado[0]
        });
    } catch (err) {
        handleError(res, 'Error al actualizar el estado del pedido', err);
    }
});

// Obtener pedidos por usuario
router.get('/usuario/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [pedidos] = await conex.execute(
            `SELECT p.*, pq.nombre as nombre_paquete 
             FROM pedidos p 
             INNER JOIN paquetes pq ON p.id_paquete = pq.id_paquete 
             WHERE p.id_user = ? 
             ORDER BY p.fecha_pedido DESC`,
            [userId]
        );
        res.json(pedidos);
    } catch (err) {
        handleError(res, 'Error al obtener pedidos del usuario', err);
    }
});

module.exports = router;