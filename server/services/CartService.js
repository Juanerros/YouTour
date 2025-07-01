class CartService {
    constructor(conex) {
        this.conex = conex;
    }

    getPaqueteById = async (id) => {
        try {
            const [paquete] = await this.conex.execute(
                'SELECT * FROM paquetes WHERE estado = "Creado" AND id_paquete = ?',
                [id]
            );

            if (paquete.length === 0) throw { message: 'Paquete no encontrado', status: 404 };

            return paquete[0];
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en getPaqueteById:', err);
            throw { message: 'Error al obtener paquete por id', status: 500 };
        }
    }

    getPaqueteDetalladoById = async (id) => {
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

            return {
                vuelo: vuelos[0],
                hotel: hoteles[0],
                actividades,
            };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en getPaqueteDetalladoById:', err);
            throw { message: 'Error al obtener paquete por id', status: 500 };
        }
    }

    getActiveCartByUserId = async (userId) => {
        try {
            const [cart] = await this.conex.execute(
                `SELECT c.*,
                    p.id_paquete, p.nombre, p.descripcion, p.precio_base, p.duracion_dias, 
                    p.fecha_inicio, p.fecha_fin, p.cantidad_personas
             FROM carritos c 
             INNER JOIN paquetes p ON c.id_paquete = p.id_paquete 
             WHERE c.id_user = ? AND c.estado = 'Activo'`,
                [userId]
            );

            if (cart.length === 0) throw { status: 404, message: 'Carrito no encontrado o no está activo' };

            const [services] = await this.conex.execute(
                'SELECT * FROM servicios WHERE id_paquete = ?',
                [cart[0].id_paquete]
            );

            const datosPaquete = await this.getPaqueteDetalladoById(cart[0].id_paquete);

            return {
                ...datosPaquete,
                ...cart[0],
                servicios: services
            };
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en getActiveCartByUserId:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }

    getAllCartsByUserId = async (userId) => {
        const [carts] = await this.conex.execute(
            `SELECT c.*, p.nombre, p.precio_base, p.duracion_dias, p.fecha_inicio, p.fecha_fin
             FROM carritos c 
             INNER JOIN paquetes p ON c.id_paquete = p.id_paquete 
             WHERE c.id_user = ? AND c.estado != 'Activo'`,
            [userId]
        );

        if (carts.length === 0) throw { status: 404, message: 'No se encontraron carritos para este usuario' };

        return carts;
    }

    addToCart = async (userId, paqueteId) => {
        try {
            // Verificar si ya existe un carrito activo para este usuario
            const [existingCart] = await this.conex.execute(
                'SELECT * FROM carritos WHERE id_user = ? AND estado = "Activo"',
                [userId]
            );

            if (existingCart.length > 0) throw { status: 409, message: 'Ya hay un paquete en el carrito' };

            // Crear un nuevo carrito
            const [result] = await this.conex.execute(
                'INSERT INTO carritos (id_user, id_paquete) VALUES (?, ?)',
                [userId, paqueteId]
            );

            return result.insertId;
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en addToCart:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }

    removeFromCart = async (cartId) => {
        await this.getCartById(cartId);

        const [result] = await this.conex.execute(
            'DELETE FROM carritos WHERE id_carrito = ?',
            [cartId]
        );

        return result.affectedRows > 0;
    }

    updateCartStatus = async (cartId, estado) => {
        await this.getCartById(cartId);

        const [result] = await this.conex.execute(
            'UPDATE carritos SET estado = ? WHERE id_carrito = ?',
            [estado, cartId]
        );

        return result.affectedRows > 0;
    }

    getCartById = async (cartId) => {
        const [cart] = await this.conex.execute(
            'SELECT * FROM carritos WHERE id_carrito = ?',
            [cartId]
        );

        if (cart.length === 0) throw { status: 404, message: 'Carrito no encontrado' };

        return cart[0];
    }

    validatePackageExists = async (paqueteId) => {
        const [paquete] = await this.conex.execute(
            'SELECT * FROM paquetes WHERE id_paquete = ?',
            [paqueteId]
        );

        if (paquete.length === 0) throw { status: 404, message: 'Paquete no encontrado' };

        return paquete.length > 0;
    }

    checkoutCart = async (cartId, total) => {
        try {
            await this.getCartById(cartId);

            console.log("Los datos de front: ", cartId, total)

            // Actualizar estado del carrito
            const [result] = await this.conex.execute(
                "UPDATE carritos SET estado = 'Procesando', total = ? WHERE id_carrito = ?",
                [total, cartId]
            );

            return result.affectedRows > 0;
        } catch (err) {
            if (err.status) throw err;
            console.error('Error interno en checkoutCart:', err);
            throw { status: 500, message: 'Error interno del servidor', cause: err };
        }
    }

    cancelCart = async (cartId) => {
        // Verificar si existe el carrito
        await this.getCartById(cartId);

        // Cancelar el carrito
        const [result] = await this.conex.execute(
            "UPDATE carritos SET estado = 'Cancelado' WHERE id_carrito = ?",
            [cartId]
        );

        return result.affectedRows > 0;
    }

    removeActiveCart = async (cartId) => {
        // Verificar si existe el carrito activo
        await this.getCartById(cartId);

        // Eliminar el carrito
        const [result] = await this.conex.execute(
            "DELETE FROM carritos WHERE id_carrito = ?",
            [cartId]
        );

        return result.affectedRows > 0;
    }
}

export default CartService;