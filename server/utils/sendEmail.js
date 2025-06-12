const { handleError } = require("../config/setup");
const nodemailer = require('nodemailer');
process.loadEnvFile();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

const sendEmail = async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: message
        };

        await transport.sendMail(mailOptions);

        return res.status(200).json({
            message: 'Correo enviado correctamente'
        })
    } catch (error) {
       return handleError(res, 'Error al enviar el correo', error);
    }
}

module.exports = {
    sendEmail
}