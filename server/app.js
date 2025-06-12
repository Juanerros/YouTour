const path = require('path');
const { sendEmail } = require('./utils/sendEmail');
const isProduction = process.env.NODE_ENV === 'production';
const { express } = require(path.join(__dirname, 'config', 'setup'));

if (isProduction) console.log('Modo de produccion')
else {
    process.loadEnvFile();
    console.log('Modo de desarrollo')
}

const app = express();
app.use(express.json());

if (!isProduction) {
//no olviden instalar cors como desarrolladores (npm i -D cors)
    const cors = require('cors');

    app.use(cors({
        origin: ['http://localhost:5173'],
        credentials: true
    }));

// muestra las peticiones en consola
    app.use((req, res, next) => {
        console.log(`📌 Recibido: ${req.method} ${req.url}`);
        next();
    });
}

// Rutas
app.use('/user', require(path.join(__dirname, 'routes', 'user')));

// Testeo de api
app.get('/ping', async (req, res) => {
    res.send('Pong')
});

app.post('/send', sendEmail);

// Prender servidor de solicitudes http 
const port = process.env.API_PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));

// Servir archivos estaticos de la build de Vite
if (isProduction) {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get('*', (req, res) => {
        console.log('Sirviendo archivos estaticos');
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
}