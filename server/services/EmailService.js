import sendEmail from '../utils/sendEmail.js';

class EmailService {
    constructor(conex) {
        this.conex = conex;
    }

    getAdminEmails = async () => {
        const [emails] = await this.conex.execute(
            'SELECT email FROM login WHERE isAdmin = true'
        );

        if (emails.length === 0) throw {
            message: 'No hay administradores registrados',
            status: 404
        };

        return emails;
    }

    sendClientConfirmation = async (userInfo, cartId, orderDetails) => {
        const subject = '¡Confirmación de tu reserva en YouTour!';
        const message = `
            Hola ${userInfo.name},
            
            ¡Gracias por tu reserva en YouTour!
            
            Detalles de tu reserva:
            - Número de carrito: ${cartId}
            - Paquete: ${orderDetails.title || 'No especificado'}
            - Total: ${orderDetails.total} $
            
            ¡Gracias por confiar en YouTour!
            
            Atentamente,
            El equipo de YouTour.
        `;

        return await sendEmail({
            to: userInfo.email,
            subject: subject,
            text: message
        });
    }

    sendAdminNotification = async (userInfo, cartId, orderDetails) => {
        try {
            const subject = `Nueva venta realizada - Carrito #${cartId}`;
            const message = `
            Nueva venta realizada:
            
            Número de carrito: ${cartId}
            Cliente: ${userInfo.name}
            Email: ${userInfo.email}
            Teléfono: ${userInfo.phone || 'No especificado'}
            Paquete: ${orderDetails.title || 'No especificado'}
            Total: ${orderDetails.total} $
        `;

            const adminEmails = await this.getAdminEmails();

            if (!adminEmails || (Array.isArray(adminEmails) && adminEmails.length === 0)) {
                throw { status: 500, message: 'No hay destinatarios para la notificación a administradores' };
            }

            return await sendEmail({
                to: adminEmails.map(email => email.email),
                subject: subject,
                text: message
            });
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en sendAdminNotification:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }

    sendOrderConfirmation = async (cartId, userInfo, orderDetails) => {
        try {
            // Enviar correo al cliente
            const clientSent = await this.sendClientConfirmation(userInfo, cartId, orderDetails);

            // Enviar correos a administradores
            const adminEmailsSent = await this.sendAdminNotification(userInfo, cartId, orderDetails);

            return {
                clientEmailSent: clientSent,
                adminEmailsSent: adminEmailsSent
            };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en sendOrderConfirmation:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }
}

export default EmailService;