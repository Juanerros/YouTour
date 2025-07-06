import axios from '../../../api/axios';

export const catalogService = {
  // Obtener todos los paquetes disponibles
  async getAllPackages() {
    try {
      const response = await axios.get('/paquetes/all/detallados');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener paquetes');
    }
  },

  // Obtener paquetes básicos (sin detalles)
  async getBasicPackages() {
    try {
      const response = await axios.get('/paquetes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener paquetes');
    }
  },

  // Obtener un paquete específico por ID
  async getPackageById(id) {
    try {
      const response = await axios.get(`/paquetes/${id}/detallado`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el paquete');
    }
  },

  // Funciones auxiliares para filtros
  filterPackages(packages, filters) {
    return packages.filter(pkg => {
      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          pkg.nombre?.toLowerCase().includes(searchLower) ||
          pkg.descripcion?.toLowerCase().includes(searchLower) ||
          pkg.vuelo?.destino_nombre?.toLowerCase().includes(searchLower) ||
          pkg.vuelo?.destino_pais_nombre?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por precio
      if (filters.priceRange) {
        const price = pkg.precio_base;
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false;
        }
      }

      // Filtro por origen
      if (filters.origin && filters.origin !== 'todos') {
        const origin = pkg.vuelo?.origen_nombre?.toLowerCase();
        if (origin !== filters.origin.toLowerCase()) {
          return false;
        }
      }

      // Filtro por destino
      if (filters.destination && filters.destination !== 'todos') {
        const destination = pkg.vuelo?.destino_pais_nombre?.toLowerCase();
        if (destination !== filters.destination.toLowerCase()) {
          return false;
        }
      }

      // Filtro por duración
      if (filters.duration) {
        const duration = pkg.duracion_dias || 0;
        if (duration < filters.duration.min || duration > filters.duration.max) {
          return false;
        }
      }

      // Filtro por fecha
      if (filters.dateRange) {
        const startDate = new Date(pkg.fecha_inicio);
        const filterStart = new Date(filters.dateRange.start);
        const filterEnd = new Date(filters.dateRange.end);
        
        if (startDate < filterStart || startDate > filterEnd) {
          return false;
        }
      }

      return true;
    });
  },

  // Ordenar paquetes
  sortPackages(packages, sortBy) {
    const sorted = [...packages];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.precio_base - b.precio_base);
      case 'price-desc':
        return sorted.sort((a, b) => b.precio_base - a.precio_base);
      case 'name-asc':
        return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'name-desc':
        return sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'duration-asc':
        return sorted.sort((a, b) => (a.duracion_dias || 0) - (b.duracion_dias || 0));
      case 'duration-desc':
        return sorted.sort((a, b) => (b.duracion_dias || 0) - (a.duracion_dias || 0));
      default:
        return sorted;
    }
  },

  // Paginar resultados
  paginatePackages(packages, page = 1, limit = 12) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      packages: packages.slice(startIndex, endIndex),
      totalPages: Math.ceil(packages.length / limit),
      currentPage: page,
      totalItems: packages.length
    };
  }
};

export default catalogService; 