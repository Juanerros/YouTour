class PaquetesService {
    constructor(conex) {
        this.conex = conex;
    }

    getAllPaquetes = async () => {
        try {
            const [paquetes] = await this.conex.execute(
                'SELECT * FROM paquetes WHERE esta_reservado = 0'
            );

            return paquetes;
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al obtener paquetes:', err);
            throw { status: 500, message: 'Error al obtener paquetes', cause: err };
        }
    }

    getPaqueteById = async (id) => {
        try {
            const [paquete] = await this.conex.execute(
                'SELECT * FROM paquetes WHERE id_paquete = ?',
                [id]
            );

            if (paquete.length === 0) throw { status: 404, message: 'Paquete no encontrado' };

            return paquete[0];
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al obtener paquete por id:', err);
            throw { status: 500, message: 'Error al obtener paquete por id', cause: err };
        }
    }

    getPaquetesDetallados = async () => {
        try {
            console.log('Iniciando getPaquetesDetallados optimizado');
            
            // Obtener todos los paquetes con sus detalles en una sola consulta optimizada
            const [paquetesData] = await this.conex.execute(`
                SELECT 
                    p.*,
                    v.id_vuelo,
                    v.salida,
                    v.llegada,
                    v.precio as precio_vuelo,
                    origen.nombre as origen_nombre,
                    origen.codigo_aeropuerto as origen_codigo,
                    destino.nombre as destino_nombre,
                    destino.codigo_aeropuerto as destino_codigo,
                    destino_pais.id_pais as destino_id_pais,
                    destino_pais.nombre as destino_pais_nombre,
                    h.id_hotel,
                    h.nombre as hotel_nombre,
                    h.rating,
                    hotel_ciudad.nombre as hotel_ciudad_nombre,
                    hotel_pais.nombre as hotel_pais_nombre
                FROM paquetes p
                LEFT JOIN vuelos v ON p.id_vuelo = v.id_vuelo
                LEFT JOIN ciudades origen ON v.origen = origen.id_ciudad
                LEFT JOIN ciudades destino ON v.destino = destino.id_ciudad
                LEFT JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais
                LEFT JOIN paquete_hoteles ph ON p.id_paquete = ph.id_paquete
                LEFT JOIN hoteles h ON ph.id_hotel = h.id_hotel
                LEFT JOIN ciudades hotel_ciudad ON h.id_ciudad = hotel_ciudad.id_ciudad
                LEFT JOIN paises hotel_pais ON hotel_ciudad.id_pais = hotel_pais.id_pais
                WHERE p.esta_reservado = 0
                ORDER BY p.id_paquete
            `);

            // Obtener actividades de todos los paquetes de una vez
            const [actividadesData] = await this.conex.execute(`
                SELECT 
                    pa.id_paquete,
                    a.id_actividad,
                    a.nombre as actividad_nombre,
                    a.descripcion as actividad_descripcion,
                    a.precio as actividad_precio,
                    c.nombre as ciudad_nombre,
                    p.nombre as pais_nombre
                FROM paquete_actividades pa
                INNER JOIN actividades a ON pa.id_actividad = a.id_actividad
                INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad
                INNER JOIN paises p ON c.id_pais = p.id_pais
                WHERE pa.id_paquete IN (
                    SELECT id_paquete FROM paquetes WHERE esta_reservado = 0
                )
            `);

            // Obtener servicios de todos los paquetes de una vez
            const [serviciosData] = await this.conex.execute(`
                SELECT * FROM servicios 
                WHERE id_paquete IN (
                    SELECT id_paquete FROM paquetes WHERE esta_reservado = 0
                )
            `);

            // Procesar los datos para crear la estructura final
            const paquetesMap = new Map();
            const actividadesPorPaquete = new Map();
            const serviciosPorPaquete = new Map();

            // Agrupar actividades por paquete
            actividadesData.forEach(actividad => {
                if (!actividadesPorPaquete.has(actividad.id_paquete)) {
                    actividadesPorPaquete.set(actividad.id_paquete, []);
                }
                actividadesPorPaquete.get(actividad.id_paquete).push({
                    id_actividad: actividad.id_actividad,
                    nombre: actividad.actividad_nombre,
                    descripcion: actividad.actividad_descripcion,
                    precio: actividad.actividad_precio,
                    ciudad_nombre: actividad.ciudad_nombre,
                    pais_nombre: actividad.pais_nombre
                });
            });

            // Agrupar servicios por paquete
            serviciosData.forEach(servicio => {
                if (!serviciosPorPaquete.has(servicio.id_paquete)) {
                    serviciosPorPaquete.set(servicio.id_paquete, []);
                }
                serviciosPorPaquete.get(servicio.id_paquete).push(servicio);
            });

            // Procesar paquetes y crear estructura final
            paquetesData.forEach(row => {
                if (!paquetesMap.has(row.id_paquete)) {
                    paquetesMap.set(row.id_paquete, {
                        id_paquete: row.id_paquete,
                        nombre: row.nombre,
                        descripcion: row.descripcion,
                        precio_base: row.precio_base,
                        duracion_dias: row.duracion_dias,
                        cantidad_personas: row.cantidad_personas,
                        fecha_inicio: row.fecha_inicio,
                        fecha_fin: row.fecha_fin,
                        imagen: row.imagen,
                        vuelo: row.id_vuelo ? {
                            id_vuelo: row.id_vuelo,
                            fecha_salida: row.fecha_salida,
                            fecha_llegada: row.fecha_llegada,
                            precio: row.precio_vuelo,
                            origen_nombre: row.origen_nombre,
                            origen_codigo: row.origen_codigo,
                            destino_nombre: row.destino_nombre,
                            destino_codigo: row.destino_codigo,
                            destino_id_pais: row.destino_id_pais,
                            destino_pais_nombre: row.destino_pais_nombre
                        } : null,
                        hotel: row.id_hotel ? {
                            id_hotel: row.id_hotel,
                            nombre: row.hotel_nombre,
                            rating: row.rating,
                            direccion: row.hotel_direccion,
                            telefono: row.hotel_telefono,
                            imagen: row.hotel_imagen,
                            ciudad_nombre: row.hotel_ciudad_nombre,
                            pais_nombre: row.hotel_pais_nombre
                        } : null,
                        actividades: actividadesPorPaquete.get(row.id_paquete) || [],
                        servicios: serviciosPorPaquete.get(row.id_paquete) || []
                    });
                }
            });

            const paquetesDetallados = Array.from(paquetesMap.values());
            console.log('Paquetes detallados procesados:', paquetesDetallados.length);
            return paquetesDetallados;

        } catch (err) {
            if (err.status) throw err;
            console.error('Error al obtener paquetes detallados:', err);
            throw { status: 500, message: 'Error al obtener paquetes detallados', cause: err };
        }
    }

    getPaqueteDetallado = async (id) => {
        try {
            // Obtener información básica del paquete
            const paquete = await this.getPaqueteById(id);

            // Obtener vuelos del paquete
            const [vuelos] = await this.conex.execute(
                'SELECT v.*, ' +
                'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
                'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
                'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
                'FROM paquetes p ' +
                'INNER JOIN vuelos v ON p.id_vuelo = v.id_vuelo ' +
                'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
                'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
                'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais ' +
                'WHERE p.id_paquete = ?',
                [id]
            );

            // Obtener hoteles del paquete con amenidades
            const [hoteles] = await this.conex.execute(
                'SELECT h.*, c.nombre as ciudad_nombre, p.nombre as pais_nombre ' +
                'FROM paquete_hoteles ph ' +
                'INNER JOIN hoteles h ON ph.id_hotel = h.id_hotel ' +
                'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
                'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
                'WHERE ph.id_paquete = ?',
                [id]
            );

            // Para cada hotel, obtener sus amenidades
            for (let hotel of hoteles) {
                const [amenidades] = await this.conex.execute(
                    'SELECT a.* FROM hotel_amenidades ha ' +
                    'INNER JOIN amenidades a ON ha.id_amenidad = a.id_amenidad ' +
                    'WHERE ha.id_hotel = ?',
                    [hotel.id_hotel]
                );
                hotel.amenidades = amenidades;
            }

            // Obtener actividades del paquete
            const [actividades] = await this.conex.execute(
                'SELECT a.*, c.nombre as ciudad_nombre, p.nombre as pais_nombre ' +
                'FROM paquete_actividades pa ' +
                'INNER JOIN actividades a ON pa.id_actividad = a.id_actividad ' +
                'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
                'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
                'WHERE pa.id_paquete = ?',
                [id]
            );

            const [services] = await this.conex.execute(
                'SELECT * FROM servicios WHERE id_paquete = ?',
                [id]
            );

            return {
                ...paquete,
                vuelo: vuelos[0],
                hotel: hoteles[0],
                actividades,
                servicios: services
            };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al obtener paquete detallado:', err);
            throw { status: 500, message: 'Error al obtener paquete detallado', cause: err };
        }
    }

    createPaquete = async (paqueteData) => {
        try {
            const {
                nombre,
                descripcion,
                precio_base,
                duracion_dias,
                cantidad_personas,
                fecha_inicio,
                fecha_fin,
                vuelo_id,
                hotel_id,
                id_status = 1
            } = paqueteData;

            // Crear el paquete básico
            const [result] = await this.conex.execute(
                'INSERT INTO paquetes (nombre, descripcion, precio_base, duracion_dias, cantidad_personas, fecha_inicio, fecha_fin, id_vuelo, id_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nombre, descripcion, precio_base, duracion_dias, cantidad_personas, fecha_inicio, fecha_fin, vuelo_id || null, id_status]
            );

            const paqueteId = result.insertId;

            // Si hay hotel_id, agregarlo al paquete con las fechas del paquete
            if (hotel_id) {
                await this.conex.execute(
                    'INSERT INTO paquete_hoteles (id_paquete, id_hotel, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?)',
                    [paqueteId, hotel_id, fecha_inicio, fecha_fin]
                );
            }

            return {
                id_paquete: paqueteId,
                nombre,
                descripcion,
                precio_base,
                duracion_dias,
                cantidad_personas,
                fecha_inicio,
                fecha_fin,
                vuelo_id,
                hotel_id,
                id_status
            };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al crear paquete:', err);
            throw { status: 500, message: 'Error al crear paquete', cause: err };
        }
    }

    addVueloToPaquete = async (id_paquete, id_vuelo) => {
        try {

            // Verificar que el paquete exista
            await this.getPaqueteById(id_paquete);

            // Verificar que el vuelo exista
            const [vuelo] = await this.conex.execute(
                'SELECT * FROM vuelos WHERE id_vuelo = ?',
                [id_vuelo]
            );

            if (vuelo.length === 0)
                throw {
                    status: 404,
                    message: 'Vuelo no encontrado'
                }


            const [result] = await this.conex.execute(
                'UPDATE paquetes SET id_vuelo = ? WHERE id_paquete = ?',
                [id_vuelo, id_paquete]
            );

            return { message: 'Vuelo agregado al paquete correctamente' };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al agregar vuelo al paquete:', err);
            throw { status: 500, message: 'Error al agregar vuelo al paquete', cause: err };
        }
    }

    addHotelToPaquete = async (id_paquete, id_hotel) => {
        try {
            // Verificar que el paquete exista
            const paquete = await this.getPaqueteById(id_paquete);

            // Verificar que el hotel exista
            const [hotel] = await this.conex.execute(
                'SELECT * FROM hoteles WHERE id_hotel = ?',
                [id_hotel]
            );

            if (hotel.length === 0)
                throw {
                    status: 404,
                    message: 'Hotel no encontrado'
                }

            // Usar las fechas del paquete para la relación hotel-paquete
            const [result] = await this.conex.execute(
                'INSERT INTO paquete_hoteles (id_paquete, id_hotel, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?)',
                [id_paquete, id_hotel, paquete.fecha_inicio, paquete.fecha_fin]
            );

            return { message: 'Hotel agregado al paquete correctamente' };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al agregar hotel al paquete:', err);
            throw { status: 500, message: 'Error al agregar hotel al paquete', cause: err };
        }
    }

    addActividadToPaquete = async (id_paquete, id_actividad) => {
        try {
            // Verificar que el paquete exista
            await this.getPaqueteById(id_paquete);

            // Verificar que la actividad exista
            const [actividad] = await this.conex.execute(
                'SELECT a.*, c.id_pais FROM actividades a ' +
                'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
                'WHERE a.id_actividad = ?',
                [id_actividad]
            );

            if (actividad.length === 0)
                throw {
                    status: 404,
                    message: 'Actividad no encontrada'
                }


            const [result] = await this.conex.execute(
                'INSERT INTO paquete_actividades (id_paquete, id_actividad) VALUES (?, ?)',
                [id_paquete, id_actividad]
            );

            return { message: 'Actividad agregada al paquete correctamente' };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al agregar actividad al paquete:', err);
            throw { status: 500, message: 'Error al agregar actividad al paquete', cause: err };
        }
    }

    updatePaquete = async (id, paqueteData) => {
        try {
            // Verificar que el paquete exista
            await this.getPaqueteById(id);

            const {
                nombre,
                descripcion,
                precio_base,
                duracion_dias,
                cantidad_personas,
                fecha_inicio,
                fecha_fin,
                vuelo_id,
                hotel_id
            } = paqueteData;

            // Actualizar el paquete básico
            await this.conex.execute(
                'UPDATE paquetes SET nombre = ?, descripcion = ?, precio_base = ?, duracion_dias = ?, cantidad_personas = ?, fecha_inicio = ?, fecha_fin = ?, id_vuelo = ? WHERE id_paquete = ?',
                [nombre, descripcion, precio_base, duracion_dias, cantidad_personas, fecha_inicio, fecha_fin, vuelo_id || null, id]
            );

            // Manejar la relación con el hotel
            if (hotel_id) {
                // Verificar si ya existe una relación hotel-paquete
                const [existingHotel] = await this.conex.execute(
                    'SELECT * FROM paquete_hoteles WHERE id_paquete = ?',
                    [id]
                );

                if (existingHotel.length > 0) {
                    // Si existe, actualizar la relación con las nuevas fechas
                    await this.conex.execute(
                        'UPDATE paquete_hoteles SET id_hotel = ?, fecha_entrada = ?, fecha_salida = ? WHERE id_paquete = ?',
                        [hotel_id, fecha_inicio, fecha_fin, id]
                    );
                } else {
                    // Si no existe, insertar nueva relación con las fechas
                    await this.conex.execute(
                        'INSERT INTO paquete_hoteles (id_paquete, id_hotel, fecha_entrada, fecha_salida) VALUES (?, ?, ?, ?)',
                        [id, hotel_id, fecha_inicio, fecha_fin]
                    );
                }
            } else {
                // Si no hay hotel_id, eliminar cualquier relación existente
                await this.conex.execute(
                    'DELETE FROM paquete_hoteles WHERE id_paquete = ?',
                    [id]
                );
            }

            // Obtener el paquete actualizado
            return await this.getPaqueteById(id);
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al actualizar paquete:', err);
            throw { status: 500, message: 'Error al actualizar paquete', cause: err };
        }
    }

    deleteActividadFromPaquete = async (id_paquete, id_actividad) => {
        try {

            // Verificar que el paquete exista
            await this.getPaqueteById(id_paquete);

            // Verificar que la actividad esté en el paquete
            const [actividadEnPaquete] = await this.conex.execute(
                'SELECT * FROM paquete_actividades WHERE id_paquete = ? AND id_actividad = ?',
                [id_paquete, id_actividad]
            );

            if (actividadEnPaquete.length === 0)
                throw {
                    status: 404,
                    message: 'Actividad no encontrada en el paquete'
                }

            await this.conex.execute(
                'DELETE FROM paquete_actividades WHERE id_paquete = ? AND id_actividad = ?',
                [id_paquete, id_actividad]
            );

            return { message: 'Actividad eliminada del paquete correctamente' };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al eliminar actividad del paquete:', err);
            throw { status: 500, message: 'Error al eliminar actividad del paquete', cause: err };
        }
    }

    deletePaquete = async (id) => {
        try {
            // Verificar que el paquete exista
            await this.getPaqueteById(id);

            // Eliminar hoteles del paquete
            await this.conex.execute(
                'DELETE FROM paquete_hoteles WHERE id_paquete = ?',
                [id]
            );

            // Eliminar actividades del paquete
            await this.conex.execute(
                'DELETE FROM paquete_actividades WHERE id_paquete = ?',
                [id]
            );

            // Eliminar el paquete
            await this.conex.execute(
                'DELETE FROM paquetes WHERE id_paquete = ?',
                [id]
            );

            return { message: 'Paquete eliminado correctamente' };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error al eliminar paquete:', err);
            throw { status: 500, message: 'Error al eliminar paquete', cause: err };
        }
    }
}

export default PaquetesService;