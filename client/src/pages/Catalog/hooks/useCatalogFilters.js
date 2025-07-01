import { useState, useEffect } from 'react';

const useCatalogFilters = (minMaxPrice = [0, 3000]) => {
  // Estados para los diferentes filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]); // Rango inicial muy amplio
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([1, 30]);
  const [selectedIncludes, setSelectedIncludes] = useState({});
  const [sortBy, setSortBy] = useState('valorados');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState('');
  const [selectedMeals, setSelectedMeals] = useState('');
  const [selectedGroupSize, setSelectedGroupSize] = useState('');

  // Actualizar el rango de precios cuando lleguen los datos reales
  useEffect(() => {
    if (minMaxPrice && minMaxPrice[1] !== 10000 && priceRange[1] === 10000) {
      setPriceRange(minMaxPrice);
    }
  }, [minMaxPrice, priceRange]);

  // Manejadores de eventos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setSelectedDestination(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleAccommodationChange = (e) => {
    setSelectedAccommodation(e.target.value);
  };

  const handleMealsChange = (e) => {
    setSelectedMeals(e.target.value);
  };

  const handleGroupSizeChange = (e) => {
    setSelectedGroupSize(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange([parseInt(e.target.value), priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
  };

  const handleMonthToggle = (month) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handleDurationChange = (min, max) => {
    setSelectedDuration([min, max]);
  };

  const handleIncludeToggle = (include) => {
    setSelectedIncludes({
      ...selectedIncludes,
      [include]: !selectedIncludes[include]
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDestination('');
    setSelectedCountry('');
    setSelectedCategory('');
    setSelectedRating(0);
    setSelectedDifficulty('');
    setSelectedAccommodation('');
    setSelectedMeals('');
    setSelectedGroupSize('');
    // Usar el rango real si está disponible, sino un rango muy amplio
    setPriceRange(minMaxPrice && minMaxPrice[1] !== 10000 ? minMaxPrice : [0, 10000]);
    setSelectedMonths([]);
    setSelectedDuration([1, 30]);
    setSelectedIncludes({});
    setSortBy('valorados');
  };

  return {
    // Estados
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
    
    // Manejadores
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
  };
};

export default useCatalogFilters; 