import handleError from '../utils/handleError.js';

class EmailController {
    constructor(emailService) {
        this.emailService = emailService;
    }

    sendOrderConfirmation = async (req, res) => {
        const { cartId, userInfo, orderDetails } = req.body;
        
        try {
            const result = await this.emailService.sendOrderConfirmation(cartId, userInfo, orderDetails);

            if (result.clientEmailSent && result.adminEmailsSent > 0) {
                res.status(200).json({
                    message: 'Correos de confirmación enviados correctamente',
                    clientEmailSent: result.clientEmailSent,
                    adminEmailsSent: result.adminEmailsSent
                });
            } else {
                return handleError(res, {
                    message: 'Error al enviar los correos de confirmación',
                    status: 500
                });
            }
        } catch (err) {
            handleError(res, err);
        }
    }
}

export default EmailController;