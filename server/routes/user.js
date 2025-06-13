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
        // Obtenemos todos los datos del usuario
        const [resultLogin] = await conex.execute(
            "SELECT l.*, u.* FROM login l INNER JOIN users u ON l.id_user = u.id_user WHERE l.email = ?",
            [email]
        );

        if (resultLogin.length === 0) return handleError(res, 'Credenciales incorrectas.', null, 401);

        const user = resultLogin[0];

        // Verificar si el usuario está bloqueado temporalmente
        if (user.lock_until && new Date(user.lock_until) > new Date()) {
            const remainingTime = moment(user.lock_until).fromNow();
            return handleError(res, `Muchos intentos fallidos. Intente de nuevo ${remainingTime}`, null, 403);
        }

        // Verificar la contraseña hasheada
        const isPasswordValid = await bcrypt.compare(password, user.pass);

        if (!isPasswordValid) {
            const failed_attempts = user.failed_attempts + 1;
            let lock_until = null;

            // Si se exceden los intentos fallidos, bloquear temporalmente
            if (failed_attempts >= 3) {
                lock_until = moment().add(15, 'minutes').toDate();
            }

            // Actualizar los intentos fallidos y el bloqueo temporal
            await conex.execute(
                'UPDATE login SET failed_attempts = ?, lock_until = ? WHERE id_login = ?',
                [failed_attempts, lock_until, user.id_login]
            );

            return handleError(res, 'Credenciales incorrectas.', null, 401);
        }

        // Reiniciar los intentos fallidos y el bloqueo temporal al logeo exitoso
        await conex.execute(
            'UPDATE login SET failed_attempts = 0, lock_until = NULL WHERE id_login = ?',
            [user.id_login]
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
    const { email, pass, name, dni, phone } = req.body;
    let userId = null;

    try {
        // Primero crear el usuario
        const [userResult] = await conex.execute(
            'INSERT INTO users(name, dni, phone) VALUES (?, ?, ?)',
            [name, dni, phone]
        );

        if (userResult.affectedRows === 0) return handleError(res, 'Error al crear el usuario');

        userId = userResult.insertId;

        // Hash de la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);

        // Crear el login asociado al usuario
        const [loginResult] = await conex.execute(
            'INSERT INTO login(id_user, email, pass) VALUES (?, ?, ?)',
            [userResult.insertId, email, hashedPassword]
        );

        if (loginResult.affectedRows === 0) {
            // Si falla el login, eliminar el usuario creado
            await conex.execute('DELETE FROM users WHERE id_user = ?', [userId]);
            return handleError(res, 'Error al crear el usuario');
        }

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id_login: loginResult.insertId,
                email,
                // Oculta la contraseña
                pass: '[Hidden]',
                name,
                dni,
                phone,
            }
        });

    } catch (err) {
        // Eliminar usuario si hubo un registro fallido
        if (userId) await conex.execute('DELETE FROM users WHERE id_user = ?', [userId]);  
        if (err.code === 'ER_DUP_ENTRY') {
            return handleError(res, 'El email ya se encuentra registrado', null, 409);
        }
        return handleError(res, 'Error al registrarse', err);
    }
});

module.exports = router;