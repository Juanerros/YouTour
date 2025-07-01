class VuelosService {
  constructor(conex) {
    this.conex = conex;
  }

  async getAllVuelos() {
    const [vuelos] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
      'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais'
    );
    return vuelos;
  }

  async getVuelosByOrigen(id) {
    const [vuelos] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
      'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais ' +
      'WHERE v.origen = ?',
      [id]
    );
    return vuelos;
  }

  async getVuelosByDestino(id) {
    const [vuelos] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
      'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais ' +
      'WHERE v.destino = ?',
      [id]
    );
    return vuelos;
  }

  async getVuelosByFecha(fecha) {
    const [vuelos] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
      'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais ' +
      'WHERE v.fecha_vuelo = ?',
      [fecha]
    );
    return vuelos;
  }

  async getVueloById(id) {
    const [vuelo] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo, ' +
      'destino_pais.id_pais as destino_id_pais, destino_pais.nombre as destino_pais_nombre ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'INNER JOIN paises destino_pais ON destino.id_pais = destino_pais.id_pais ' +
      'WHERE v.id_vuelo = ?',
      [id]
    );

    if (vuelo.length === 0) {
      throw { status: 404, message: 'Vuelo no encontrado' };
    }

    return vuelo[0];
  }

  async createVuelo(vueloData) {
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = vueloData;

    // Verificar que origen y destino existan
    const [ciudadOrigen] = await this.conex.execute(
      'SELECT * FROM ciudades WHERE id_ciudad = ?',
      [origen]
    );

    if (ciudadOrigen.length === 0) {
      throw { status: 404, message: 'Ciudad de origen no encontrada' };
    }

    const [ciudadDestino] = await this.conex.execute(
      'SELECT * FROM ciudades WHERE id_ciudad = ?',
      [destino]
    );

    if (ciudadDestino.length === 0) {
      throw { status: 404, message: 'Ciudad de destino no encontrada' };
    }

    const [result] = await this.conex.execute(
      'INSERT INTO vuelos (origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo]
    );

    return {
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
    };
  }

  async updateVuelo(id, vueloData) {
    const { origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo } = vueloData;

    // Verificar que el vuelo exista
    const [vueloExistente] = await this.conex.execute(
      'SELECT * FROM vuelos WHERE id_vuelo = ?',
      [id]
    );

    if (vueloExistente.length === 0) {
      throw { status: 404, message: 'Vuelo no encontrado' };
    }

    // Verificar que origen y destino existan
    const [ciudadOrigen] = await this.conex.execute(
      'SELECT * FROM ciudades WHERE id_ciudad = ?',
      [origen]
    );

    if (ciudadOrigen.length === 0) {
      throw { status: 404, message: 'Ciudad de origen no encontrada' };
    }

    const [ciudadDestino] = await this.conex.execute(
      'SELECT * FROM ciudades WHERE id_ciudad = ?',
      [destino]
    );

    if (ciudadDestino.length === 0) {
      throw { status: 404, message: 'Ciudad de destino no encontrada' };
    }

    await this.conex.execute(
      'UPDATE vuelos SET origen = ?, destino = ?, aerolinea = ?, precio = ?, duracion = ?, aeronave = ?, salida = ?, llegada = ?, fecha_vuelo = ? WHERE id_vuelo = ?',
      [origen, destino, aerolinea, precio, duracion, aeronave, salida, llegada, fecha_vuelo, id]
    );

    // Obtener el vuelo actualizado con los nombres de las ciudades
    const [vueloActualizado] = await this.conex.execute(
      'SELECT v.*, ' +
      'origen.nombre as origen_nombre, origen.codigo_aeropuerto as origen_codigo, ' +
      'destino.nombre as destino_nombre, destino.codigo_aeropuerto as destino_codigo ' +
      'FROM vuelos v ' +
      'INNER JOIN ciudades origen ON v.origen = origen.id_ciudad ' +
      'INNER JOIN ciudades destino ON v.destino = destino.id_ciudad ' +
      'WHERE v.id_vuelo = ?',
      [id]
    );

    return vueloActualizado[0];
  }

  async deleteVuelo(id) {
    // Verificar que el vuelo exista
    const [vueloExistente] = await this.conex.execute(
      'SELECT * FROM vuelos WHERE id_vuelo = ?',
      [id]
    );

    if (vueloExistente.length === 0) {
      throw { status: 404, message: 'Vuelo no encontrado' };
    }

    await this.conex.execute(
      'DELETE FROM vuelos WHERE id_vuelo = ?',
      [id]
    );

    return { message: 'Vuelo eliminado correctamente' };
  }
}

export default VuelosService;