import { useState, useEffect } from 'react';

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

  const fetchPaises = async () => {
    try {
      const response = await fetch('http://localhost:5001/paises');
      if (!response.ok) throw new Error('Error al obtener los países');
      const data = await response.json();
      setPaises(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCiudadesPorPais = async (idPais) => {
    try {
      const response = await fetch(`http://localhost:5001/ciudades/pais/${idPais}`);
      if (!response.ok) throw new Error('Error al obtener las ciudades');
      const data = await response.json();
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