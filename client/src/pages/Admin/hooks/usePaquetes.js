import { useState, useEffect } from 'react';
import useVuelos from './useVuelos';
import useHoteles from './useHoteles';
import useActividades from './useActividades';

const usePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener datos de otros hooks
  const { vuelos, selectedVuelo, selectVuelo } = useVuelos();
  const { hoteles, filteredHoteles, filterHotelesByPais, resetHotelFilter } = useHoteles();
  const { actividades } = useActividades();

  // Efecto para filtrar hoteles cuando se selecciona un vuelo
  useEffect(() => {
    if (selectedVuelo && selectedVuelo.destino_id_pais) {
      filterHotelesByPais(selectedVuelo.destino_id_pais);
    } else {
      resetHotelFilter();
    }
  }, [selectedVuelo, filterHotelesByPais, resetHotelFilter]);

  const fetchPaquetes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/paquetes');
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
      const response = await fetch('http://localhost:5001/api/paquetes', {
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
      const response = await fetch(`http://localhost:5001/api/paquetes/${idPaquete}/actividades`, {
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
      fetchPaquetes();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getPaqueteById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/paquetes/${id}`);
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
    selectedVuelo,
    selectVuelo,
    hoteles: filteredHoteles, // Usamos los hoteles filtrados
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