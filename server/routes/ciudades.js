const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todas las ciudades
router.get('/', async (req, res) => {
    try {
        const [ciudades] = await conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais'
        );
        res.json(ciudades);
    } catch (err) {
        handleError(res, 'Error al obtener ciudades', err);
    }
});

// Obtener ciudades por país
router.get('/pais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [ciudades] = await conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_pais = ?',
            [id]
        );
        res.json(ciudades);
    } catch (err) {
        handleError(res, 'Error al obtener ciudades por país', err);
    }
});

// Obtener una ciudad específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [ciudad] = await conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_ciudad = ?',
            [id]
        );
        
        if (ciudad.length === 0) {
            return handleError(res, 'Ciudad no encontrada', null, 404);
        }
        
        res.json(ciudad[0]);
    } catch (err) {
        handleError(res, 'Error al obtener ciudad', err);
    }
});

// Crear una nueva ciudad
router.post('/', async (req, res) => {
    const { nombre, codigo_aeropuerto, id_pais } = req.body;
    
    if (!nombre || !id_pais) {
        return handleError(res, 'Nombre y país son requeridos', null, 400);
    }
    
    try {
        const [result] = await conex.execute(
            'INSERT INTO ciudades (nombre, codigo_aeropuerto, id_pais) VALUES (?, ?, ?)',
            [nombre, codigo_aeropuerto, id_pais]
        );
        
        res.status(201).json({
            id_ciudad: result.insertId,
            nombre,
            codigo_aeropuerto,
            id_pais
        });
    } catch (err) {
        handleError(res, 'Error al crear ciudad', err);
    }
});

// Actualizar una ciudad
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo_aeropuerto, id_pais } = req.body;
    
    if (!nombre || !id_pais) {
        return handleError(res, 'Nombre y país son requeridos', null, 400);
    }
    
    try {
        const [result] = await conex.execute(
            'UPDATE ciudades SET nombre = ?, codigo_aeropuerto = ?, id_pais = ? WHERE id_ciudad = ?',
            [nombre, codigo_aeropuerto, id_pais, id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Ciudad no encontrada', null, 404);
        }
        
        res.json({
            id_ciudad: parseInt(id),
            nombre,
            codigo_aeropuerto,
            id_pais
        });
    } catch (err) {
        handleError(res, 'Error al actualizar ciudad', err);
    }
});

// Eliminar una ciudad
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si hay vuelos, hoteles o actividades asociadas
        const [vuelos] = await conex.execute(
            'SELECT COUNT(*) as count FROM vuelos WHERE origen = ? OR destino = ?',
            [id, id]
        );
        
        if (vuelos[0].count > 0) {
            return handleError(res, 'No se puede eliminar la ciudad porque tiene vuelos asociados', null, 400);
        }
        
        const [hoteles] = await conex.execute(
            'SELECT COUNT(*) as count FROM hoteles WHERE id_ciudad = ?',
            [id]
        );
        
        if (hoteles[0].count > 0) {
            return handleError(res, 'No se puede eliminar la ciudad porque tiene hoteles asociados', null, 400);
        }
        
        const [actividades] = await conex.execute(
            'SELECT COUNT(*) as count FROM actividades WHERE id_ciudad = ?',
            [id]
        );
        
        if (actividades[0].count > 0) {
            return handleError(res, 'No se puede eliminar la ciudad porque tiene actividades asociadas', null, 400);
        }
        
        const [result] = await conex.execute(
            'DELETE FROM ciudades WHERE id_ciudad = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Ciudad no encontrada', null, 404);
        }
        
        res.json({ message: 'Ciudad eliminada correctamente' });
    } catch (err) {
        handleError(res, 'Error al eliminar ciudad', err);
    }
});

module.exports = router;