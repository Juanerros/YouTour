import { useState, useEffect } from 'react';

const useCiudades = () => {
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesPorPais, setCiudadesPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCiudades = async () => {
    try {
      const response = await fetch('http://localhost:5001/ciudades');
      if (!response.ok) {
        throw new Error('Error al obtener las ciudades');
      }
      const data = await response.json();
      setCiudades(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCiudadesPorPais = async (paisId) => {
    // Si ya tenemos las ciudades de este país en caché, no hacemos la petición
    if (ciudadesPorPais[paisId]) {
      return ciudadesPorPais[paisId];
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/ciudades/pais/${paisId}`);
      if (!response.ok) {
        throw new Error('Error al obtener las ciudades por país');
      }
      const data = await response.json();
      
      // Actualizamos el caché
      setCiudadesPorPais(prev => ({
        ...prev,
        [paisId]: data
      }));
      
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addCiudad = async (ciudad) => {
    try {
      const response = await fetch('http://localhost:5001/ciudades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ciudad),
      });
      if (!response.ok) {
        throw new Error('Error al agregar la ciudad');
      }
      const nuevaCiudad = await response.json();
      
      // Actualizamos la lista general de ciudades
      setCiudades(prev => [...prev, nuevaCiudad]);
      
      // Actualizamos la caché de ciudades por país
      if (ciudadesPorPais[ciudad.id_pais]) {
        setCiudadesPorPais(prev => ({
          ...prev,
          [ciudad.id_pais]: [...prev[ciudad.id_pais], nuevaCiudad]
        }));
      }
      
      return nuevaCiudad;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCiudades();
  }, []);

  return {
    ciudades,
    loading,
    error,
    fetchCiudadesPorPais,
    addCiudad,
    refreshCiudades: fetchCiudades
  };
};

export default useCiudades;