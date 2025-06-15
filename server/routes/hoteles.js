const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todas las amenidades disponibles
router.get('/amenidades', async (req, res) => {
    try {
        const [amenidades] = await conex.execute('SELECT * FROM amenidades');
        res.json(amenidades);
    } catch (err) {
        handleError(res, 'Error al obtener amenidades', err);
    }
});

// Obtener todos los hoteles
router.get('/', async (req, res) => {
    try {
        const [hoteles] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais'
        );
        
        // Obtener amenidades para cada hotel
        for (let hotel of hoteles) {
            const [amenidades] = await conex.execute(
                'SELECT a.id_amenidad, a.nombre FROM amenidades a ' +
                'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
                'WHERE ha.id_hotel = ?',
                [hotel.id_hotel]
            );
            hotel.amenidades = amenidades.map(a => a.nombre).join(', ');
        }
        
        res.json(hoteles);
    } catch (err) {
        handleError(res, 'Error al obtener hoteles', err);
    }
});

router.get('/amenidades', async (req, res) => {
    try {
        const [amenidades] = await conex.execute('SELECT * FROM amenidades');
        res.json(amenidades);
    } catch (err) {
        handleError(res, 'Error al obtener amenidades', err);
    }
});

// Obtener hoteles por ciudad
router.get('/ciudad/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [hoteles] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.id_ciudad = ?',
            [id]
        );
        res.json(hoteles);
    } catch (err) {
        handleError(res, 'Error al obtener hoteles por ciudad', err);
    }
});

// Obtener hoteles por país
router.get('/pais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [hoteles] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_pais = ?',
            [id]
        );
        res.json(hoteles);
    } catch (err) {
        handleError(res, 'Error al obtener hoteles por país', err);
    }
});

// Obtener hoteles por rango de precio
router.get('/precio/:min/:max', async (req, res) => {
    const { min, max } = req.params;
    try {
        const [hoteles] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.precio_noche BETWEEN ? AND ?',
            [min, max]
        );
        res.json(hoteles);
    } catch (err) {
        handleError(res, 'Error al obtener hoteles por rango de precio', err);
    }
});

// Obtener un hotel específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [hotel] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.id_hotel = ?',
            [id]
        );
        
        if (hotel.length === 0) {
            return handleError(res, 'Hotel no encontrado', null, 404);
        }
        
        res.json(hotel[0]);
    } catch (err) {
        handleError(res, 'Error al obtener hotel', err);
    }
});

// Crear un nuevo hotel
router.post('/', async (req, res) => {
    const { nombre, id_ciudad, rating, precio_noche, descripcion, amenidades, ubicacion } = req.body;
    
    if (!nombre || !id_ciudad || !rating || !precio_noche) {
        return handleError(res, 'Nombre, ciudad, rating y precio por noche son requeridos', null, 400);
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
        
        // Insertar el hotel
        const [result] = await conex.execute(
            'INSERT INTO hoteles (nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion || '']
        );
        
        const idHotel = result.insertId;
        
        // Insertar las amenidades en la tabla intermedia
        if (amenidades && amenidades.length > 0) {
            const amenidadesArray = Array.isArray(amenidades) ? amenidades : amenidades.split(',').map(a => a.trim());
            
            for (const amenidad of amenidadesArray) {
                // Verificar si la amenidad existe, si no, crearla
                let idAmenidad;
                const [amenidadExistente] = await conex.execute(
                    'SELECT id_amenidad FROM amenidades WHERE nombre = ?',
                    [amenidad]
                );
                
                if (amenidadExistente.length > 0) {
                    idAmenidad = amenidadExistente[0].id_amenidad;
                } else {
                    const [nuevaAmenidad] = await conex.execute(
                        'INSERT INTO amenidades (nombre) VALUES (?)',
                        [amenidad]
                    );
                    idAmenidad = nuevaAmenidad.insertId;
                }
                
                // Insertar en la tabla intermedia
                await conex.execute(
                    'INSERT INTO hotel_amenidades (id_hotel, id_amenidad) VALUES (?, ?)',
                    [idHotel, idAmenidad]
                );
            }
        }
        
        // Obtener las amenidades para incluirlas en la respuesta
        const [amenidadesHotel] = await conex.execute(
            'SELECT a.nombre FROM amenidades a ' +
            'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
            'WHERE ha.id_hotel = ?',
            [idHotel]
        );
        
        const amenidadesString = amenidadesHotel.map(a => a.nombre).join(', ');
        
        res.status(201).json({
            id_hotel: idHotel,
            nombre,
            id_ciudad,
            rating,
            precio_noche,
            descripcion,
            ubicacion: ubicacion || '',
            amenidades: amenidadesString
        });
    } catch (err) {
        handleError(res, 'Error al crear hotel', err);
    }
});

