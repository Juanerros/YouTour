import handleError from '../utils/handleError.js';

class HotelesController {
    constructor(hotelesService) {
        this.hotelesService = hotelesService;
    }

    getAllAmenidades = async (req, res) => {
        try {
            const amenidades = await this.hotelesService.getAllAmenidades();
            res.json(amenidades);
        } catch (err) {
            handleError(res, 'Error al obtener amenidades', err);
        };
    };

    getAmenidadesByHotel = async (req, res) => {
        try {
            const { id } = req.params;
            const amenidades = await this.hotelesService.getAmenidadesByHotel(id);
            res.json(amenidades);
        } catch (err) {
            handleError(res, 'Error al obtener amenidades del hotel', err);
        };
    };

    getAllHoteles = async (req, res) => {
        try {
            const hoteles = await this.hotelesService.getAllHoteles();
            res.json(hoteles);
        } catch (err) {
            handleError(res, 'Error al obtener hoteles', err);
        };
    };

    getHotelesByCiudad = async (req, res) => {
        try {
            const { id } = req.params;
            const hoteles = await this.hotelesService.getHotelesByCiudad(id);
            res.json(hoteles);
        } catch (err) {
            handleError(res, 'Error al obtener hoteles por ciudad', err);
        };
    };

    getHotelesByPais = async (req, res) => {
        try {
            const { id } = req.params;
            const hoteles = await this.hotelesService.getHotelesByPais(id);
            res.json(hoteles);
        } catch (err) {
            handleError(res, 'Error al obtener hoteles por país', err);
        };
    };

    getHotelesByPrecio = async (req, res) => {
        try {
            const { min, max } = req.params;
            const hoteles = await this.hotelesService.getHotelesByPrecio(min, max);
            res.json(hoteles);
        } catch (err) {
            handleError(res, 'Error al obtener hoteles por rango de precio', err);
        };
    };

    getHotelById = async (req, res) => {
        try {
            const { id } = req.params;
            const hotel = await this.hotelesService.getHotelById(id);

            if (!hotel) {
                return handleError(res, 'Hotel no encontrado', null, 404);
            }

            res.json(hotel);
        } catch (err) {
            handleError(res, 'Error al obtener hotel', err);
        };
    };

    createHotel = async (req, res) => {
        try {
            const { nombre, id_ciudad, rating, precio_noche, descripcion, amenidades, ubicacion } = req.body;

            if (!nombre || !id_ciudad || !rating || !precio_noche) {
                return handleError(res, 'Nombre, ciudad, rating y precio por noche son requeridos', null, 400);
            }

            // Verificar que la ciudad exista
            const ciudadExists = await this.hotelesService.validateCiudadExists(id_ciudad);
            if (!ciudadExists) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }

            // Crear el hotel
            const idHotel = await this.hotelesService.createHotel(nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion);

            // Procesar amenidades si existen
            if (amenidades && amenidades.length > 0) {
                const amenidadesArray = Array.isArray(amenidades) ? amenidades : amenidades.split(',').map(a => a.trim());

                for (const amenidad of amenidadesArray) {
                    const idAmenidad = await this.hotelesService.getOrCreateAmenidad(amenidad);
                    await this.hotelesService.addHotelAmenidad(idHotel, idAmenidad);
                }
            }

            // Obtener las amenidades para incluirlas en la respuesta
            const amenidadesString = await this.hotelesService.getHotelAmenidadesString(idHotel);

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
        };
    };

    updateHotel = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, id_ciudad, rating, precio_noche, descripcion, amenidades, ubicacion } = req.body;

            if (!nombre || !id_ciudad || !rating || !precio_noche) {
                return handleError(res, 'Nombre, ciudad, rating y precio por noche son requeridos', null, 400);
            }

            // Verificar que la ciudad exista
            const ciudadExists = await this.hotelesService.validateCiudadExists(id_ciudad);
            if (!ciudadExists) {
                return handleError(res, 'Ciudad no encontrada', null, 404);
            }

            // Verificar que el hotel exista
            const hotelExists = await this.hotelesService.getHotelById(id);
            if (!hotelExists) {
                return handleError(res, 'Hotel no encontrado', null, 404);
            }

            // Iniciar transacción
            await this.hotelesService.beginTransaction();

            try {
                // Actualizar el hotel
                await this.hotelesService.updateHotel(id, nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion);

                // Eliminar las amenidades existentes para este hotel
                await this.hotelesService.removeAllHotelAmenidades(id);

                // Insertar las nuevas amenidades
                if (amenidades && amenidades.length > 0) {
                    const amenidadesArray = Array.isArray(amenidades) ? amenidades : amenidades.split(',').map(a => a.trim());

                    for (const amenidad of amenidadesArray) {
                        const idAmenidad = await this.hotelesService.getOrCreateAmenidad(amenidad);
                        await this.hotelesService.addHotelAmenidad(id, idAmenidad);
                    }
                }

                // Confirmar transacción
                await this.hotelesService.commit();

                // Obtener las amenidades para incluirlas en la respuesta
                const amenidadesString = await this.hotelesService.getHotelAmenidadesString(id);

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
                await this.hotelesService.rollback();
                throw err;
            }
        } catch (err) {
            handleError(res, 'Error al actualizar hotel', err);
        };
    };

    deleteHotel = async (req, res) => {
        try {
            const { id } = req.params;

            // Iniciar transacción
            await this.hotelesService.beginTransaction();

            try {
                // Eliminar las relaciones en la tabla intermedia
                await this.hotelesService.removeAllHotelAmenidades(id);

                // Eliminar el hotel
                const affectedRows = await this.hotelesService.deleteHotel(id);

                if (affectedRows === 0) {
                    await this.hotelesService.rollback();
                    return handleError(res, 'Hotel no encontrado', null, 404);
                }

                // Confirmar transacción
                await this.hotelesService.commit();

                res.json({ message: 'Hotel eliminado correctamente' });
            } catch (err) {
                // Revertir transacción en caso de error
                await this.hotelesService.rollback();
                throw err;
            }
        } catch (err) {
            handleError(res, 'Error al eliminar hotel', err);
        }
    }
}

export default HotelesController;