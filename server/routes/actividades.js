const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los tipos de actividad
router.get('/tipos', async (req, res) => {
    try {
        const [tipos] = await conex.execute('SELECT * FROM tipos_actividad');
        res.json(tipos);
    } catch (err) {
        handleError(res, 'Error al obtener tipos de actividad', err);
    }
});

// Obtener todos los niveles de dificultad
router.get('/dificultades', async (req, res) => {
    try {
        const [niveles] = await conex.execute('SELECT * FROM niveles_dificultad');
        res.json(niveles);
    } catch (err) {
        handleError(res, 'Error al obtener niveles de dificultad', err);
    }
});

// Obtener todas las actividades
router.get('/', async (req, res) => {
    try {
        const [actividades] = await conex.execute(
            'SELECT * FROM actividades'
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades', err);
    }
});

// Obtener actividades por ciudad
router.get('/ciudad/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [actividades] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_ciudad = ?',
            [id]
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades por ciudad', err);
    }
});

// Obtener actividades por país
router.get('/pais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [actividades] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE c.id_pais = ?',
            [id]
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades por país', err);
    }
});

// Obtener actividades por tipo
router.get('/tipo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [actividades] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_tipo = ?',
            [id]
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades por tipo', err);
    }
});

// Obtener actividades por dificultad
router.get('/dificultad/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [actividades] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_dificultad = ?',
            [id]
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades por dificultad', err);
    }
});

// Obtener actividades por rango de precio
router.get('/precio/:min/:max', async (req, res) => {
    const { min, max } = req.params;
    try {
        const [actividades] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.precio BETWEEN ? AND ?',
            [min, max]
        );
        res.json(actividades);
    } catch (err) {
        handleError(res, 'Error al obtener actividades por rango de precio', err);
    }
});

// Obtener una actividad específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [actividad] = await conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_actividad = ?',
            [id]
        );
        
        if (actividad.length === 0) {
            return handleError(res, 'Actividad no encontrada', null, 404);
        }
        
        res.json(actividad[0]);
    } catch (err) {
        handleError(res, 'Error al obtener actividad', err);
    }
});

// Crear una nueva actividad
router.post('/', async (req, res) => {
    const { nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad } = req.body;
    
    if (!nombre || !id_tipo || !id_ciudad || !precio || !duracion || !id_dificultad) {
        return handleError(res, 'Nombre, tipo, ciudad, precio, duración y dificultad son requeridos', null, 400);
    }
    
    try {
        // Verificar que la ciudad exista
        const [ciudad] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [id_ciudad]
        );
        
        if (ciudad.length === 0) {
            return handleError(res, 'Ciudad no encontrada', null, 404);
        }
        
        // Verificar que el tipo exista
        const [tipo] = await conex.execute(
            'SELECT * FROM tipos_actividad WHERE id_tipo = ?',
            [id_tipo]
        );
        
        if (tipo.length === 0) {
            return handleError(res, 'Tipo de actividad no encontrado', null, 404);
        }
        
        // Verificar que la dificultad exista
        const [dificultad] = await conex.execute(
            'SELECT * FROM niveles_dificultad WHERE id_nivel = ?',
            [id_dificultad]
        );
        
        if (dificultad.length === 0) {
            return handleError(res, 'Nivel de dificultad no encontrado', null, 404);
        }
        
        const [result] = await conex.execute(
            'INSERT INTO actividades (nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad]
        );
        
        res.status(201).json({
            id_actividad: result.insertId,
            nombre,
            id_tipo,
            id_ciudad,
            precio,
            duracion,
            descripcion,
            id_dificultad
        });
    } catch (err) {
        handleError(res, 'Error al crear actividad', err);
    }
});

// Actualizar una actividad
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad } = req.body;
    
    if (!nombre || !id_tipo || !id_ciudad || !precio || !duracion || !id_dificultad) {
        return handleError(res, 'Nombre, tipo, ciudad, precio, duración y dificultad son requeridos', null, 400);
    }
    
    try {
        // Verificar que la ciudad exista
        const [ciudad] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [id_ciudad]
        );
        
        if (ciudad.length === 0) {
            return handleError(res, 'Ciudad no encontrada', null, 404);
        }
        
        // Verificar que el tipo exista
        const [tipo] = await conex.execute(
            'SELECT * FROM tipos_actividad WHERE id_tipo = ?',
            [id_tipo]
        );
        
        if (tipo.length === 0) {
            return handleError(res, 'Tipo de actividad no encontrado', null, 404);
        }
        
        // Verificar que la dificultad exista
        const [dificultad] = await conex.execute(
            'SELECT * FROM niveles_dificultad WHERE id_nivel = ?',
            [id_dificultad]
        );
        
        if (dificultad.length === 0) {
            return handleError(res, 'Nivel de dificultad no encontrado', null, 404);
        }
        
        const [result] = await conex.execute(
            'UPDATE actividades SET nombre = ?, id_tipo = ?, id_ciudad = ?, precio = ?, duracion = ?, descripcion = ?, id_dificultad = ? WHERE id_actividad = ?',
            [nombre, id_tipo, id_ciudad, precio, duracion, descripcion, id_dificultad, id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Actividad no encontrada', null, 404);
        }
        
        res.json({
            id_actividad: parseInt(id),
            nombre,
            id_tipo,
            id_ciudad,
            precio,
            duracion,
            descripcion,
            id_dificultad
        });
    } catch (err) {
        handleError(res, 'Error al actualizar actividad', err);
    }
});

// Eliminar una actividad
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await conex.execute(
            'DELETE FROM actividades WHERE id_actividad = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Actividad no encontrada', null, 404);
        }
        
        res.json({ message: 'Actividad eliminada correctamente' });
    } catch (err) {
        handleError(res, 'Error al eliminar actividad', err);
    }
});

module.exports = router;