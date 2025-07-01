import nodemailer from 'nodemailer';
import loadEnv from './loadEnv.js';

loadEnv();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Ignorar certificados autofirmados (solo para desarrollo)
    }
});

const sendEmail = async (mailOptions) => {
    try {
        const options = {
            from: process.env.EMAIL,
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text
        };

        if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
            throw { status: 400, message: 'No se definieron destinatarios (to) para el correo.' };
        }

        await transport.sendMail(options);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
}

export default sendEmail;