// Actualizar un hotel
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, id_ciudad, rating, precio_noche, descripcion, amenidades, ubicacion } = req.body;
    
    if (!nombre || !id_ciudad || !rating || !precio_noche) {
        return handleError(res, 'Nombre, ciudad, rating y precio por noche son requeridos', null, 400);
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
        
        // Verificar que el hotel exista
        const [hotelExistente] = await conex.execute(
            'SELECT * FROM hoteles WHERE id_hotel = ?',
            [id]
        );
        
        if (hotelExistente.length === 0) {
            return handleError(res, 'Hotel no encontrado', null, 404);
        }
        
        // Iniciar transacción
        await conex.beginTransaction();
        
        // Actualizar el hotel
        const [result] = await conex.execute(
            'UPDATE hoteles SET nombre = ?, id_ciudad = ?, rating = ?, precio_noche = ?, descripcion = ?, ubicacion = ? WHERE id_hotel = ?',
            [nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion || '', id]
        );
        
        // Eliminar las amenidades existentes para este hotel
        await conex.execute(
            'DELETE FROM hotel_amenidades WHERE id_hotel = ?',
            [id]
        );
        
        // Insertar las nuevas amenidades
        if (amenidades && amenidades.length > 0) {
            const amenidadesArray = Array.isArray(amenidades) ? amenidades : amenidades.split(',').map(a => a.trim());
            
            for (const amenidad of amenidadesArray) {
                // Verificar si la amenidad existe, si no, crearla
                let idAmenidad;
                const [amenidadExistente] = await conex.execute(
                    'SELECT id_amenidad FROM amenidades WHERE nombre = ?',
                    [amenidad]
                );
                
                if (amenidadExistente.length > 0) {
                    idAmenidad = amenidadExistente[0].id_amenidad;
                } else {
                    const [nuevaAmenidad] = await conex.execute(
                        'INSERT INTO amenidades (nombre) VALUES (?)',
                        [amenidad]
                    );
                    idAmenidad = nuevaAmenidad.insertId;
                }
                
                // Insertar en la tabla intermedia
                await conex.execute(
                    'INSERT INTO hotel_amenidades (id_hotel, id_amenidad) VALUES (?, ?)',
                    [id, idAmenidad]
                );
            }
        }
        
        // Confirmar transacción
        await conex.commit();
        
        // Obtener las amenidades para incluirlas en la respuesta
        const [amenidadesHotel] = await conex.execute(
            'SELECT a.nombre FROM amenidades a ' +
            'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
            'WHERE ha.id_hotel = ?',
            [id]
        );
        
        const amenidadesString = amenidadesHotel.map(a => a.nombre).join(', ');
        
        res.json({
            id_hotel: parseInt(id),
            nombre,
            id_ciudad,
            rating,
            precio_noche,
            descripcion,
            ubicacion: ubicacion || '',
            amenidades: amenidadesString
        });
    } catch (err) {
        // Revertir transacción en caso de error
        await conex.rollback();
        handleError(res, 'Error al actualizar hotel', err);
    }
});

// Eliminar un hotel
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Iniciar transacción
        await conex.beginTransaction();
        
        // Eliminar las relaciones en la tabla intermedia
        await conex.execute(
            'DELETE FROM hotel_amenidades WHERE id_hotel = ?',
            [id]
        );
        
        // Eliminar el hotel
        const [result] = await conex.execute(
            'DELETE FROM hoteles WHERE id_hotel = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            await conex.rollback();
            return handleError(res, 'Hotel no encontrado', null, 404);
        }
        
        // Confirmar transacción
        await conex.commit();
        
        res.json({ message: 'Hotel eliminado correctamente' });
    } catch (err) {
        // Revertir transacción en caso de error
        await conex.rollback();
        handleError(res, 'Error al eliminar hotel', err);
    }
});

module.exports = router;