import handleError from '../utils/handleError.js';

class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }

    getAllCarts = async (req, res) => {
        try {
            const carts = await this.adminService.getAllCarts();
            res.json({ carts });
        } catch (err) {
            handleError(res, err);
        }
    };

    getAllSales = async (req, res) => {
        try {
            const sales = await this.adminService.getAllSales();
            res.json({ sales });
        } catch (err) {
            handleError(res, err);
        }
    };

    updateCartStatus = async (req, res) => {
        try {
            const { cartId } = req.params;
            const { estado } = req.body;

            // Verificar si existe el carrito
            await this.adminService.getCartById(cartId);

            // Actualizar estado del carrito
            const affectedRows = await this.adminService.updateCartStatus(cartId, estado);
            if (affectedRows === 0) return handleError(res, { status: 500, message: 'No se pudo actualizar el carrito' });

            res.json({
                message: `Estado del carrito actualizado a ${estado} exitosamente`
            });

        } catch (err) {
            handleError(res, err);
        }
    }
}

export default AdminController;