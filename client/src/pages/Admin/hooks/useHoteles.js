import { useState, useEffect } from 'react';

const useHoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [amenidadesDisponibles, setAmenidadesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoteles = async () => {
    try {
      const response = await fetch('http://localhost:5001/hoteles');
      if (!response.ok) {
        throw new Error('Error al obtener los hoteles');
      }
      const data = await response.json();
      setHoteles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addHotel = async (hotel) => {
    try {
      const response = await fetch('http://localhost:5001/hoteles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotel),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el hotel');
      }

      const nuevoHotel = await response.json();
      setHoteles(prev => [...prev, nuevoHotel]);
      return nuevoHotel;
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

  const fetchAmenidades = async () => {
    try {
      const response = await fetch('http://localhost:5001/hoteles/amenidades');
      if (!response.ok) throw new Error('Error al obtener las amenidades');
      const data = await response.json();
      setAmenidadesDisponibles(data.map(a => a.nombre));
    } catch (err) {
      setError(err.message);
      setAmenidadesDisponibles([]);
    }
  };

  useEffect(() => {
    fetchHoteles();
    fetchPaises();
    fetchAmenidades();
  }, []);

  return {
    hoteles,
    paises,
    ciudades,
    loading,
    error,
    addHotel,
    fetchCiudadesPorPais,
    refreshHoteles: fetchHoteles,
    amenidadesDisponibles
  };
};

export default useHoteles;