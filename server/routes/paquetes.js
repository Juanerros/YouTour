const { createConnection, handleError, express } = require('../config/setup');
const router = express.Router();

//función asíncrona para crear la conexión a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

// Obtener todos los paquetes
router.get('/', async (req, res) => {
    try {
        const [paquetes] = await conex.execute(
            'SELECT * FROM paquetes'
        );
        res.json(paquetes);
    } catch (err) {
        handleError(res, 'Error al obtener paquetes', err);
    }
});

// Obtener un paquete específico con todos sus detalles
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener información básica del paquete
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Obtener vuelos del paquete
        const [vuelos] = await conex.execute(
            'SELECT v.*, pv.id_paquete_vuelo, ' +
            'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
            'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
            'destino.id_pais as destino_id_pais ' +  // <- Añadir esta línea
            'FROM paquete_vuelos pv ' +
            'INNER JOIN vuelos v ON pv.id_vuelo = v.id_vuelo ' +
            'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
            'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
            'WHERE pv.id_paquete = ?',
            [id]
        );
        
        // Obtener hoteles del paquete
        const [hoteles] = await conex.execute(
            'SELECT h.*, ph.id_paquete_hotel, ph.fecha_entrada, ph.fecha_salida, ' +
            'c.nombre as ciudad, p.nombre as pais ' +
            'FROM paquete_hoteles ph ' +
            'INNER JOIN hoteles h ON ph.id_hotel = h.id_hotel ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE ph.id_paquete = ?',
            [id]
        );
        
        // Obtener actividades del paquete
        const [actividades] = await conex.execute(
            'SELECT a.*, pa.id_paquete_actividad, pa.fecha, pa.hora, pa.incluido_base, ' +
            'tipo, c.nombre as ciudad, p.nombre as pais' +
            'FROM paquete_actividades pa ' +
            'INNER JOIN actividades a ON pa.id_actividad = a.id_actividad '+
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE pa.id_paquete = ?',
            [id]
        );
        
        // Obtener personas del paquete
        const [personas] = await conex.execute(
            'SELECT * FROM paquete_personas WHERE id_paquete = ?',
            [id]
        );
        
        // Obtener estado actual del paquete
        const [estados] = await conex.execute(
            'SELECT ps.*, pe.nombre as estado_nombre ' +
            'FROM paquete_seguimiento ps ' +
            'INNER JOIN paquete_estados pe ON ps.id_estado = pe.id_estado ' +
            'WHERE ps.id_paquete = ? ' +
            'ORDER BY ps.fecha_cambio DESC LIMIT 1',
            [id]
        );
        
        const estadoActual = estados.length > 0 ? estados[0] : null;
        
        // Construir respuesta completa
        const paqueteCompleto = {
            ...paquete[0],
            vuelos,
            hoteles,
            actividades,
            personas,
            estado: estadoActual
        };
        
        res.json(paqueteCompleto);
    } catch (err) {
        handleError(res, 'Error al obtener detalles del paquete', err);
    }
});

// En el router de hoteles, añadir este nuevo endpoint:
router.get('/por-vuelo/:idVuelo', async (req, res) => {
    const { idVuelo } = req.params;
    try {
        // Primero obtener el país de destino del vuelo
        const [vuelo] = await conex.execute(
            'SELECT c.id_pais FROM vuelos v ' +
            'INNER JOIN ciudades c ON v.destino = c.id_ciudad ' +
            'WHERE v.id_vuelo = ?',
            [idVuelo]
        );
        
        if (vuelo.length === 0) {
            return handleError(res, 'Vuelo no encontrado', null, 404);
        }
        
        const idPais = vuelo[0].id_pais;
        
        // Luego obtener los hoteles de ese país
        const [hoteles] = await conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_pais = ?',
            [idPais]
        );
        
        res.json(hoteles);
    } catch (err) {
        handleError(res, 'Error al obtener hoteles por vuelo', err);
    }
});

