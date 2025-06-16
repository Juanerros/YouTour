import { useState, useEffect } from 'react';

const useHoteles = () => {
  const [hoteles, setHoteles] = useState([]);
  const [filteredHoteles, setFilteredHoteles] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [amenidadesDisponibles, setAmenidadesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoteles = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/hoteles');
      if (!response.ok) {
        throw new Error('Error al obtener los hoteles');
      }
      const data = await response.json();
      setHoteles(data);
      setFilteredHoteles(data); // Inicialmente mostramos todos los hoteles
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para filtrar hoteles por país
  const filterHotelesByPais = async (idPais) => {
    try {
      const response = await fetch(`http://localhost:5001/api/hoteles/pais/${idPais}`);
      if (!response.ok) throw new Error('Error al filtrar hoteles por país');
      const data = await response.json();
      setFilteredHoteles(data);
    } catch (err) {
      setError(err.message);
      setFilteredHoteles([]);
    }
  };

  // Función para resetear el filtro y mostrar todos los hoteles
  const resetHotelFilter = () => {
    setFilteredHoteles(hoteles);
  };

  // Resto de las funciones permanecen igual...
  const addHotel = async (hotel) => {
    try {
      const response = await fetch('http://localhost:5001/api/hoteles', {
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
      setFilteredHoteles(prev => [...prev, nuevoHotel]);
      return nuevoHotel;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchPaises = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/paises');
      if (!response.ok) throw new Error('Error al obtener los países');
      const data = await response.json();
      setPaises(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCiudadesPorPais = async (idPais) => {
    try {
      const response = await fetch(`http://localhost:5001/api/ciudades/pais/${idPais}`);
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
      const response = await fetch('http://localhost:5001/api/hoteles/amenidades');
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
    filteredHoteles, // Ahora usamos filteredHoteles en lugar de hoteles para mostrar
    paises,
    ciudades,
    loading,
    error,
    addHotel,
    fetchCiudadesPorPais,
    refreshHoteles: fetchHoteles,
    amenidadesDisponibles,
    filterHotelesByPais, // Nueva función exportada
    resetHotelFilter // Nueva función exportada
  };
};

export default useHoteles;