class CiudadesService {
    constructor(conex) {
        this.conex = conex;
    }

    async getAllCiudades() {
        const [ciudades] = await this.conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais'
        );
        return ciudades;
    }

    async getCiudadesByPais(paisId) {
        const [ciudades] = await this.conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_pais = ?',
            [paisId]
        );
        return ciudades;
    }

    async getCiudadById(ciudadId) {
        const [ciudad] = await this.conex.execute(
            'SELECT c.*, p.nombre as pais FROM ciudades c ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'WHERE c.id_ciudad = ?',
            [ciudadId]
        );
        return ciudad[0];
    }

    async createCiudad(nombre, codigo_aeropuerto, id_pais) {
        const [result] = await this.conex.execute(
            'INSERT INTO ciudades (nombre, codigo_aeropuerto, id_pais) VALUES (?, ?, ?)',
            [nombre, codigo_aeropuerto, id_pais]
        );
        return result.insertId;
    }

    async updateCiudad(ciudadId, nombre, codigo_aeropuerto, id_pais) {
        const [result] = await this.conex.execute(
            'UPDATE ciudades SET nombre = ?, codigo_aeropuerto = ?, id_pais = ? WHERE id_ciudad = ?',
            [nombre, codigo_aeropuerto, id_pais, ciudadId]
        );
        return result.affectedRows;
    }

    async deleteCiudad(ciudadId) {
        const [result] = await this.conex.execute(
            'DELETE FROM ciudades WHERE id_ciudad = ?',
            [ciudadId]
        );
        return result.affectedRows;
    }

    async checkVuelosAssociated(ciudadId) {
        const [vuelos] = await this.conex.execute(
            'SELECT COUNT(*) as count FROM vuelos WHERE origen = ? OR destino = ?',
            [ciudadId, ciudadId]
        );
        return vuelos[0].count > 0;
    }

    async checkHotelesAssociated(ciudadId) {
        const [hoteles] = await this.conex.execute(
            'SELECT COUNT(*) as count FROM hoteles WHERE id_ciudad = ?',
            [ciudadId]
        );
        return hoteles[0].count > 0;
    }

    async checkActividadesAssociated(ciudadId) {
        const [actividades] = await this.conex.execute(
            'SELECT COUNT(*) as count FROM actividades WHERE id_ciudad = ?',
            [ciudadId]
        );
        return actividades[0].count > 0;
    }

    async validatePaisExists(paisId) {
        const [pais] = await this.conex.execute(
            'SELECT id_pais FROM paises WHERE id_pais = ?',
            [paisId]
        );
        return pais.length > 0;
    }
}

export default CiudadesService;