import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './../api/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const response = await axios.get('/user/me');

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error al verificar sesión:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setUser(user);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/user/logout');
      if (response.status === 200) {
        setUser(null);
        navigate('/');
      }
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
