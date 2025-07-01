import handleError from '../utils/handleError.js';

class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }

    getActiveCart = async (req, res) => {
        const { userId } = req.params;

        try {
            const cart = await this.cartService.getActiveCartByUserId(userId);

            res.json({ cart });
        } catch (err) {
            handleError(res, err);
        }
    }

    getAllCarts = async (req, res) => {
        const { userId } = req.params;

        try {
            const carts = await this.cartService.getAllCartsByUserId(userId);

            res.json({ carts });
        } catch (err) {
            handleError(res, err);
        }
    }

    addToCart = async (req, res) => {
        const { userId, paqueteId } = req.body;
        try {
            await this.cartService.addToCart(userId, paqueteId);

            res.status(201).json({ message: 'Paquete agregado al carrito exitosamente' });
        } catch (err) {
            handleError(res, err);
        }
    }

    removeFromCart = async (req, res) => {
        const { cartId } = req.params;
        try {
            const isSuccess = await this.cartService.removeActiveCart(cartId);
            if (!isSuccess) return handleError(res, {
                message: 'Error al eliminar el paquete del carrito',
                status: 500
            });

            res.json({
                message: 'Paquete eliminado del carrito exitosamente'
            });
        } catch (err) {
            handleError(res, err);
        }
    }

    updateCartStatus = async (req, res) => {
        const { cartId } = req.params;
        const { estado } = req.body;
        try {
            // Verificar si existe el carrito
            await this.cartService.getCartById(cartId);

            const isSuccess = await this.cartService.updateCartStatus(cartId, estado);
            if (!isSuccess) {
                return handleError(res, {
                    message: 'Error al actualizar el carrito',
                    status: 500
                });
            }

            res.json({
                message: `Estado del carrito actualizado a ${estado} exitosamente`
            });
        } catch (err) {
            handleError(res, err);
        }
    }

    checkoutCart = async (req, res) => {
        const { cartId } = req.params;
        const total = req.body.total || 0;
        try {
            const isSuccess = await this.cartService.checkoutCart(cartId, total);

            if (!isSuccess) return handleError(res, {
                message: 'Error al realizar checkout',
                status: 500
            });

            res.json({
                message: 'Checkout exitoso, tu pedido sera procesado'
            });
        } catch (err) {
            handleError(res, err);
        }
    }

    cancelCart = async (req, res) => {
        const { cartId } = req.params;

        try {
            const cancelled = await this.cartService.cancelCart(cartId);
            if (!cancelled) {
                return handleError(res, {
                    message: 'Error al cancelar el carrito',
                    status: 500
                });
            }

            res.json({
                message: 'Paquete cancelado del carrito exitosamente'
            });
        } catch (err) {
            handleError(res, err);
        }
    }

    completeSale = async (req, res) => {
        const { cartId, total, comision, metodoPago } = req.body;
        try {
            const completed = await this.cartService.completeSale(cartId, total, comision, metodoPago);
            if (!completed) {
                return handleError(res, {
                    message: 'Error al completar la venta',
                    status: 500
                });
            }

            res.json({ message: 'Venta completada exitosamente' });
        } catch (err) {
            handleError(res, err);
        }
    }
}

export default CartController;