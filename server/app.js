const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const { express } = require(path.join(__dirname, 'config', 'setup'));

if (isProduction) console.log('Modo de produccion')
else {
    process.loadEnvFile();
    console.log('Modo de desarrollo')
}

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:5173', 'https://url-vercel'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

if (!isProduction) {
    // muestra las peticiones en consola
    app.use((req, res, next) => {
        console.log(`📌 Recibido: ${req.method} ${req.url}`);
        next();
    });
}

// Rutas
app.use('/user', require(path.join(__dirname, 'routes', 'user')));
app.use('/paises', require(path.join(__dirname, 'routes', 'paises')));
app.use('/ciudades', require(path.join(__dirname, 'routes', 'ciudades')));
app.use('/vuelos', require(path.join(__dirname, 'routes', 'vuelos')));
app.use('/hoteles', require(path.join(__dirname, 'routes', 'hoteles')));
app.use('/actividades', require(path.join(__dirname, 'routes', 'actividades')));
app.use('/paquetes', require(path.join(__dirname, 'routes', 'paquetes')));
app.use('/cart', require(path.join(__dirname, 'routes', 'cart')));
app.use('/email', require(path.join(__dirname, 'routes', 'email')));

// Testeo de api
app.get('/ping', async (req, res) => {
    res.send('Pong')
});

// Prender servidor de solicitudes http 
const port = process.env.API_PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));

// Servir archivos estaticos de la build de Vite
// if (isProduction) {
//     app.use(express.static(path.join(__dirname, "../client/dist")));

//     app.get('*', (req, res) => {
//         console.log('Sirviendo archivos estaticos');
//         res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
//     });
// }