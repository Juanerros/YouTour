import { useState, useEffect } from 'react';
import { paisesService } from '../service/paisesService';

const usePaises = () => {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaises = async () => {
    try {
      const data = await paisesService.getAll();
      setPaises(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPais = async (pais) => {
    try {
      const nuevoPais = await paisesService.create(pais);
      setPaises(prev => [...prev, nuevoPais]);
      return nuevoPais;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPaises();
  }, []);

  return {
    paises,
    loading: loading,
    error,
    addPais,
    refreshPaises: fetchPaises
  };
};

export default usePaises;