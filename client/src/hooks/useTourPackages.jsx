import { useState, useEffect } from 'react';
import axios from '../api/axios';

const useTourPackages = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        const response = await axios.get('/paquetes/all/detallados');

        if(response.status != 200) {
          console.error(response.error.message);
          setError(response.data.message);
          return;
        };

        const data = response.data;

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
            nombre: paquete.nombre || 'Tour sin nombre',
            descripcion: paquete.descripcion || '',
            pais: safeGet(paquete, 'vuelo.destino_pais_nombre', paquete.pais || 'País'),
            ciudad: safeGet(paquete, 'vuelo.destino_nombre', paquete.ciudad || 'Ciudad'),
            estado: paquete.esta_reservado ? 'Reservado' : 'Disponible',
            image: paquete.imagen || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
            location: `${safeGet(paquete, 'vuelo.destino_nombre', 'Destino')}, ${safeGet(paquete, 'vuelo.destino_pais_nombre', 'País')}`,
            title: paquete.nombre || 'Tour sin nombre',
            currentPrice: paquete.precio_base || 1000,
            originalPrice: paquete.precio_original || paquete.precio_base || 1000,
            duration: paquete.duracion_dias || 3,
            nights: Math.max((paquete.duracion_dias || 3) - 1, 0),
            dateInit: paquete.fecha_inicio ? new Date(paquete.fecha_inicio).toLocaleDateString() : "Próximamente",
            maxPersons: paquete.cantidad_personas || 6,
            persons: 1,
            rating: safeGet(paquete, 'hotel.rating', 4.5),
            reviews: paquete.reviews || 100,
            additionalServices: Array.isArray(paquete.servicios) ? paquete.servicios.map(service => ({
              selected: false,
              price: service.precio || 0,
              icon: service.icono || 'service',
              name: service.nombre || 'Servicio',
              id: service.id_servicio
            })) : [],
            activities: Array.isArray(paquete.actividades) ? paquete.actividades.map(activity => ({
              id: activity.id_actividad,
              name: activity.nombre,
              type: activity.tipo,
              price: activity.precio,
              duration: activity.duracion,
              description: activity.descripcion,
              city: activity.ciudad_nombre || safeGet(paquete, 'vuelo.destino_nombre', 'Ciudad'),
            })) : [],
            hotel: {
              id: safeGet(paquete, 'hotel.id_hotel', 0),
              name: safeGet(paquete, 'hotel.nombre', 'Hotel 4★'),
              rating: safeGet(paquete, 'hotel.rating', 4.5),
              description: safeGet(paquete, 'hotel.descripcion', ''),
            },
            vuelo: {
              id: safeGet(paquete, 'vuelo.id_vuelo', 0),
              airline: safeGet(paquete, 'vuelo.aerolinea', 'Aerolínea'),
              duration: safeGet(paquete, 'vuelo.duracion', '2h'),
              departureDate: paquete.vuelo?.salida ? new Date(paquete.vuelo.salida).toLocaleDateString() : '',
              departureTime: paquete.vuelo?.salida ? new Date(paquete.vuelo.salida).toLocaleTimeString() : '',
              arrivalDate: paquete.vuelo?.llegada ? new Date(paquete.vuelo.llegada).toLocaleDateString() : '',
              arrivalTime: paquete.vuelo?.llegada ? new Date(paquete.vuelo.llegada).toLocaleTimeString() : '',
            },
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