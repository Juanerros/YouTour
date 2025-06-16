import { useState, useEffect } from 'react';
import axios from '../api/axios';

const useTourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        const { data } = await axios.get('/paquetes');
        // Transformar los datos para que coincidan con el formato esperado
        const formattedData = data.map(paquete => ({
          id: paquete.id_paquete,
          image: paquete.imagen || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
          location: `${paquete.ciudad}, ${paquete.pais}`,
          title: paquete.nombre,
          rating: paquete.rating || 4.5,
          reviews: paquete.reviews || 100,
          originalPrice: paquete.precio_original || paquete.precio_base,
          currentPrice: paquete.precio_base,
          duration: paquete.duracion_dias,
          nights: paquete.duracion_dias - 1,
          persons: paquete.cantidad_personas || "2-6",
          date: paquete.fecha_inicio,
          includes: paquete.includes || [
            "Vuelos ida y vuelta",
            "Hotel",
            "Desayuno incluido",
            "Tours incluidos"
          ],
          continent: paquete.continente || "Europa",
          country: paquete.pais,
          province: paquete.ciudad,
          category: paquete.categoria || "Cultural",
          difficulty: paquete.dificultad || "Fácil",
          transport: paquete.transporte || "Avión",
          accommodation: paquete.alojamiento || "Hotel 4★",
          meals: paquete.comidas || "Desayuno",
          guideLanguage: paquete.idiomas_guia || "Español, Inglés",
          groupSize: paquete.tamano_grupo || "Pequeño"
        }));
        setTourPackages(formattedData);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchTourPackages();
  }, []);

  return { tourPackages, isLoading, error };
};

export default useTourPackages;