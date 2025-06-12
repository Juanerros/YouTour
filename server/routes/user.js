const { createConnection, handleError, express } = require('./../config/setup');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
moment.locale('es');

const SALT_ROUNDS = 12;

//funcion asicrona para crear la conexion a la base de datos
let conex;
const init = async () => conex = await createConnection();
init();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [resultLogin] = await conex.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (resultLogin.length === 0) return handleError(res, 'Credenciales incorrectas.', null, 401);

        const user = resultLogin[0];

        // Verificar si el usuario está bloqueado temporalmente
        if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
            const remainingTime = moment(user.bloqueado_hasta).fromNow();
            return handleError(res, `Muchos intentos fallidos. Intente de nuevo ${remainingTime}`, null, 403);
        }

        // Verificar la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            const intentos_fallidos = user.intentos_fallidos + 1;
            let bloqueado_hasta = null;

            if (intentos_fallidos >= 3) {
                bloqueado_hasta = moment().add(15, 'minutes').toDate();
            }

            await conex.execute(
                'UPDATE usuarios SET intentos_fallidos = ?, lock_until = ? WHERE usuario_id = ?',
                [intentos_fallidos, bloqueado_hasta, user.usuario_id]
            );

            return handleError(res, 'Credenciales incorrectas.', null, 401);
        }

        await conex.execute(
            'UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE usuario_id = ?',
            [user.usuario_id]
        );

        res.status(200).json({
            message: 'Se logueó correctamente',
            user: {
                ...user,
                // Oculta la contraseña
                password_hash: '[Hidden]'
            }
        });

    } catch (err) {
        return handleError(res, 'Error al intentar iniciar sesión', err);
    }
});

router.post('/register', async (req, res) => {
    const { email, password /* Hace faltan mas datos obvio */} = req.body;

    try {
        // Hash de la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [register] = await conex.execute(
            'INSERT INTO usuarios(email, password_hash) VALUES (?, ?)',
            [email, hashedPassword]
        );

        if (register.length == 0) return handleError(res, 'Error al intentar registrarte', null, 500);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                usuario_id: register.insertId,
                email,
                // Oculta la contraseña
                password_hash: '[Hidden]'
            }
        });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return handleError(res, 'El email y/o usuario ya se encuentran registrados', null, 409);
        }
        return handleError(res, 'Error al registrarse', err);
    }
});

module.exports = router;