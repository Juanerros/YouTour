class HotelesService {
    constructor(conex) {
        this.conex = conex;
    }

    async getAllAmenidades() {
        const [amenidades] = await this.conex.execute('SELECT * FROM amenidades');
        return amenidades || [];
    }

    async getAmenidadesByHotel(hotelId) {
        const [amenidades] = await this.conex.execute(
            'SELECT a.* FROM amenidades a ' +
            'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
            'WHERE ha.id_hotel = ?',
            [hotelId]
        );
        return amenidades;
    }

    async getAllHoteles() {
        const [hoteles] = await this.conex.execute(
            'SELECT h.*, c.nombre as ciudad, c.id_pais, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais'
        );
        
        // Obtener amenidades para cada hotel
        for (let hotel of hoteles) {
            const [amenidades] = await this.conex.execute(
                'SELECT a.id_amenidad, a.nombre FROM amenidades a ' +
                'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
                'WHERE ha.id_hotel = ?',
                [hotel.id_hotel]
            );
            hotel.amenidades = amenidades.map(a => a.nombre).join(', ');
        }
        
        return hoteles;
    }

    async getHotelesByCiudad(ciudadId) {
        const [hoteles] = await this.conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.id_ciudad = ?',
            [ciudadId]
        );
        return hoteles;
    }

    async getHotelesByPais(paisId) {
        const [hoteles] = await this.conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_pais = ?',
            [paisId]
        );
        return hoteles;
    }

    async getHotelesByPrecio(min, max) {
        const [hoteles] = await this.conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.precio_noche BETWEEN ? AND ?',
            [min, max]
        );
        return hoteles;
    }

    async getHotelById(hotelId) {
        const [hotel] = await this.conex.execute(
            'SELECT h.*, c.nombre as ciudad, p.nombre as pais ' +
            'FROM hoteles h ' +
            'INNER JOIN ciudades c ON h.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE h.id_hotel = ?',
            [hotelId]
        );
        return hotel[0];
    }

    async validateCiudadExists(ciudadId) {
        const [ciudad] = await this.conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [ciudadId]
        );
        return ciudad.length > 0;
    }

    async createHotel(nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion) {
        const [result] = await this.conex.execute(
            'INSERT INTO hoteles (nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion || '']
        );
        return result.insertId;
    }

    async updateHotel(hotelId, nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion) {
        const [result] = await this.conex.execute(
            'UPDATE hoteles SET nombre = ?, id_ciudad = ?, rating = ?, precio_noche = ?, descripcion = ?, ubicacion = ? WHERE id_hotel = ?',
            [nombre, id_ciudad, rating, precio_noche, descripcion, ubicacion || '', hotelId]
        );
        return result.affectedRows;
    }

    async deleteHotel(hotelId) {
        const [result] = await this.conex.execute(
            'DELETE FROM hoteles WHERE id_hotel = ?',
            [hotelId]
        );
        return result.affectedRows;
    }

    async getOrCreateAmenidad(nombreAmenidad) {
        const [amenidadExistente] = await this.conex.execute(
            'SELECT id_amenidad FROM amenidades WHERE nombre = ?',
            [nombreAmenidad]
        );
        
        if (amenidadExistente.length > 0) {
            return amenidadExistente[0].id_amenidad;
        } else {
            const [nuevaAmenidad] = await this.conex.execute(
                'INSERT INTO amenidades (nombre) VALUES (?)',
                [nombreAmenidad]
            );
            return nuevaAmenidad.insertId;
        }
    }

    async addHotelAmenidad(hotelId, amenidadId) {
        await this.conex.execute(
            'INSERT INTO hotel_amenidades (id_hotel, id_amenidad) VALUES (?, ?)',
            [hotelId, amenidadId]
        );
    }

    async removeAllHotelAmenidades(hotelId) {
        await this.conex.execute(
            'DELETE FROM hotel_amenidades WHERE id_hotel = ?',
            [hotelId]
        );
    }

    async getHotelAmenidadesString(hotelId) {
        const [amenidadesHotel] = await this.conex.execute(
            'SELECT a.nombre FROM amenidades a ' +
            'INNER JOIN hotel_amenidades ha ON a.id_amenidad = ha.id_amenidad ' +
            'WHERE ha.id_hotel = ?',
            [hotelId]
        );
        return amenidadesHotel.map(a => a.nombre).join(', ');
    }

    async beginTransaction() {
        await this.conex.beginTransaction();
    }

    async commit() {
        await this.conex.commit();
    }

    async rollback() {
        await this.conex.rollback();
    }
}

export default HotelesService;