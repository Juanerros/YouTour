const { createConnection, handleError, express } = require('./../config/setup');
const { sendEmail } = require('../utils/sendEmail');

let conex;
const init = async () => conex = await createConnection();
init();

const router = express.Router();

// Ruta para enviar confirmación de pedido
router.post('/order-confirmation', async (req, res) => {
    try {
        const { orderId, userInfo, orderDetails } = req.body;

        // Crear el mensaje para el cliente
        const clientSubject = '¡Confirmación de tu reserva en YouTour!';
        const clientMessage = `
            Hola ${userInfo.name},
            
            ¡Gracias por tu reserva en YouTour!
            
            Detalles de tu reserva:
            - Número de pedido: ${orderId}
            - Paquete: ${orderDetails.title || 'No especificado'}
            - Total: ${orderDetails.total} $
            
            ¡Gracias por confiar en YouTour!
            
            Atentamente,
            El equipo de YouTour.
        `;

        // Crear el mensaje para el jefe de ventas
        const salesSubject = `Nueva venta realizada - Pedido #${orderId}`;
        const salesMessage = `
            Nueva venta realizada:
            
            Número de pedido: ${orderId}
            Cliente: ${userInfo.name}
            Email: ${userInfo.email}
            Teléfono: ${userInfo.phone || 'No especificado'}
            Paquete: ${orderDetails.title || 'No especificado'}
            Total: ${orderDetails.total} $
        `;

        // Enviar correo al cliente
        const clientSent = await sendEmail({
            to: userInfo.email, 
            subject: clientSubject, 
            text: clientMessage
        });

        // Obtener correos de administradores
        const [emails] = await conex.execute('SELECT email FROM login WHERE isAdmin = true AND email IS NOT NULL');

        // Validar que hay administradores
        if (emails.length === 0) return handleError(res, 'No hay administradores registrados', null, 404);

        // Enviar correos a administradores
        let adminEmailsSent = 0;
        for (const email of emails) {
            if (email.email) { // Validar que el email no sea null
                const sent = await sendEmail({
                    to: email.email, 
                    subject: salesSubject, 
                    text: salesMessage
                });
                if (sent) adminEmailsSent++;
            }
        }

        // Enviar una sola respuesta HTTP
        if (clientSent && adminEmailsSent > 0) {
            res.status(200).json({ 
                message: 'Correos de confirmación enviados correctamente',
                clientEmailSent: clientSent,
                adminEmailsSent: adminEmailsSent
            });
        } else {
            return handleError(res, 'Error al enviar algunos correos');
        }
    } catch (error) {
        handleError(res, 'Error al enviar los correos de confirmación', error);
    }
});

module.exports = router;