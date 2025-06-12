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
    password: ''
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isValid()) return;
    try {
      const endpoint = `/user${isLogin ? '/login' : '/register'}`;
      const { data } = await axios.post(endpoint, formData);
      
      handleLogin(data.user);
      notify(data.message, 'success');
      navigate('/');
    } catch (error) {
      notify(error.response?.data?.message || 'Error en la autenticación', 'error');
    }
  };

  const isValid = () => {
    if(formData.email.length < 3) {
      notify('El email debe tener al menos 3 caracteres', 'error');
      return false;
    }
    if (!formData.email.includes('.')) {
      notify('El email debe tener un punto', 'error');
      return false
    }
    // if (formData.pass !== formData.rePass) {
    //   notify('Las contraseñas no coinciden', 'error');
    //   return false
    // }
    if (formData.password.length < 6) {
      notify('La contraseña debe tener al menos 6 caracteres', 'error');
      return false
    }
    return true;
  }

  const handleChange = (e) => {
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
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