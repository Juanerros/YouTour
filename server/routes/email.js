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
            - Destino: ${orderDetails.location || 'No especificado'}
            - Paquete: ${orderDetails.title || 'No especificado'}
            - Total: ${orderDetails.total} $
            
            Nos pondremos en contacto contigo pronto para confirmar todos los detalles.
            
            ¡Gracias por confiar en YouTour!
            
            Atentamente,
            El equipo de YouTour
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
        await sendEmail({ body: { email: userInfo.email, subject: clientSubject, message: clientMessage } }, res);

        // Enviar correo al jefe de ventas

        const [emails] = await conex.execute(
            'SELECT email FROM users WHERE is = true'
        );

        for (const email of emails) {
            await sendEmail({ body: { email: email.email, subject: salesSubject, message: salesMessage } }, res);
        }


        res.status(200).json({ message: 'Correos de confirmación enviados correctamente' });
    } catch (error) {
        handleError(res, 'Error al enviar los correos de confirmación', error);
    }
});

module.exports = router;