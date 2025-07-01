import { useState, useEffect } from 'react';
import { ciudadesService } from '../service/ciudadesService';

const useCiudades = () => {
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesPorPais, setCiudadesPorPais] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCiudades = async () => {
    try {
      const data = await ciudadesService.getAll();
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
      const data = await ciudadesService.getByPais(paisId);
      
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
      const nuevaCiudad = await ciudadesService.create(ciudad);
      
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