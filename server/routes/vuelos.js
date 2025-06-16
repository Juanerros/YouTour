const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los vuelos
router.get('/', async (req, res) => {
    try {
        const [vuelos] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad'
        );
        res.json(vuelos);
    } catch (err) {
        handleError(res, 'Error al obtener vuelos', err);
    }
});

// Obtener vuelos por origen
router.get('/origen/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [vuelos] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE v.origen = ?',
            [id]
        );
        res.json(vuelos);
    } catch (err) {
        handleError(res, 'Error al obtener vuelos por origen', err);
    }
});

// Obtener vuelos por destino
router.get('/destino/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [vuelos] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE v.destino = ?',
            [id]
        );
        res.json(vuelos);
    } catch (err) {
        handleError(res, 'Error al obtener vuelos por destino', err);
    }
});

// Obtener vuelos por fecha
router.get('/fecha/:fecha', async (req, res) => {
    const { fecha } = req.params;
    try {
        const [vuelos] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE v.fecha_vuelo = ?',
            [fecha]
        );
        res.json(vuelos);
    } catch (err) {
        handleError(res, 'Error al obtener vuelos por fecha', err);
    }
});

// Obtener un vuelo específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [vuelo] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE v.id_vuelo = ?',
            [id]
        );
        
        if (vuelo.length === 0) {
            return handleError(res, 'Vuelo no encontrado', null, 404);
        }
        
        res.json(vuelo[0]);
    } catch (err) {
        handleError(res, 'Error al obtener vuelo', err);
    }
});

// Crear un nuevo vuelo
router.post('/', async (req, res) => {
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = req.body;
    
    if (!origen || !destino || !aerolinea || !precio || !duracion || !aeronave || !salida || !llegada || !fecha_vuelo) {
        return handleError(res, 'Todos los campos son requeridos', null, 400);
    }
    
    try {
        // Verificar que origen y destino existan
        const [ciudadOrigen] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [origen]
        );
        
        if (ciudadOrigen.length === 0) {
            return handleError(res, 'Ciudad de origen no encontrada', null, 404);
        }
        
        const [ciudadDestino] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [destino]
        );
        
        if (ciudadDestino.length === 0) {
            return handleError(res, 'Ciudad de destino no encontrada', null, 404);
        }
        
        const [result] = await conex.execute(
            'INSERT INTO vuelos (origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo]
        );
        
        res.status(201).json({
            id_vuelo: result.insertId,
            origen,
            destino,
            aerolinea,
            precio,
            duracion,
            aeronave,
            salida,
            llegada,
            fecha_vuelo
        });
    } catch (err) {
        handleError(res, 'Error al crear vuelo', err);
    }
});

// Actualizar un vuelo existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = req.body;
    
    if (!origen || !destino || !aerolinea || !precio || !duracion || !aeronave || !salida || !llegada || !fecha_vuelo) {
        return handleError(res, 'Todos los campos son requeridos', null, 400);
    }
    
    try {
        // Verificar que el vuelo exista
        const [vueloExistente] = await conex.execute(
            'SELECT * FROM vuelos WHERE id_vuelo = ?',
            [id]
        );
        
        if (vueloExistente.length === 0) {
            return handleError(res, 'Vuelo no encontrado', null, 404);
        }
        
        // Verificar que origen y destino existan
        const [ciudadOrigen] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [origen]
        );
        
        if (ciudadOrigen.length === 0) {
            return handleError(res, 'Ciudad de origen no encontrada', null, 404);
        }
        
        const [ciudadDestino] = await conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [destino]
        );
        
        if (ciudadDestino.length === 0) {
            return handleError(res, 'Ciudad de destino no encontrada', null, 404);
        }
        
        await conex.execute(
            'UPDATE vuelos SET origen = ?, destino = ?, aerolinea = ?, precio = ?, duracion = ?, aeronave = ?, salida = ?, llegada = ?, fecha_vuelo = ? WHERE id_vuelo = ?',
            [origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo, id]
        );
        
        // Obtener el vuelo actualizado con los nombres de las ciudades
        const [vueloActualizado] = await conex.execute(
            'SELECT v.*, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
            'FROM vuelos v ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE v.id_vuelo = ?',
            [id]
        );
        
        res.json(vueloActualizado[0]);
    } catch (err) {
        handleError(res, 'Error al actualizar vuelo', err);
    }
});

// Eliminar un vuelo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar que el vuelo exista
        const [vueloExistente] = await conex.execute(
            'SELECT * FROM vuelos WHERE id_vuelo = ?',
            [id]
        );
        
        if (vueloExistente.length === 0) {
            return handleError(res, 'Vuelo no encontrado', null, 404);
        }
        
        await conex.execute(
            'DELETE FROM vuelos WHERE id_vuelo = ?',
            [id]
        );
        
        res.json({ message: 'Vuelo eliminado correctamente' });
    } catch (err) {
        handleError(res, 'Error al eliminar vuelo', err);
    }
});

module.exports = router;