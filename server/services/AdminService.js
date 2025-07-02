class AdminService {
    constructor(conex) {
        this.conex = conex;
    }

    getAllCarts = async () => {
        const [carts] = await this.conex.execute(
            'SELECT * FROM carritos'
        );
        return carts;
    }

    getAllSales = async () => {
        const [sales] = await this.conex.execute(
            'SELECT * FROM ventas'
        );
        return sales;
    }

    getCartById = async (cartId) => {
        const [cart] = await this.conex.execute(
            'SELECT * FROM carritos WHERE id_carrito = ?',
            [cartId]
        );
        if (cart.length === 0) throw { status: 404, message: 'Carrito no encontrado' };
        return cart[0];
    }

    updateCartStatus = async (cartId, estado) => {
        try {
            const cart = await this.getCartById(cartId);

            const [result] = await this.conex.execute(
                'UPDATE carritos SET estado = ? WHERE id_carrito = ?',
                [estado, cartId]
            );

            if (estado === 'Completado') {
                const [transaccion] = await this.conex.execute(
                    'SELECT id_transaccion FROM transacciones WHERE id_user = ? AND estado = "Pendiente"',
                    [cart.id_user]
                );

                if (transaccion.length == 0) throw { status: 500, message: 'Error al traer la transaccion' };

                const [venta] = await this.conex.execute(
                    'INSERT INTO ventas(id_carrito, id_transaccion) VALUES (?, ?)',
                    [cartId, transaccion[0].id_transaccion]
                );

                if (venta.affectedRows == 0) throw { status: 500, message: 'Error al crear venta' };

                const [paquete] = await this.conex.execute(
                    'UPDATE paquetes SET esta_reservado = 1 WHERE id_paquete = ?',
                    [cart.id_paquete]
                );

                if (paquete.affectedRows == 0) throw { status: 500, message: 'Error al actualizar paquete' };
            }

            return result.affectedRows;
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en updateCartStatus:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }
}

export default AdminService;