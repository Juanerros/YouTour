import { useState, useEffect, useMemo } from 'react';
import catalogService from '../services/catalogService';

export const useCatalogFilters = () => {
  // Estados para los datos
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    priceRange: { min: 0, max: 200000 },
    origin: 'todos',
    destination: 'todos',
    duration: { min: 1, max: 14 },
    dateRange: null
  });

  // Actualizar rango de precios cuando se cargan los datos
  useEffect(() => {
    if (packages.length > 0) {
      const prices = packages.map(pkg => pkg.precio_base).filter(price => price > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setFilters(prev => ({
          ...prev,
          priceRange: { min, max }
        }));
      }
    }
  }, [packages]);

  // Estados para ordenamiento y paginación
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Cargar paquetes al montar el componente
  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await catalogService.getAllPackages();
      
      // Formatear los datos para que coincidan con el formato esperado
      const formattedPackages = data.map(pkg => ({
        ...pkg,
        // Asegurar que tenemos los campos necesarios
        image: pkg.imagen || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
        location: `${pkg.vuelo?.destino_nombre || 'Destino'}, ${pkg.vuelo?.destino_pais_nombre || 'País'}`,
        title: pkg.nombre || 'Tour sin nombre',
        currentPrice: pkg.precio_base || 0,
        rating: pkg.hotel?.rating || 4.5,
        reviews: pkg.reviews || 100,
        duration: pkg.duracion_dias || 3,
        nights: Math.max((pkg.duracion_dias || 3) - 1, 0),
        maxPersons: pkg.cantidad_personas || 6,
        dateInit: pkg.fecha_inicio ? new Date(pkg.fecha_inicio).toLocaleDateString() : "Próximamente"
      }));

      setPackages(formattedPackages);
    } catch (err) {
      setError(err.message);
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros, ordenamiento y paginación
  const filteredAndSortedPackages = useMemo(() => {
    if (!packages.length) return [];

    // Aplicar filtros
    let filtered = catalogService.filterPackages(packages, filters);
    
    // Aplicar ordenamiento
    filtered = catalogService.sortPackages(filtered, sortBy);
    
    return filtered;
  }, [packages, filters, sortBy]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    return catalogService.paginatePackages(filteredAndSortedPackages, currentPage, itemsPerPage);
  }, [filteredAndSortedPackages, currentPage, itemsPerPage]);

  // Obtener orígenes únicos para el filtro
  const availableOrigins = useMemo(() => {
    const origins = packages
      .map(pkg => pkg.vuelo?.origen_nombre)
      .filter(origin => origin)
      .filter((origin, index, arr) => arr.indexOf(origin) === index)
      .sort();
    
    return [{ value: 'todos', label: 'Todos los orígenes' }].concat(
      origins.map(origin => ({ value: origin, label: origin }))
    );
  }, [packages]);

  // Obtener destinos únicos para el filtro
  const availableDestinations = useMemo(() => {
    const destinations = packages
      .map(pkg => pkg.vuelo?.destino_pais_nombre)
      .filter(dest => dest)
      .filter((dest, index, arr) => arr.indexOf(dest) === index)
      .sort();
    
    return [{ value: 'todos', label: 'Todos los destinos' }].concat(
      destinations.map(dest => ({ value: dest, label: dest }))
    );
  }, [packages]);

  // Obtener rango de precios disponibles
  const priceRange = useMemo(() => {
    if (!packages.length) return { min: 0, max: 200000 };
    
    const prices = packages.map(pkg => pkg.precio_base).filter(price => price > 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [packages]);

  // Handlers para actualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset page when filter changes
  };

  const updateSearch = (searchTerm) => {
    updateFilter('search', searchTerm);
  };

  const updatePriceRange = (min, max) => {
    updateFilter('priceRange', { min, max });
  };

  const updateOrigin = (origin) => {
    updateFilter('origin', origin);
  };

  const updateDestination = (destination) => {
    updateFilter('destination', destination);
  };

  const updateDuration = (min, max) => {
    updateFilter('duration', { min, max });
  };

  const updateDateRange = (start, end) => {
    updateFilter('dateRange', start && end ? { start, end } : null);
  };

  // Handlers para ordenamiento
  const updateSortBy = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  // Handlers para paginación
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: priceRange,
      origin: 'todos',
      destination: 'todos',
      duration: { min: 1, max: 14 },
      dateRange: null
    });
    setCurrentPage(1);
  };

  return {
    // Datos
    packages: paginatedData.packages,
    totalPackages: filteredAndSortedPackages.length,
    loading,
    error,

    // Filtros
    filters,
    availableOrigins,
    availableDestinations,
    priceRange,
    updateFilter,
    updateSearch,
    updatePriceRange,
    updateOrigin,
    updateDestination,
    updateDuration,
    updateDateRange,
    clearFilters,

    // Ordenamiento
    sortBy,
    updateSortBy,
    sortOptions: [
      { value: 'name-asc', label: 'Nombre A-Z' },
      { value: 'name-desc', label: 'Nombre Z-A' },
      { value: 'price-asc', label: 'Precio menor a mayor' },
      { value: 'price-desc', label: 'Precio mayor a menor' },
      { value: 'duration-asc', label: 'Duración menor a mayor' },
      { value: 'duration-desc', label: 'Duración mayor a menor' }
    ],

    // Paginación
    currentPage,
    totalPages: paginatedData.totalPages,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,

    // Utilidades
    reload: loadPackages
  };
};

export default useCatalogFilters; 