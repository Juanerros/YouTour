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
            "SELECT * FROM login WHERE email = ?",
            [email]
        );

        if (resultLogin.length === 0) return handleError(res, 'Credenciales incorrectas', null, 401);

        const user = resultLogin[0];

        // Verificar si el usuario está bloqueado temporalmente
        if (user.lock_until && new Date(user.lock_until) > new Date()) {
            const remainingTime = moment(user.lock_until).fromNow();
            return handleError(res, `Muchos intentos fallidos. Intente de nuevo ${remainingTime}`, null, 403);
        }

        // Verificar la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const failedAttempts = user.failed_attempts + 1;
            let lockUntil = null;

            if (failedAttempts >= 3) {
                lockUntil = moment().add(15, 'minutes').toDate();
            }

            await conex.execute(
                'UPDATE login SET failed_attempts = ?, lock_until = ? WHERE id_login = ?',
                [failedAttempts, lockUntil, user.id_login]
            );

            return handleError(res, 'Contraseña incorrecta.', null, 401);
        }

        await conex.execute(
            'UPDATE login SET failed_attempts = 0, lock_until = NULL WHERE id_login = ?',
            [user.id_login]
        );

        res.status(200).json({
            message: 'Se logueó correctamente',
            user: {
                ...user,
                // Oculta la contraseña
                password: '[Hidden]'
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

        const [resultRegistro] = await conex.execute(
            'INSERT INTO login(email, password, nick) VALUES (?, ?, ?)',
            [email, hashedPassword]
        );

        if (register.length == 0) return handleError(res, 'Error al intentar registrarte', null, 500);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            id_user: resultRegistro.insertId
        });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return handleError(res, 'El email y/o usuario ya se encuentran registrados', null, 409);
        }
        return handleError(res, 'Error al registrarse', err);
    }
});

module.exports = router;