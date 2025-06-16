const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const { express } = require(path.join(__dirname, 'config', 'setup'));
const cors = require('cors');

if (isProduction) console.log('Modo de produccion')
else {
    process.loadEnvFile();
    console.log('Modo de desarrollo')
}

const app = express();
app.use(express.json());

if (!isProduction) {
    // CORS
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }));
    // muestra las peticiones en consola
    app.use((req, res, next) => {
        console.log(`📌 Recibido: ${req.method} ${req.url}`);
        next();
    });
}

// Rutas
app.use('/api/user', require(path.join(__dirname, 'routes', 'user')));
app.use('/api/paises', require(path.join(__dirname, 'routes', 'paises')));
app.use('/api/ciudades', require(path.join(__dirname, 'routes', 'ciudades')));
app.use('/api/vuelos', require(path.join(__dirname, 'routes', 'vuelos')));
app.use('/api/hoteles', require(path.join(__dirname, 'routes', 'hoteles')));
app.use('/api/actividades', require(path.join(__dirname, 'routes', 'actividades')));
app.use('/api/paquetes', require(path.join(__dirname, 'routes', 'paquetes')));
app.use('/api/cart', require(path.join(__dirname, 'routes', 'cart')));
app.use('/api/email', require(path.join(__dirname, 'routes', 'email')));
app.use('/api/pedidos', require(path.join(__dirname, 'routes', 'pedidos')));

// Testeo de api
app.get('/api/ping', async (req, res) => {
    res.send('Pong')
});

// Servir archivos estaticos de la build de Vite
if (isProduction) {
    console.log('Sirviendo archivos estaticos')
    // Ruta específica para archivos estáticos
    app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
    
    // Servir el archivo index.html para rutas del frontend
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    // Ruta fallback para SPA
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        } else {
            next();
        }
    });
}

// Prender servidor de solicitudes http 
const port = process.env.API_PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));
