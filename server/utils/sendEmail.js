const { handleError } = require("../config/setup");
const nodemailer = require('nodemailer');
const isProduction = process.env.NODE_ENV === 'production';

if(!isProduction) process.loadEnvFile();

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
        
        await transport.sendMail(options);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
}

module.exports = {
    sendEmail
}