class ActividadesService {
    constructor(conex) {
        this.conex = conex;
    }

    async getAllActividades() {
        const [actividades] = await this.conex.execute(
            'SELECT * FROM actividades'
        );
        return actividades;
    }

    async getActividadesByCiudad(ciudadId) {
        const [actividades] = await this.conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_ciudad = ?',
            [ciudadId]
        );
        return actividades;
    }

    async getActividadesByPais(paisId) {
        const [actividades] = await this.conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE c.id_pais = ?',
            [paisId]
        );
        return actividades;
    }

    async getActividadesByTipo(tipoId) {
        const [actividades] = await this.conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_tipo = ?',
            [tipoId]
        );
        return actividades;
    }

    async getActividadById(actividadId) {
        const [actividad] = await this.conex.execute(
            'SELECT a.*, t.nombre as tipo, c.nombre as ciudad, p.nombre as pais, d.nombre as dificultad ' +
            'FROM actividades a ' +
            'INNER JOIN tipos_actividad t ON a.id_tipo = t.id_tipo ' +
            'INNER JOIN ciudades c ON a.id_ciudad = c.id_ciudad ' +
            'INNER JOIN paises p ON c.id_pais = p.id_pais ' +
            'INNER JOIN niveles_dificultad d ON a.id_dificultad = d.id_nivel ' +
            'WHERE a.id_actividad = ?',
            [actividadId]
        );
        return actividad[0];
    }

    async validateCiudadExists(ciudadId) {
        const [ciudad] = await this.conex.execute(
            'SELECT * FROM ciudades WHERE id_ciudad = ?',
            [ciudadId]
        );
        return ciudad.length > 0;
    }

    async validateTipoExists(tipoId) {
        const [tipo] = await this.conex.execute(
            'SELECT * FROM tipos_actividad WHERE id_tipo = ?',
            [tipoId]
        );
        return tipo.length > 0;
    }

    async createActividad(actividadData) {
        const { nombre, tipo, id_ciudad, precio, duracion, descripcion } = actividadData;
        const [result] = await this.conex.execute(
            'INSERT INTO actividades (nombre, tipo, id_ciudad, precio, duracion, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, tipo, id_ciudad, precio, duracion, descripcion]
        );
        return result.insertId;
    }

    async updateActividad(actividadId, actividadData) {
        const { nombre, id_tipo, id_ciudad, precio, duracion, descripcion } = actividadData;
        const [result] = await this.conex.execute(
            'UPDATE actividades SET nombre = ?, id_tipo = ?, id_ciudad = ?, precio = ?, duracion = ?, descripcion = ? WHERE id_actividad = ?',
            [nombre, id_tipo, id_ciudad, precio, duracion, descripcion, actividadId]
        );
        return result.affectedRows > 0;
    }

    async deleteActividad(actividadId) {
        const [result] = await this.conex.execute(
            'DELETE FROM actividades WHERE id_actividad = ?',
            [actividadId]
        );
        return result.affectedRows > 0;
    }
}

export default ActividadesService;