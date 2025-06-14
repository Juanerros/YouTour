import { useState, useEffect } from 'react';

const useActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActividades = async () => {
    try {
      const response = await fetch('http://localhost:5001/actividades');
      if (!response.ok) {
        throw new Error('Error al obtener las actividades');
      }
      const data = await response.json();
      setActividades(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addActividad = async (actividad) => {
    try {
      const response = await fetch('http://localhost:5001/actividades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actividad),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la actividad');
      }

      const nuevaActividad = await response.json();
      setActividades(prev => [...prev, nuevaActividad]);
      return nuevaActividad;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  return {
    actividades,
    loading,
    error,
    addActividad,
    refreshActividades: fetchActividades
  };
};

export default useActividades;