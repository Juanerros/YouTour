import { useState, useEffect } from 'react';
import { continentesService } from '../service/continentesService';

const useContinentes = () => {
  const [continentes, setContinentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContinentes = async () => {
    try {
      const data = await continentesService.getAll();
      setContinentes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addContinente = async (continente) => {
    try {
      const nuevoContinente = await continentesService.create(continente);
      setContinentes(prev => [...prev, nuevoContinente]);
      return nuevoContinente;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchContinentes();
  }, []);

  return {
    continentes,
    loading: loading,
    error,
    addContinente,
    refreshContinentes: fetchContinentes
  };
};

export default useContinentes;