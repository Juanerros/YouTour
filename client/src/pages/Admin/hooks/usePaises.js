import { useState, useEffect } from 'react';

const usePaises = () => {
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaises = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/paises');
      if (!response.ok) {
        throw new Error('Error al obtener los países');
      }
      const data = await response.json();
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
      const response = await fetch('http://localhost:5001/api/paises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pais),
      });
      if (!response.ok) {
        throw new Error('Error al agregar el país');
      }
      const nuevoPais = await response.json();
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