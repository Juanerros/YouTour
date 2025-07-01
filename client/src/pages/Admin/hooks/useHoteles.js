import { useState, useEffect } from 'react';
import { hotelesService } from '../service/hotelesService';

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
      const data = await hotelesService.getAll();
      setHoteles(data);
      setFilteredHoteles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterHotelesByPais = async (idPais) => {
    try {
      const data = await hotelesService.getByPais(idPais);
      setFilteredHoteles(data);
    } catch (err) {
      setError(err.message);
      setFilteredHoteles([]);
    }
  };

  const resetHotelFilter = () => {
    setFilteredHoteles(hoteles);
  };

  const addHotel = async (hotel) => {
    try {
      const nuevoHotel = await hotelesService.create(hotel);
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
      const data = await hotelesService.getPaises();
      setPaises(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCiudadesPorPais = async (idPais) => {
    try {
      const data = await hotelesService.getCiudadesByPais(idPais);
      setCiudades(data);
    } catch (err) {
      setError(err.message);
      setCiudades([]);
    }
  };

  const fetchAmenidades = async () => {
    try {
      const data = await hotelesService.getAmenidades();
      setAmenidadesDisponibles(data);
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