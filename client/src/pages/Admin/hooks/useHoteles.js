import { useState, useEffect } from 'react';

const useHoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoteles = async () => {
    try {
      const response = await fetch('http://localhost:5001/hoteles');
      if (!response.ok) {
        throw new Error('Error al obtener los hoteles');
      }
      const data = await response.json();
      setHoteles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addHotel = async (hotel) => {
    try {
      const response = await fetch('http://localhost:5001/hoteles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotel),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el hotel');
      }

      const nuevoHotel = await response.json();
      setHoteles(prev => [...prev, nuevoHotel]);
      return nuevoHotel;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchHoteles();
  }, []);

  return {
    hoteles,
    loading,
    error,
    addHotel,
    refreshHoteles: fetchHoteles
  };
};

export default useHoteles;