// Crear un nuevo paquete
router.post('/', async (req, res) => {
    const { 
        nombre, 
        descripcion, 
        duracion_dias, 
        precio_base, 
        cantidad_personas, 
        fecha_inicio, 
        fecha_fin,
        vuelo_id,
        hotel_id,
        fecha_entrada_hotel,
        fecha_salida_hotel,
        personas
    } = req.body;
    
    if (!nombre || !duracion_dias || !precio_base || !fecha_inicio || !fecha_fin || !vuelo_id || !hotel_id) {
        return handleError(res, 'Faltan campos requeridos para crear el paquete', null, 400);
    }
    
    try {
        
        // Crear paquete base
        const [resultPaquete] = await conex.execute(
            'INSERT INTO paquetes (nombre, descripcion, duracion_dias, precio_base, cantidad_personas, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, duracion_dias, precio_base, cantidad_personas || 1, fecha_inicio, fecha_fin]
        );
        
        const idPaquete = resultPaquete.insertId;
        
        // Agregar vuelo al paquete
        await conex.execute(
            'INSERT INTO paquete_vuelos (id_paquete, id_vuelo) VALUES (?, ?)',
            [idPaquete, vuelo_id]
        );
        
        // Agregar hotel al paquete
        await conex.execute(
            'INSERT INTO paquete_hoteles (id_paquete, id_hotel, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?)',
            [idPaquete, hotel_id, fecha_entrada_hotel || fecha_inicio, fecha_salida_hotel || fecha_fin]
        );
        
        // Agregar personas si se proporcionaron
        if (personas && Array.isArray(personas) && personas.length > 0) {
            for (const persona of personas) {
                await conex.execute(
                    'INSERT INTO paquete_personas (id_paquete, nombre, apellido, documento, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [idPaquete, persona.nombre, persona.apellido, persona.documento, persona.fecha_nacimiento, persona.email, persona.telefono]
                );
            }
        }
        
        res.status(201).json({
            id_paquete: idPaquete,
            mensaje: 'Paquete creado exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al crear paquete', err);
    }
});

// Agregar actividad a un paquete
router.post('/:id/actividades', async (req, res) => {
    const { id } = req.params;
    const { id_actividad, fecha, hora, incluido_base } = req.body;
    
    if (!id_actividad) {
        return handleError(res, 'ID de actividad requerido', null, 400);
    }
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Verificar que la actividad exista
        const [actividad] = await conex.execute(
            'SELECT a.*, c.id_pais FROM actividades a INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad WHERE a.id_actividad = ?',
            [id_actividad]
        );
        
        if (actividad.length === 0) {
            return handleError(res, 'Actividad no encontrada', null, 404);
        }
        
        // Verificar que la actividad corresponda a alguna ciudad del paquete
        const [destinos] = await conex.execute(
            'SELECT c.id_ciudad, c.id_pais FROM paquete_vuelos pv ' +
            'INNER JOIN vuelos v ON pv.id_vuelo = v.id_vuelo ' +
            'INNER JOIN ciudades c ON v.destino = c.id_ciudad ' +
            'WHERE pv.id_paquete = ?',
            [id]
        );
        
        const [hotelesDestino] = await conex.execute(
            'SELECT c.id_ciudad, c.id_pais FROM paquete_hoteles ph ' +
            'INNER JOIN hoteles h ON ph.id_hotel = h.id_hotel ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'WHERE ph.id_paquete = ?',
            [id]
        );
        
        // Combinar destinos de vuelos y hoteles
        const todosDestinos = [...destinos, ...hotelesDestino];
        
        // Verificar si la actividad está en alguno de los destinos del paquete
        const actividadValida = todosDestinos.some(destino => 
            destino.id_ciudad === actividad[0].id_ciudad || destino.id_pais === actividad[0].id_pais
        );
        
        if (!actividadValida) {
            return handleError(res, 'La actividad no corresponde a ningún destino del paquete', null, 400);
        }
        
        // Agregar actividad al paquete
        const [result] = await conex.execute(
            'INSERT INTO paquete_actividades (id_paquete, id_actividad, fecha, hora, incluido_base) VALUES (?, ?, ?, ?, ?)',
            [id, id_actividad, fecha || null, hora || null, incluido_base || false]
        );
        
        res.status(201).json({
            id_paquete_actividad: result.insertId,
            mensaje: 'Actividad agregada al paquete exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al agregar actividad al paquete', err);
    }
});

// Agregar persona a un paquete
router.post('/:id/personas', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, documento, fecha_nacimiento, email, telefono } = req.body;
    
    if (!nombre || !apellido || !documento) {
        return handleError(res, 'Nombre, apellido y documento son requeridos', null, 400);
    }
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Agregar persona al paquete
        const [result] = await conex.execute(
            'INSERT INTO paquete_personas (id_paquete, nombre, apellido, documento, fecha_nacimiento, email, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, nombre, apellido, documento, fecha_nacimiento || null, email || null, telefono || null]
        );
        
        // Actualizar cantidad de personas en el paquete
        await conex.execute(
            'UPDATE paquetes SET cantidad_personas = cantidad_personas + 1 WHERE id_paquete = ?',
            [id]
        );
        
        res.status(201).json({
            id_paquete_persona: result.insertId,
            mensaje: 'Persona agregada al paquete exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al agregar persona al paquete', err);
    }
});

// Cambiar estado de un paquete
router.post('/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { id_estado, notas } = req.body;
    
    if (!id_estado) {
        return handleError(res, 'ID de estado requerido', null, 400);
    }
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Verificar que el estado exista
        const [estado] = await conex.execute(
            'SELECT * FROM paquete_estados WHERE id_estado = ?',
            [id_estado]
        );
        
        if (estado.length === 0) {
            return handleError(res, 'Estado no encontrado', null, 404);
        }
        
        // Agregar nuevo estado al paquete
        const [result] = await conex.execute(
            'INSERT INTO paquete_seguimiento (id_paquete, id_estado, notas) VALUES (?, ?, ?)',
            [id, id_estado, notas || null]
        );
        
        res.status(201).json({
            id_seguimiento: result.insertId,
            mensaje: 'Estado del paquete actualizado exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al actualizar estado del paquete', err);
    }
});

