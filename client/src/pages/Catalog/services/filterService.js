export const applyFilters = (tourPackages, filters) => {
  let filtered = [...tourPackages];

  const {
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
  } = filters;

  // Filtro por término de búsqueda
  if (searchTerm) {
    filtered = filtered.filter(trip =>
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.province.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filtro por destino
  if (selectedDestination) {
    filtered = filtered.filter(trip => trip.province === selectedDestination);
  }

  // Filtro por país
  if (selectedCountry) {
    filtered = filtered.filter(trip => trip.country === selectedCountry);
  }

  // Filtro por categoría
  if (selectedCategory) {
    filtered = filtered.filter(trip => trip.category === selectedCategory);
  }

  // Filtro por valoración
  if (selectedRating > 0) {
    filtered = filtered.filter(trip => trip.rating >= selectedRating);
  }

  // Filtro por dificultad
  if (selectedDifficulty) {
    filtered = filtered.filter(trip => trip.difficulty === selectedDifficulty);
  }

  // Filtro por alojamiento
  if (selectedAccommodation) {
    filtered = filtered.filter(trip => trip.accommodation === selectedAccommodation);
  }

  // Filtro por comidas
  if (selectedMeals) {
    filtered = filtered.filter(trip => trip.meals === selectedMeals);
  }

  // Filtro por tamaño de grupo
  if (selectedGroupSize) {
    filtered = filtered.filter(trip => trip.groupSize === selectedGroupSize);
  }

  // Filtro por rango de precio (solo aplicar si no es el rango por defecto muy amplio)
  if (priceRange[1] !== 10000) {
    filtered = filtered.filter(trip =>
      trip.currentPrice >= priceRange[0] && trip.currentPrice <= priceRange[1]
    );
  }

  // Filtro por meses seleccionados
  if (selectedMonths.length > 0) {
    filtered = filtered.filter(trip => {
      const monthName = trip.date.split(' ')[1];
      return selectedMonths.some(month => month.toLowerCase().startsWith(monthName));
    });
  }

  // Filtro por duración
  filtered = filtered.filter(trip =>
    trip.duration >= selectedDuration[0] && trip.duration <= selectedDuration[1]
  );

  // Filtro por servicios incluidos
  const activeIncludes = Object.entries(selectedIncludes)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  if (activeIncludes.length > 0) {
    filtered = filtered.filter(trip =>
      activeIncludes.some(include =>
        trip.includes.some(item => item.toLowerCase().includes(include.toLowerCase()))
      )
    );
  }

  // Ordenamiento
  switch (sortBy) {
    case 'valorados':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'precio-asc':
      filtered.sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case 'precio-desc':
      filtered.sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case 'duracion':
      filtered.sort((a, b) => a.duration - b.duration);
      break;
    case 'popularidad':
      filtered.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      break;
  }

  return filtered;
}; 