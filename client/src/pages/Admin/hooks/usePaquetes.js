import { useState, useEffect } from 'react';
import { paquetesService } from '../service/paquetesService';
import useVuelos from './useVuelos';
import useHoteles from './useHoteles';
import useActividades from './useActividades';

const usePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [paquetesDetallados, setPaquetesDetallados] = useState([]);
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

  const fetchPaquetesDetallados = async () => {
    try {
      const data = await paquetesService.getAllDetallados();
      setPaquetesDetallados(data);
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
      
      // Refrescar los paquetes detallados para tener la información completa
      fetchPaquetesDetallados();
      
      return nuevoPaquete;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePaquete = async (id, paqueteData) => {
    try {
      const paqueteActualizado = await paquetesService.update(id, paqueteData);
      setPaquetes(prev => prev.map(p => p.id_paquete === id ? paqueteActualizado : p));
      
      // Refrescar los paquetes detallados para tener la información completa y actualizada
      fetchPaquetesDetallados();
      
      return paqueteActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePaquete = async (id) => {
    try {
      await paquetesService.delete(id);
      setPaquetes(prev => prev.filter(p => p.id_paquete !== id));
      setPaquetesDetallados(prev => prev.filter(p => p.id_paquete !== id));
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

  const getPaqueteDetalladoById = async (id) => {
    try {
      return await paquetesService.getDetalladoById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPaquetes();
    fetchPaquetesDetallados();
  }, []);

  return {
    paquetes,
    paquetesDetallados,
    vuelos,
    selectedVuelo,
    selectVuelo,
    hoteles: filteredHoteles,
    hotelesCompletos: hoteles,
    filterHotelesByPais,
    resetHotelFilter,
    actividades,
    loading,
    error,
    addPaquete,
    updatePaquete,
    deletePaquete,
    addActividadAPaquete,
    getPaqueteById,
    getPaqueteDetalladoById,
    fetchPaquetes,
    fetchPaquetesDetallados
  };
};

export default usePaquetes;