// Actualizar un paquete
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        nombre, 
        descripcion, 
        duracion_dias, 
        precio_base, 
        fecha_inicio, 
        fecha_fin 
    } = req.body;
    
    if (!nombre || !duracion_dias || !precio_base || !fecha_inicio || !fecha_fin) {
        return handleError(res, 'Faltan campos requeridos para actualizar el paquete', null, 400);
    }
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Actualizar paquete
        const [result] = await conex.execute(
            'UPDATE paquetes SET nombre = ?, descripcion = ?, duracion_dias = ?, precio_base = ?, fecha_inicio = ?, fecha_fin = ? WHERE id_paquete = ?',
            [nombre, descripcion, duracion_dias, precio_base, fecha_inicio, fecha_fin, id]
        );
        
        res.json({
            id_paquete: parseInt(id),
            mensaje: 'Paquete actualizado exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al actualizar paquete', err);
    }
});

// Eliminar una actividad de un paquete
router.delete('/:id/actividades/:idActividad', async (req, res) => {
    const { id, idActividad } = req.params;
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Eliminar actividad del paquete
        const [result] = await conex.execute(
            'DELETE FROM paquete_actividades WHERE id_paquete = ? AND id_paquete_actividad = ?',
            [id, idActividad]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Actividad no encontrada en el paquete', null, 404);
        }
        
        res.json({
            mensaje: 'Actividad eliminada del paquete exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al eliminar actividad del paquete', err);
    }
});

// Eliminar una persona de un paquete
router.delete('/:id/personas/:idPersona', async (req, res) => {
    const { id, idPersona } = req.params;
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Eliminar persona del paquete
        const [result] = await conex.execute(
            'DELETE FROM paquete_personas WHERE id_paquete = ? AND id_paquete_persona = ?',
            [id, idPersona]
        );
        
        if (result.affectedRows === 0) {
            return handleError(res, 'Persona no encontrada en el paquete', null, 404);
        }
        
        // Actualizar cantidad de personas en el paquete
        await conex.execute(
            'UPDATE paquetes SET cantidad_personas = cantidad_personas - 1 WHERE id_paquete = ?',
            [id]
        );
        
        res.json({
            mensaje: 'Persona eliminada del paquete exitosamente'
        });
    } catch (err) {
        handleError(res, 'Error al eliminar persona del paquete', err);
    }
});

// Eliminar un paquete
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar que el paquete exista
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Iniciar transacción
        await conex.execute('START TRANSACTION');
        
        // Eliminar relaciones del paquete
        await conex.execute('DELETE FROM paquete_vuelos WHERE id_paquete = ?', [id]);
        await conex.execute('DELETE FROM paquete_hoteles WHERE id_paquete = ?', [id]);
        await conex.execute('DELETE FROM paquete_actividades WHERE id_paquete = ?', [id]);
        await conex.execute('DELETE FROM paquete_personas WHERE id_paquete = ?', [id]);
        await conex.execute('DELETE FROM paquete_seguimiento WHERE id_paquete = ?', [id]);
        
        // Eliminar paquete
        await conex.execute('DELETE FROM paquetes WHERE id_paquete = ?', [id]);
        
        // Confirmar transacción
        await conex.execute('COMMIT');
        
        res.json({
            mensaje: 'Paquete eliminado exitosamente'
        });
    } catch (err) {
        // Revertir transacción en caso de error
        await conex.execute('ROLLBACK');
        handleError(res, 'Error al eliminar paquete', err);
    }
});

// Obtener todos los estados de paquete
router.get('/estados/lista', async (req, res) => {
    try {
        const [estados] = await conex.execute('SELECT * FROM paquete_estados');
        res.json(estados);
    } catch (err) {
        handleError(res, 'Error al obtener estados de paquete', err);
    }
});

// Calcular precio total de un paquete (base + actividades adicionales)
router.get('/:id/precio', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Obtener información del paquete
        const [paquete] = await conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [id]
        );
        
        if (paquete.length === 0) {
            return handleError(res, 'Paquete no encontrado', null, 404);
        }
        
        // Obtener precio base y cantidad de personas
        const precioBase = parseFloat(paquete[0].precio_base);
        const cantidadPersonas = paquete[0].cantidad_personas;
        
        // Obtener actividades adicionales (no incluidas en el paquete base)
        const [actividades] = await conex.execute(
            'SELECT a.precio FROM paquete_actividades pa ' +
            'INNER JOIN actividades a ON pa.id_actividad = a.id_actividad ' +
            'WHERE pa.id_paquete = ? AND pa.incluido_base = 0',
            [id]
        );
        
        // Calcular precio total de actividades adicionales
        const precioActividades = actividades.reduce((total, act) => total + parseFloat(act.precio), 0);
        
        // Calcular precio total
        const precioTotal = (precioBase + precioActividades) * cantidadPersonas;
        
        res.json({
            precio_base: precioBase,
            precio_actividades_adicionales: precioActividades,
            cantidad_personas: cantidadPersonas,
            precio_total: precioTotal
        });
    } catch (err) {
        handleError(res, 'Error al calcular precio del paquete', err);
    }
});

module.exports = router;