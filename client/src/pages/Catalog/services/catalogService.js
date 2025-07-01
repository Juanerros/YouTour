export const getAllDestinations = (tourPackages) => {
  const destinations = new Set();
  tourPackages.forEach(trip => {
    destinations.add(trip.province);
  });
  return Array.from(destinations).sort();
};

export const getAllCountries = (tourPackages) => {
  const countries = new Set();
  tourPackages.forEach(trip => {
    countries.add(trip.country);
  });
  return Array.from(countries).sort();
};

export const getAllCategories = (tourPackages) => {
  const categories = new Set();
  tourPackages.forEach(trip => {
    categories.add(trip.category);
  });
  return Array.from(categories).sort();
};

export const getAllDifficulties = (tourPackages) => {
  const difficulties = new Set();
  tourPackages.forEach(trip => {
    difficulties.add(trip.difficulty);
  });
  return Array.from(difficulties).sort();
};

export const getAllAccommodations = (tourPackages) => {
  const accommodations = new Set();
  tourPackages.forEach(trip => {
    accommodations.add(trip.accommodation);
  });
  return Array.from(accommodations).sort();
};

export const getAllMeals = (tourPackages) => {
  const meals = new Set();
  tourPackages.forEach(trip => {
    meals.add(trip.meals);
  });
  return Array.from(meals).sort();
};

export const getAllGroupSizes = (tourPackages) => {
  const groupSizes = new Set();
  tourPackages.forEach(trip => {
    groupSizes.add(trip.groupSize);
  });
  return Array.from(groupSizes).sort();
};

export const getPriceRange = (tourPackages) => {
  if (!tourPackages || tourPackages.length === 0) {
    return [0, 10000]; // Rango más amplio para no filtrar productos
  }
  
  let min = Infinity;
  let max = 0;

  tourPackages.forEach(trip => {
    if (trip.currentPrice < min) min = trip.currentPrice;
    if (trip.currentPrice > max) max = trip.currentPrice;
  });

  return [Math.floor(min), Math.ceil(max)];
};

export const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const durationOptions = [
  { label: "1-3 días", min: 1, max: 3 },
  { label: "4-7 días", min: 4, max: 7 },
  { label: "8-14 días", min: 8, max: 14 },
  { label: "15+ días", min: 15, max: 30 }
];

export const includesOptions = [
  { id: "vuelos", label: "Vuelos", icon: "FaPlane" },
  { id: "hotel", label: "Hotel", icon: "FaHotel" },
  { id: "comidas", label: "Comidas", icon: "FaUtensils" },
  { id: "guia", label: "Guía", icon: "FaUserTie" },
  { id: "transporte", label: "Transporte", icon: "FaRoute" }
]; 