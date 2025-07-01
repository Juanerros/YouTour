import bcrypt from 'bcrypt';
import moment from 'moment';

moment.locale('es');
const SALT_ROUNDS = 12;

class AuthService {
  constructor(conex) {
    this.conex = conex
  }

  async login(email, password) {
    try {
      const [result] = await this.conex.execute(
        "SELECT l.*, u.* FROM login l INNER JOIN users u ON l.id_user = u.id_user WHERE l.email = ?",
        [email]
      );

      if (result.length === 0) {
        throw { status: 401, message: 'Credenciales incorrectas.' };
      }

      const user = result[0];

      if (user.lock_until && new Date(user.lock_until) > new Date()) {
        const time = moment(user.lock_until).fromNow();
        throw { status: 403, message: `Muchos intentos fallidos. Intente de nuevo ${time}` };
      }

      const validPassword = await bcrypt.compare(password, user.pass);
      if (!validPassword) {
        try {
          const attempts = user.failed_attempts + 1;
          const lock_until = attempts >= 3 ? moment().add(15, 'minutes').toDate() : null;

          await this.conex.execute(
            'UPDATE login SET failed_attempts = ?, lock_until = ? WHERE id_login = ?',
            [attempts, lock_until, user.id_login]
          );
        } catch (updateErr) {
          console.error('Error al actualizar intentos fallidos:', updateErr);
        }

        throw { status: 401, message: 'Credenciales incorrectas.' };
      }

      try {
        await this.conex.execute(
          'UPDATE login SET failed_attempts = 0, lock_until = NULL WHERE id_login = ?',
          [user.id_login]
        );
      } catch (updateErr) {
        console.error('Error al resetear intentos fallidos:', updateErr);
      }

      return user;
    } catch (err) {
      if (err.status) {
        throw err;
      }
      console.error('Error interno en login:', err);
      throw { status: 500, message: 'Error interno del servidor', cause: err };
    }
  }

  async register({ email, pass, name, dni, phone }) {
    let userId = null;

    try {
      const [userRes] = await this.conex.execute(
        'INSERT INTO users(name, dni, phone) VALUES (?, ?, ?)',
        [name, dni, phone]
      );

      userId = userRes.insertId;

      const hashed = await bcrypt.hash(pass, SALT_ROUNDS);

      const [loginRes] = await this.conex.execute(
        'INSERT INTO login(id_user, email, pass) VALUES (?, ?, ?)',
        [userId, email, hashed]
      );

      if (loginRes.affectedRows === 0) {
        await this.conex.execute('DELETE FROM users WHERE id_user = ?', [userId]);
        throw { status: 500, message: 'Error interno del servidor' };
      }

      return {
        id_login: loginRes.insertId,
        id_user: userId,
        email,
        name,
        dni,
        phone,
      };
    } catch (err) {
      // Limpiar usuario creado si hay error
      if (userId) {
        try {
          await this.conex.execute('DELETE FROM users WHERE id_user = ?', [userId]);
        } catch (deleteErr) {
          console.error('Error al limpiar usuario creado:', deleteErr);
        }
      }

      if (err.status) {
        throw err;
      }

      if (err.code === 'ER_DUP_ENTRY') {
        throw { status: 409, message: 'El Email/DNI/Telefono ya se encuentra registrado' };
      }
      
      // Error interno no manejado
      console.error('Error interno en register:', err);
      throw { status: 500, message: 'Error interno del servidor', cause: err };
    }
  }
}

export default AuthService;
