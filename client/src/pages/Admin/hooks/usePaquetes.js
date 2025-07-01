import { useState, useEffect } from 'react';
import { paquetesService } from '../service/paquetesService';
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
      const data = await paquetesService.getAll();
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
      const nuevoPaquete = await paquetesService.create(paquete);
      setPaquetes(prev => [...prev, nuevoPaquete]);
      return nuevoPaquete;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addActividadAPaquete = async (idPaquete, actividadData) => {
    try {
      const resultado = await paquetesService.addActividad(idPaquete, actividadData);
      fetchPaquetes();
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getPaqueteById = async (id) => {
    try {
      return await paquetesService.getById(id);
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
    hoteles: filteredHoteles,
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