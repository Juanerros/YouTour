import { useState, useEffect } from 'react';
import useVuelos from './useVuelos';
import useHoteles from './useHoteles';
import useActividades from './useActividades';

const usePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener datos de otros hooks
  const { vuelos } = useVuelos();
  const { hoteles } = useHoteles();
  const { actividades } = useActividades();

  const fetchPaquetes = async () => {
    try {
      const response = await fetch('http://localhost:5001/paquetes');
      if (!response.ok) {
        throw new Error('Error al obtener los paquetes');
      }
      const data = await response.json();
      setPaquetes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPaquete = async (paquete) => {
    try {
      const response = await fetch('http://localhost:5001/paquetes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paquete),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el paquete');
      }

      const nuevoPaquete = await response.json();
      setPaquetes(prev => [...prev, nuevoPaquete]);
      return nuevoPaquete;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addActividadAPaquete = async (idPaquete, actividadData) => {
    try {
      const response = await fetch(`http://localhost:5001/paquetes/${idPaquete}/actividades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actividadData),
      });

      if (!response.ok) {
        throw new Error('Error al agregar actividad al paquete');
      }

      const resultado = await response.json();
      // Actualizar el estado local si es necesario
      fetchPaquetes();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getPaqueteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/paquetes/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el paquete');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, []);

  return {
    paquetes,
    vuelos,
    hoteles,
    actividades,
    loading,
    error,
    addPaquete,
    addActividadAPaquete,
    getPaqueteById,
    fetchPaquetes
  };
};

export default usePaquetes;