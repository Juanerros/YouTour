const mysql = require('mysql2/promise');
isProduction = process.env.NODE_ENV === 'production';

async function createConnection() {
    try {
        const conex = await mysql.createPool({
            // la url que propociona railway
            uri: isProduction ? process.env.DB_URL : null,
            // xampp
            host: !isProduction ? process.env.DB_HOST : null,
            user: !isProduction ? process.env.DB_USER : null,
            password: !isProduction ? process.env.DB_PASSWORD : null,
            database: !isProduction ? process.env.DB_NAME : null,
            port: !isProduction ? process.env.DB_PORT : null,
            waitForConnections: true,
            connectionLimit: 3,
            queueLimit: 0
        });

        conex.getConnection()
            .then(() => console.log('Conexión exitosa a la base de datos'))
            .catch(err => console.error('Error al conectar a la base de datos:', err.message));
        return conex;

    } catch (err) {
        console.error('Error en la conexion', err);
    }
};

module.exports = createConnection;