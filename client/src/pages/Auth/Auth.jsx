import './style.css'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext.jsx';
import axios from '../../api/axios';
import useNotification from '../../hooks/useNotification';
import { FaEye, FaEyeSlash, FaShoppingCart } from 'react-icons/fa';
import { MdModeOfTravel } from 'react-icons/md';


const Auth = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { handleLogin, user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rePassword: '',
    name: '',
    dni: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;
    try {
      setIsLoading(true);
      const endpoint = `/user${isLogin ? '/login' : '/register'}`;
      const dataToSend = isLogin ? {
        email: formData.email,
        password: formData.password
      } : {
        email: formData.email,
        pass: formData.password,
        name: formData.name,
        dni: formData.dni,
        phone: formData.phone
      };
      const response = await axios.post(endpoint, dataToSend);
      const { data } = response;

      if (response.status === 200 || response.status === 201) {
        handleLogin(data.user);
        notify(data.message, 'success');
      }
    } catch (error) {
      notify(error.response?.data?.message || 'Error en la autenticación', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = () => {
    const regexEspeciales = /[^ a-zA-Z0-9!@#$%^&()_+[\]{};\\|\-/?`.~]/g;
    const regexDNI = /^[0-9]{8}$/;
    const regexPhone = /^[0-9]{10}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regexEspeciales.test(formData.email) || regexEspeciales.test(formData.password)) {
      notify('No escribas caracteres especiales', 'warning')
      return false;
    }

    if (isLogin) return true;

    if (!regexEmail.test(formData.email)) {
      notify('El formato del email no es válido', 'error');
      return false;
    }

    if (formData.password.length < 6) {
      notify('La contraseña debe tener al menos 6 caracteres', 'error');
      return false;
    }

    if (formData.password !== formData.rePassword) {
      notify('Las contraseñas no coinciden', 'error');
      return false;
    }

    if (formData.name.trim().length < 3) {
      notify('El nombre debe tener al menos 3 caracteres', 'error');
      return false;
    }

    if (!regexDNI.test(formData.dni)) {
      notify('El DNI debe tener 8 dígitos', 'error');
      return false;
    }

    if (!regexPhone.test(formData.phone)) {
      notify('El teléfono debe tener 10 dígitos', 'error');
      return false;
    }

    return true;
  }

  const handleChange = (e) => {
    if (e.target.value.includes('  ')) {
      notify('No puedes escribir espacios dobles', 'warning');
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (user) return navigate('/');

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left-panel">
          <div className="auth-logo">
            <MdModeOfTravel className="logo-icon white" />
            <span>YouTour</span>
          </div>

          <h1>{isLogin ? '¡Bienvenido de vuelta!' : 'Únete a YouTour'}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Continúa explorando el mundo con nosotros. Tus aventuras te esperan.'
              : 'Descubre experiencias de viaje extraordinarias que cambiarán tu perspectiva del mundo.'}
          </p>

          <div className="auth-features">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fa fa-map-marker"></i>
              </div>
              <div className="feature-text">
                <h3>Descubre el mundo</h3>
                <p>Accede a destinos exclusivos y experiencias únicas en más de 150 países.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fa fa-heart"></i>
              </div>
              <div className="feature-text">
                <h3>Guarda tus favoritos</h3>
                <p>Crea listas de viajes de ensueño y compártelas con familia y amigos.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fa fa-shield"></i>
              </div>
              <div className="feature-text">
                <h3>Reservas seguras</h3>
                <p>Protección total en todas tus transacciones con garantía de reembolso.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fa fa-headset"></i>
              </div>
              <div className="feature-text">
                <h3>Soporte 24/7</h3>
                <p>Asistencia personalizada en cualquier momento durante tu viaje.</p>
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="auth-extra-info">
              <div className="testimonial">
                <blockquote>
                  “¡Registrarme en YouTour fue el primer paso para vivir mis mejores aventuras! La plataforma es segura y el soporte es excelente.”
                </blockquote>
                <cite>- Ana Torres, Viajera frecuente</cite>
              </div>
              <div className="more-info">
                <h4>¿Por qué crear una cuenta?</h4>
                <ul>
                  <li>Accede a ofertas y destinos exclusivos solo para miembros.</li>
                  <li>Guarda y organiza tus viajes favoritos.</li>
                  <li>Recibe asistencia personalizada en todo momento.</li>
                  <li>Tu información está protegida con los más altos estándares de seguridad.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
              <p>{isLogin
                ? 'Ingresa a tu cuenta para continuar tu aventura'
                : 'Completa tus datos para comenzar a explorar'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Tu nombre completo"
                      minLength={3}
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="tuemail@mail.com"
                    minLength={1}
                    maxLength={100}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="input-container password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••"
                    minLength={1}
                    maxLength={100}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="rePassword">Repite la contraseña</label>
                    <div className="input-container">
                      <input
                        type="password"
                        id="rePassword"
                        name="rePassword"
                        placeholder="••••••"
                        minLength={6}
                        maxLength={100}
                        value={formData.rePassword || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="dni">DNI</label>
                      <div className="input-container">
                        <input
                          type="text"
                          id="dni"
                          name="dni"
                          placeholder="12345678"
                          value={formData.dni}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group half">
                      <label htmlFor="phone">Teléfono</label>
                      <div className="input-container">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="1234567890"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            </form>

            <div className="auth-form-footer">
              <p>
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  type="button"
                  className="switch-auth-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;