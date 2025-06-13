import './style.css'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import axios from '../../api/axios';
import useNotification from '../../hooks/useNotification';

const Auth = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { handleLogin } = useUser();

  const [isLogin, setIsLogin] = useState(true);
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
      const { data } = await axios.post(endpoint, dataToSend);

      handleLogin(data.user);
      notify(data.message, 'success');
      navigate('/');
    } catch (error) {
      notify(error.response?.data?.message || 'Error en la autenticación', 'error');
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

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            minLength={1}
            maxLength={100}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={1}
            maxLength={100}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="rePassword">Repite la contraseña:</label>
              <input
                type="password"
                id="rePassword"
                name="rePassword"
                minLength={6}
                maxLength={100}
                value={formData.rePassword || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                minLength={3}
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI:</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <button type="submit">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>
      <p>
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <button
          className="switch-auth"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
        </button>
      </p>
    </div>
  );
};

export default Auth;