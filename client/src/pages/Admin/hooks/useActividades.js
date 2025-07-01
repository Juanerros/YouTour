import { useState, useEffect } from 'react';
import { actividadesService } from '../service/actividadesService';

const useActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [tiposActividad, setTiposActividad] = useState([
    { id_tipo: 1, nombre: 'Cultural' },
    { id_tipo: 2, nombre: 'Turistico' },
    { id_tipo: 3, nombre: 'Aventura' },
    { id_tipo: 4, nombre: 'Entretenimiento' },
    { id_tipo: 5, nombre: 'Deportivo' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActividades = async () => {
    try {
      const data = await actividadesService.getAll();
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
      const nuevaActividad = await actividadesService.create(actividad);
      setActividades(prev => [...prev, nuevaActividad]);
      return nuevaActividad;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchPaises = async () => {
    try {
      const data = await actividadesService.getPaises();
      setPaises(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCiudadesPorPais = async (idPais) => {
    try {
      const data = await actividadesService.getCiudadesByPais(idPais);
      setCiudades(data);
    } catch (err) {
      setError(err.message);
      setCiudades([]);
    }
  };

  useEffect(() => {
    fetchActividades();
    fetchPaises();
  }, []);

  return {
    actividades,
    paises,
    ciudades,
    tiposActividad,
    loading,
    error,
    addActividad,
    fetchCiudadesPorPais,
    refreshActividades: fetchActividades
  };
};

export default useActividades;