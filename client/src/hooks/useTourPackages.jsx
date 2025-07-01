import { useState, useEffect } from 'react';
import axios from '../api/axios';

const useTourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        const { data } = await axios.get('/paquetes/all/detallados');

        // Transformar los datos para que coincidan con el formato esperado
        const formattedData = data.map(paquete => {
          // Función auxiliar para acceso seguro a propiedades anidadas
          const safeGet = (obj, path, defaultValue = '') => {
            try {
              return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
            } catch {
              return defaultValue;
            }
          };

          return {
            id: paquete.id_paquete || paquete.id || 0,
            image: paquete.imagen || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
            location: `${safeGet(paquete, 'vuelo.destino_nombre', 'Destino')}, ${safeGet(paquete, 'vuelo.destino_pais_nombre', 'País')}`,
            title: paquete.nombre || 'Tour sin nombre',
            rating: safeGet(paquete, 'hotel.rating', 4.5),
            reviews: paquete.reviews || 100,
            originalPrice: paquete.precio_original || paquete.precio_base || 1000,
            currentPrice: paquete.precio_base || 1000,
            duration: paquete.duracion_dias || 3,
            nights: Math.max((paquete.duracion_dias || 3) - 1, 0),
            persons: paquete.cantidad_personas || "2-6",
            date: paquete.fecha_inicio || "2024-01-01",
            includes: Array.isArray(paquete.includes) ? paquete.includes : [
              "Vuelos ida y vuelta",
              "Hotel",
              "Desayuno incluido",
              "Tours incluidos"
            ],
            continent: paquete.continente || "Europa",
            country: safeGet(paquete, 'vuelo.destino_pais_nombre', paquete.pais || 'País'),
            province: safeGet(paquete, 'vuelo.destino_nombre', paquete.ciudad || 'Ciudad'),
            category: paquete.categoria || "Cultural",
            difficulty: paquete.dificultad || "Fácil",
            transport: paquete.transporte || "Avión",
            accommodation: paquete.alojamiento || safeGet(paquete, 'hotel.nombre', 'Hotel 4★'),
            meals: paquete.comidas || "Desayuno",
            guideLanguage: paquete.idiomas_guia || "Español, Inglés",
            groupSize: paquete.tamano_grupo || "Pequeño"
          };
        });
                 
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