// Importaciones de rutas
import paisesRoutes from './routes/paises.js';
import ciudadesRoutes from './routes/ciudades.js';
import vuelosRoutes from './routes/vuelos.js';
import hotelesRoutes from './routes/hoteles.js';
import actividadesRoutes from './routes/actividades.js';
import paquetesRoutes from './routes/paquetes.js';
import cartRoutes from './routes/cart.js';
import emailRoutes from './routes/email.js';
import authRoutes from './routes/Auth.js';
import adminRoutes from './routes/admin.js'
import mercadoPagoRoutes from './routes/mercadoPagoRoutes.js';

// Importaciones de dependencias 
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.js';
import loadEnv from './utils/loadEnv.js';
import cookieParser from 'cookie-parser';
import loadStaticFiles from './utils/loadStaticsFiles.js'

// Middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());

// Cargar variables de entorno
loadEnv();

// Validar entorno (Desarrollo o Produccion)
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    console.log('Modo de desarrollo')

    app.use(logger);
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    }));
} else  {
    console.log('Modo de produccion')
}

// Rutas
app.use('/api/user', authRoutes);
app.use('/api/paises', paisesRoutes);
app.use('/api/ciudades', ciudadesRoutes);
app.use('/api/vuelos', vuelosRoutes);
app.use('/api/hoteles', hotelesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', mercadoPagoRoutes);


// Testeo de api
app.get('/api/ping', async (req, res) => {
    res.send('Pong')
});

// Servir archivos estaticos de la build de Vite
if (isProduction) loadStaticFiles(app);

// Prender servidor de solicitudes http 
const port = process.env.API_PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));