import './style.css';
import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { UserContext } from '../../contexts/UserContext.jsx';

// Hooks personalizados
import useNotification from '../../hooks/useNotification';
import useTourPackages from '../../hooks/useTourPackages';
import useCatalogFilters from './hooks/useCatalogFilters';
import usePagination from './hooks/usePagination';
import useFilteredPackages from './hooks/useFilteredPackages';

// Services
import {
  getAllDestinations,
  getAllCountries,
  getAllCategories,
  getAllDifficulties,
  getAllAccommodations,
  getAllMeals,
  getAllGroupSizes,
  getPriceRange
} from './services/catalogService';

// Components
import CatalogHeader from './components/CatalogHeader';
import CatalogResults from './components/CatalogResults';

const Catalog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { notify } = useNotification();
  const { user } = useContext(UserContext);
  
  // Hook personalizado para obtener los paquetes turísticos
  const { tourPackages, isLoading: isLoadingPackages, error } = useTourPackages();

  useEffect(() => {
    console.log('Los paquetes en Catalog.jsx: ', tourPackages);
  }, [])

  // Obtener rango de precios
  const minMaxPrice = tourPackages ? getPriceRange(tourPackages) : [0, 10000];

  // Hook para manejar filtros
  const {
    searchTerm,
    priceRange,
    selectedMonths,
    selectedDuration,
    selectedIncludes,
    sortBy,
    selectedDestination,
    selectedCountry,
    selectedCategory,
    selectedRating,
    selectedDifficulty,
    selectedAccommodation,
    selectedMeals,
    selectedGroupSize,
    handleSearch,
    handleDestinationChange,
    handleCountryChange,
    handleCategoryChange,
    handleRatingChange,
    handleDifficultyChange,
    handleAccommodationChange,
    handleMealsChange,
    handleGroupSizeChange,
    handleSortChange,
    handlePriceChange,
    handleMaxPriceChange,
    handleMonthToggle,
    handleDurationChange,
    handleIncludeToggle,
    clearFilters
  } = useCatalogFilters(minMaxPrice);

  // Crear objeto de filtros para el hook
  const filters = {
    searchTerm,
    selectedDestination,
    selectedCountry,
    selectedCategory,
    selectedRating,
    selectedDifficulty,
    selectedAccommodation,
    selectedMeals,
    selectedGroupSize,
    priceRange,
    selectedMonths,
    selectedDuration,
    selectedIncludes,
    sortBy
  };

  // Hook para obtener paquetes filtrados
  const filteredPackages = useFilteredPackages(tourPackages, filters);

  // Hook para paginación
  const {
    currentItems: currentPackages,
    totalPages,
    currentPage,
    paginate,
    resetPagination
  } = usePagination(filteredPackages, 6);

  // Resetear paginación cuando cambien los filtros
  useEffect(() => {
    resetPagination();
  }, [filteredPackages.length, resetPagination]);

  // Función para añadir al carrito
  const handleAddToCart = async (paqueteId) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/cart/add', { userId: user.id_user, paqueteId });
      if (response.status == 201) {
        notify(response.data.message, 'success');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      notify(error.response?.data?.message || 'Error al agregar al carrito', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Opciones para filtros
  const filterOptions = tourPackages ? {
    destinations: getAllDestinations(tourPackages),
    countries: getAllCountries(tourPackages),
    categories: getAllCategories(tourPackages),
    difficulties: getAllDifficulties(tourPackages),
    accommodations: getAllAccommodations(tourPackages),
    meals: getAllMeals(tourPackages),
    groupSizes: getAllGroupSizes(tourPackages)
  } : {
    destinations: [],
    countries: [],
    categories: [],
    difficulties: [],
    accommodations: [],
    meals: [],
    groupSizes: []
  };

  // Manejadores de filtros agrupados
  const filterHandlers = {
    handleDestinationChange,
    handleCountryChange,
    handleCategoryChange,
    handleRatingChange,
    handleDifficultyChange,
    handleAccommodationChange,
    handleMealsChange,
    handleGroupSizeChange,
    handlePriceChange,
    handleMaxPriceChange,
    handleMonthToggle,
    handleDurationChange,
    handleIncludeToggle,
    clearFilters
  };

  return (
    <div className="catalog-page">
      <CatalogHeader
        searchTerm={searchTerm}
        onSearch={handleSearch}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filteredCount={filteredPackages.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        filters={filters}
        handlers={filterHandlers}
        options={filterOptions}
        minMaxPrice={minMaxPrice}
      />

      <CatalogResults
        currentPackages={currentPackages}
        totalPages={totalPages}
        currentPage={currentPage}
        onPaginate={paginate}
        onAddToCart={handleAddToCart}
        filteredCount={filteredPackages.length}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default Catalog;