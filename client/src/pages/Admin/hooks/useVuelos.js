import { useState, useEffect } from 'react';
import { vuelosService } from '../service/vuelosService';

const useVuelos = () => {
  const [vuelos, setVuelos] = useState([]);
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVuelos = async () => {
    try {
      const data = await vuelosService.getAll();
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
      const nuevoVuelo = await vuelosService.create(vuelo);
      setVuelos(prev => [...prev, nuevoVuelo]);
      return nuevoVuelo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVuelo = async (id) => {
    try {
      await vuelosService.delete(id);
      setVuelos(prev => prev.filter(vuelo => vuelo.id_vuelo !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateVuelo = async (id, vueloActualizado) => {
    try {
      const vueloUpdated = await vuelosService.update(id, vueloActualizado);
      setVuelos(prev => prev.map(vuelo => 
        vuelo.id_vuelo === id ? vueloUpdated : vuelo
      ));
      return vueloUpdated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const selectVuelo = (vuelo) => {
    setSelectedVuelo(vuelo);
  };

  useEffect(() => {
    fetchVuelos();
  }, []);

  return {
    vuelos,
    selectedVuelo,
    selectVuelo,
    loading,
    error,
    addVuelo,
    deleteVuelo,
    updateVuelo,
    refreshVuelos: fetchVuelos
  };
};

export default useVuelos;