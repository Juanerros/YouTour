class PaisesService {
    constructor(connection) {
        this.conex = connection;
    }

    // Métodos para continentes
    async getAllContinentes() {
        const [continentes] = await this.conex.execute('SELECT * FROM continentes');
        return continentes;
    }

    async createContinente(nombre) {
        // Verificar si el continente ya existe
        const [existingContinente] = await this.conex.execute(
            'SELECT * FROM continentes WHERE nombre = ?',
            [nombre]
        );
        
        if (existingContinente.length > 0) {
            throw new Error('El continente ya existe');
        }

        const [result] = await this.conex.execute(
            'INSERT INTO continentes (nombre) VALUES (?)',
            [nombre]
        );
        
        return {
            id_continente: result.insertId,
            nombre
        };
    }

    // Métodos para países
    async getAllPaises() {
        const [paises] = await this.conex.execute(
            'SELECT p.*, c.nombre as continente_nombre FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente'
        );
        return paises;
    }

    async getPaisesByContinente(idContinente) {
        const [paises] = await this.conex.execute(
            'SELECT p.*, c.nombre as continente_nombre FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente ' +
            'WHERE p.id_continente = ?',
            [idContinente]
        );
        return paises;
    }

    async getPaisById(id) {
        const [pais] = await this.conex.execute(
            'SELECT p.*, c.nombre as continente_nombre FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente ' +
            'WHERE p.id_pais = ?',
            [id]
        );
        
        if (pais.length === 0) {
            throw new Error('País no encontrado');
        }
        
        return pais[0];
    }

    async createPais(nombre, idContinente) {
        // Verificar que el continente exista
        const [continente] = await this.conex.execute(
            'SELECT * FROM continentes WHERE id_continente = ?',
            [idContinente]
        );
        
        if (continente.length === 0) {
            throw new Error('Continente no encontrado');
        }

        // Verificar si el país ya existe
        const [existingPais] = await this.conex.execute(
            'SELECT * FROM paises WHERE nombre = ?',
            [nombre]
        );
        
        if (existingPais.length > 0) {
            throw new Error('El país ya existe');
        }

        const [result] = await this.conex.execute(
            'INSERT INTO paises (nombre, id_continente) VALUES (?, ?)',
            [nombre, idContinente]
        );
        
        return {
            id_pais: result.insertId,
            nombre,
            id_continente: idContinente
        };
    }

    async updatePais(id, nombre, idContinente) {
        // Verificar que el país exista
        const [paisExistente] = await this.conex.execute(
            'SELECT * FROM paises WHERE id_pais = ?',
            [id]
        );
        
        if (paisExistente.length === 0) {
            throw new Error('País no encontrado');
        }

        // Verificar que el continente exista
        const [continente] = await this.conex.execute(
            'SELECT * FROM continentes WHERE id_continente = ?',
            [idContinente]
        );
        
        if (continente.length === 0) {
            throw new Error('Continente no encontrado');
        }

        await this.conex.execute(
            'UPDATE paises SET nombre = ?, id_continente = ? WHERE id_pais = ?',
            [nombre, idContinente, id]
        );
        
        // Obtener el país actualizado
        const [paisActualizado] = await this.conex.execute(
            'SELECT p.*, c.nombre as continente_nombre FROM paises p ' +
            'INNER JOIN continentes c ON p.id_continente = c.id_continente ' +
            'WHERE p.id_pais = ?',
            [id]
        );
        
        return paisActualizado[0];
    }

    async deletePais(id) {
        // Verificar que el país exista
        const [paisExistente] = await this.conex.execute(
            'SELECT * FROM paises WHERE id_pais = ?',
            [id]
        );
        
        if (paisExistente.length === 0) {
            throw new Error('País no encontrado');
        }

        // Verificar si hay ciudades asociadas
        const [ciudadesAsociadas] = await this.conex.execute(
            'SELECT * FROM ciudades WHERE id_pais = ?',
            [id]
        );
        
        if (ciudadesAsociadas.length > 0) {
            throw new Error('No se puede eliminar el país porque tiene ciudades asociadas');
        }

        await this.conex.execute(
            'DELETE FROM paises WHERE id_pais = ?',
            [id]
        );
        
        return { message: 'País eliminado correctamente' };
    }
}

export default PaisesService;