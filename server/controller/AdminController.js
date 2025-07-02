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
        const { estado } = req.body;
        const { cartId } = req.params;

        try {
            // Actualizar estado del carrito
            await this.adminService.updateCartStatus(cartId, estado);

            res.json({
                message: `Estado del carrito actualizado a ${estado} exitosamente`
            });

        } catch (err) {
            handleError(res, err);
        }
    }
}

export default AdminController;