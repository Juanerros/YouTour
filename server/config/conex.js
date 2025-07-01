import mysql from 'mysql2/promise';
import loadEnv from './../utils/loadEnv.js';

loadEnv();

async function createConnection() {
    try {
        const conex = mysql.createPool({
            // la url que propociona railway
            uri: process.env.DB_URL,
            waitForConnections: true,
            connectionLimit: 3,
            queueLimit: 0
        });

        conex.getConnection()
            .catch(err => console.error('Error al conectar a la base de datos:', err.message));
        return conex;

    } catch (err) {
        console.error('Error en la conexion', err);
    }
};

export default createConnection;