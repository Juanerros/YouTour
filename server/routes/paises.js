const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los continentes
router.get('/continentes', async (req, res) => {
    try {
        const [continentes] = await conex.execute('SELECT * FROM continentes');
        res.json(continentes);
    } catch (err) {
        handleError(res, 'Error al obtener continentes', err);
    }
});

// Obtener todos los países
router.get('/', async (req, res) => {
    try {
        const [paises] = await conex.execute(
            'SELECT p.*, c.nombre as continente FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente'
        );
        res.json(paises);
    } catch (err) {
        handleError(res, 'Error al obtener países', err);
    }
});

// Obtener países por continente
router.get('/continente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [paises] = await conex.execute(
            'SELECT p.*, c.nombre as continente FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente ' +
            'WHERE p.id_continente = ?',
            [id]
        );
        res.json(paises);
    } catch (err) {
        handleError(res, 'Error al obtener países por continente', err);
    }
});

// Obtener un país específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [pais] = await conex.execute(
            'SELECT p.*, c.nombre as continente FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente ' +
            'WHERE p.id_pais = ?',
            [id]
        );
        
        if (pais.length === 0) {
            return handleError(res, 'País no encontrado', null, 404);
        }
        
        res.json(pais[0]);
    } catch (err) {
        handleError(res, 'Error al obtener país', err);
    }
});

// Crear un nuevo país
router.post('/', async (req, res) => {
    const { nombre, id_continente } = req.body;
    
    if (!nombre || !id_continente) {
        return handleError(res, 'Nombre y continente son requeridos', null, 400);
    }
    
    try {
        const [result] = await conex.execute(
            'INSERT INTO paises (nombre, id_continente) VALUES (?, ?)',
            [nombre, id_continente]
        );
        
        res.status(201).json({
            id_pais: result.insertId,
            nombre,
            id_continente
        });
    } catch (err) {
        handleError(res, 'Error al crear país', err);
    }
});

// Actualizar un país
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, id_continente } = req.body;
    
    if (!nombre || !id_continente) {
        return handleError(res, 'Nombre y continente son requeridos', null, 400);
    }
    
    try {
        const [result] = await conex.execute(
            'UPDATE paises SET nombre = ?, id_continente = ? WHERE id_pais = ?',
            [nombre, id_continente, id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'País no encontrado', null, 404);
        }
        
        res.json({
            id_pais: parseInt(id),
            nombre,
            id_continente
        });
    } catch (err) {
        handleError(res, 'Error al actualizar país', err);
    }
});

// Eliminar un país
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si hay ciudades asociadas
        const [ciudades] = await conex.execute(
            'SELECT COUNT(*) as count FROM ciudades WHERE id_pais = ?',
            [id]
        );
        
        if (ciudades[0].count > 0) {
            return handleError(res, 'No se puede eliminar el país porque tiene ciudades asociadas', null, 400);
        }
        
        const [result] = await conex.execute(
            'DELETE FROM paises WHERE id_pais = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'País no encontrado', null, 404);
        }
        
        res.json({ message: 'País eliminado correctamente' });
    } catch (err) {
        handleError(res, 'Error al eliminar país', err);
    }
});

module.exports = router;