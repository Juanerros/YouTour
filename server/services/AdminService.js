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
                await this.conex.execute(
                    'INSERT INTO ventas(id_carrito, total) VALUES (?, ?)',
                    [cartId, cart.total]
                );
            }

            return result.affectedRows;
        } catch (err) {
            console.error('Error interno en register:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }
}

export default AdminService;