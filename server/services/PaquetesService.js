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
            const paquetes = await this.getAllPaquetes();

            for (let paquete of paquetes) {
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
                    [paquete.id_paquete]
                );

                // Obtener hoteles del paquete con amenidades
                const [hoteles] = await this.conex.execute(
                    'SELECT h.*, c.nombre as ciudad_nombre, p.nombre as pais_nombre ' +
                    'FROM paquete_hoteles ph ' +
                    'INNER JOIN hoteles h ON ph.id_hotel = h.id_hotel ' +
                    'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
                    'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
                    'WHERE ph.id_paquete = ?',
                    [paquete.id_paquete]
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
                    [paquete.id_paquete]
                );

                return paquetes.map(paquete => ({
                    ...paquete,
                    vuelo: vuelos[0],
                    hoteles,
                    actividades,
                }));
            }
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

    createPaquete = async (nombre, descripcion, precio_base, id_status) => {
        try {
            // Verificar que el status exista
            const [status] = await this.conex.execute(
                'SELECT * FROM paquete_status WHERE id_status = ?',
                [id_status]
            );

            if (status.length === 0)
                throw {
                    status: 404,
                    message: 'Status no encontrado'
                }

            const [result] = await this.conex.execute(
                'INSERT INTO paquetes (nombre, descripcion, precio_base, id_status, cantidad_personas) VALUES (?, ?, ?, ?, 0)',
                [nombre, descripcion, precio_base, id_status]
            );

            return {
                id_paquete: result.insertId,
                nombre,
                descripcion,
                precio_base,
                id_status,
                cantidad_personas: 0
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
            await this.getPaqueteById(id_paquete);

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

            const [result] = await this.conex.execute(
                'INSERT INTO paquete_hoteles (id_paquete, id_hotel) VALUES (?, ?)',
                [id_paquete, id_hotel]
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

    updatePaquete = async (id, nombre, descripcion, precio_base) => {
        try {
            // Verificar que el paquete exista
            await this.getPaqueteById(id);

            await this.conex.execute(
                'UPDATE paquetes SET nombre = ?, descripcion = ?, precio_base = ? WHERE id_paquete = ?',
                [nombre, descripcion, precio_base, id]
            );

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