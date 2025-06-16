import { useState, useEffect } from 'react';

const useContinentes = () => {
  const [continentes, setContinentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContinentes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/paises/continentes');
      if (!response.ok) {
        throw new Error('Error al obtener los continentes');
      }
      const data = await response.json();
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
      const response = await fetch('http://localhost:5001/api/paises/continentes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(continente),
      });
      if (!response.ok) {
        throw new Error('Error al agregar el continente');
      }
      const nuevoContinente = await response.json();
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