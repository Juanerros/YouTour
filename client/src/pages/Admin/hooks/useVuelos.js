import { useState, useEffect } from 'react';

const useVuelos = () => {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVuelos = async () => {
    try {
      const response = await fetch('http://localhost:5001/vuelos');
      if (!response.ok) {
        throw new Error('Error al obtener los vuelos');
      }
      const data = await response.json();
      setVuelos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVuelo = async (vuelo) => {
    try {
      const response = await fetch('http://localhost:5001/vuelos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vuelo),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el vuelo');
      }

      const nuevoVuelo = await response.json();
      setVuelos(prev => [...prev, nuevoVuelo]);
      return nuevoVuelo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchVuelos();
  }, []);

  return {
    vuelos,
    loading,
    error,
    addVuelo,
    refreshVuelos: fetchVuelos
  };
};

export default useVuelos;