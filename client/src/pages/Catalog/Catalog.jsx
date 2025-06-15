import './style.css';
import { useState, useEffect } from 'react';
import { FaStar, FaFilter, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoon, FaRegClock, FaHotel, FaPlane, FaUtensils, FaRoute, FaUserTie } from 'react-icons/fa';
import TourPackage from '../../components/Cards/TourPackage/TourPackage';
import axios from '../../api/axios';
import { useUser } from '../../hooks/useUser';
import useNotification from '../../hooks/useNotification';

const Catalog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useUser();

  const tourPackages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
      location: "París, Francia",
      title: "Escapada Romántica a París",
      rating: 4.8,
      reviews: 254,
      originalPrice: 1599,
      currentPrice: 1299,
      duration: 4,
      nights: 3,
      persons: "2-6",
      date: "14 jul",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel 4 estrellas",
        "Desayuno incluido",
        "Tour Torre Eiffel"
      ],
      continent: "Europa",
      country: "Francia",
      province: "París",
      category: "Romántico",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel 4★",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés",
      groupSize: "Pequeño"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=2088",
      location: "Interlaken, Suiza",
      title: "Aventura en los Alpes Suizos",
      rating: 4.9,
      reviews: 186,
      originalPrice: 2199,
      currentPrice: 1899,
      duration: 5,
      nights: 4,
      persons: "2-8",
      date: "21 jul",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel de montaña",
        "Excursión alpinismo",
        "Vuelo en parapente"
      ],
      continent: "Europa",
      country: "Suiza",
      province: "Interlaken",
      category: "Aventura",
      difficulty: "Difícil",
      transport: "Avión",
      accommodation: "Hotel 3★",
      meals: "Media pensión",
      guideLanguage: "Español, Inglés, Alemán",
      groupSize: "Mediano"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996",
      location: "Roma, Italia",
      title: "Tour Histórico por Roma",
      rating: 4.7,
      reviews: 163,
      originalPrice: 1699,
      currentPrice: 999,
      duration: 4,
      nights: 3,
      persons: "2-8",
      date: "5 sep",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel céntrico",
        "Desayuno",
        "Visita Coliseo",
        "Visita Vaticano"
      ],
      continent: "Europa",
      country: "Italia",
      province: "Roma",
      category: "Cultural",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel 3★",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés, Italiano",
      groupSize: "Grande"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070",
      location: "Santorini, Grecia",
      title: "Relax en las Islas Griegas",
      rating: 4.9,
      reviews: 210,
      originalPrice: 2299,
      currentPrice: 1899,
      duration: 7,
      nights: 6,
      persons: "2-4",
      date: "10 ago",
      includes: [
        "Vuelos ida y vuelta",
        "Villa con vista al mar",
        "Desayuno incluido",
        "Tour en barco"
      ],
      continent: "Europa",
      country: "Grecia",
      province: "Santorini",
      category: "Playa",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Villa",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés",
      groupSize: "Pequeño"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
      location: "Praga, República Checa",
      title: "Magia Medieval en Praga",
      rating: 4.6,
      reviews: 142,
      originalPrice: 1399,
      currentPrice: 1099,
      duration: 5,
      nights: 4,
      persons: "2-6",
      date: "3 oct",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel boutique",
        "Desayuno incluido",
        "Tour nocturno"
      ],
      continent: "Europa",
      country: "República Checa",
      province: "Praga",
      category: "Cultural",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel Boutique",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés",
      groupSize: "Pequeño"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070",
      location: "Barcelona, España",
      title: "Descubre Barcelona",
      rating: 4.8,
      reviews: 178,
      originalPrice: 1499,
      currentPrice: 1199,
      duration: 5,
      nights: 4,
      persons: "2-8",
      date: "17 sep",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel 4 estrellas",
        "Desayuno incluido",
        "Tour Sagrada Familia"
      ],
      continent: "Europa",
      country: "España",
      province: "Barcelona",
      category: "Cultural",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel 4★",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés, Catalán",
      groupSize: "Mediano"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071",
      location: "Venecia, Italia",
      title: "Romántica Venecia",
      rating: 4.7,
      reviews: 156,
      originalPrice: 1799,
      currentPrice: 1499,
      duration: 4,
      nights: 3,
      persons: "2-4",
      date: "25 ago",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel junto al canal",
        "Paseo en góndola",
        "Desayuno incluido"
      ],
      continent: "Europa",
      country: "Italia",
      province: "Venecia",
      category: "Romántico",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel 4★",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés, Italiano",
      groupSize: "Pequeño"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=2070",
      location: "Ámsterdam, Países Bajos",
      title: "Encanto de Ámsterdam",
      rating: 4.6,
      reviews: 132,
      originalPrice: 1399,
      currentPrice: 1199,
      duration: 4,
      nights: 3,
      persons: "2-6",
      date: "8 oct",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel céntrico",
        "Tour en bicicleta",
        "Crucero por los canales"
      ],
      continent: "Europa",
      country: "Países Bajos",
      province: "Ámsterdam",
      category: "Cultural",
      difficulty: "Fácil",
      transport: "Avión",
      accommodation: "Hotel 3★",
      meals: "Desayuno",
      guideLanguage: "Español, Inglés, Holandés",
      groupSize: "Mediano"
    }
  ];

  const handleAddToCart = async (paqueteId) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post('/cart/add', { userId: user.id_user, paqueteId });

      notify(data.message, 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Error al agregar al carrito', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const [filteredTrips, setFilteredTrips] = useState(tourPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;


  const getAllDestinations = () => {
    const destinations = new Set();
    tourPackages.forEach(trip => {
      destinations.add(trip.province);
    });
    return Array.from(destinations).sort();
  };


  const getAllCountries = () => {
    const countries = new Set();
    tourPackages.forEach(trip => {
      countries.add(trip.country);
    });
    return Array.from(countries).sort();
  };


  const getAllCategories = () => {
    const categories = new Set();
    tourPackages.forEach(trip => {
      categories.add(trip.category);
    });
    return Array.from(categories).sort();
  };


  const getAllDifficulties = () => {
    const difficulties = new Set();
    tourPackages.forEach(trip => {
      difficulties.add(trip.difficulty);
    });
    return Array.from(difficulties).sort();
  };


  const getAllAccommodations = () => {
    const accommodations = new Set();
    tourPackages.forEach(trip => {
      accommodations.add(trip.accommodation);
    });
    return Array.from(accommodations).sort();
  };


  const getAllMeals = () => {
    const meals = new Set();
    tourPackages.forEach(trip => {
      meals.add(trip.meals);
    });
    return Array.from(meals).sort();
  };


  const getAllGroupSizes = () => {
    const groupSizes = new Set();
    tourPackages.forEach(trip => {
      groupSizes.add(trip.groupSize);
    });
    return Array.from(groupSizes).sort();
  };

  const destinations = getAllDestinations();
  const countries = getAllCountries();
  const categories = getAllCategories();
  const difficulties = getAllDifficulties();
  const accommodations = getAllAccommodations();
  const meals = getAllMeals();
  const groupSizes = getAllGroupSizes();


  const getPriceRange = () => {
    let min = Infinity;
    let max = 0;

    tourPackages.forEach(trip => {
      if (trip.currentPrice < min) min = trip.currentPrice;
      if (trip.currentPrice > max) max = trip.currentPrice;
    });

    return [Math.floor(min), Math.ceil(max)];
  };

  const [minMaxPrice] = useState(getPriceRange());


  const applyFilters = () => {
    let filtered = [...tourPackages];


    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.province.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (selectedDestination) {
      filtered = filtered.filter(trip => trip.province === selectedDestination);
    }


    if (selectedCountry) {
      filtered = filtered.filter(trip => trip.country === selectedCountry);
    }


    if (selectedCategory) {
      filtered = filtered.filter(trip => trip.category === selectedCategory);
    }


    if (selectedRating > 0) {
      filtered = filtered.filter(trip => trip.rating >= selectedRating);
    }


    if (selectedDifficulty) {
      filtered = filtered.filter(trip => trip.difficulty === selectedDifficulty);
    }


    if (selectedAccommodation) {
      filtered = filtered.filter(trip => trip.accommodation === selectedAccommodation);
    }


    if (selectedMeals) {
      filtered = filtered.filter(trip => trip.meals === selectedMeals);
    }


    if (selectedGroupSize) {
      filtered = filtered.filter(trip => trip.groupSize === selectedGroupSize);
    }


    filtered = filtered.filter(trip =>
      trip.currentPrice >= priceRange[0] && trip.currentPrice <= priceRange[1]
    );


    if (selectedMonths.length > 0) {
      filtered = filtered.filter(trip => {
        const monthName = trip.date.split(' ')[1];
        return selectedMonths.some(month => month.toLowerCase().startsWith(monthName));
      });
    }

    filtered = filtered.filter(trip =>
      trip.duration >= selectedDuration[0] && trip.duration <= selectedDuration[1]
    );


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


  useEffect(() => {
    const filtered = applyFilters();
    setFilteredTrips(filtered);
    setCurrentPage(1);
  }, [
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
  ]);


  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredTrips.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(filteredTrips.length / packagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
    setPriceRange(minMaxPrice);
    setSelectedMonths([]);
    setSelectedDuration([1, 30]);
    setSelectedIncludes({});
    setSortBy('valorados');
  };


  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


  const durationOptions = [
    { label: "1-3 días", min: 1, max: 3 },
    { label: "4-7 días", min: 4, max: 7 },
    { label: "8-14 días", min: 8, max: 14 },
    { label: "15+ días", min: 15, max: 30 }
  ];


  const includesOptions = [
    { id: "vuelos", label: "Vuelos", icon: <FaPlane /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "comidas", label: "Comidas", icon: <FaUtensils /> },
    { id: "guia", label: "Guía", icon: <FaUserTie /> },
    { id: "transporte", label: "Transporte", icon: <FaRoute /> }
  ];

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Catálogo de Tours</h1>
        <p>Encuentra tu próxima aventura entre más de 50 destinos increíbles</p>

        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar destinos, ciudades o países..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="filter-toggle">
          <button
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filtros
          </button>

          <div className="filter-summary">
            <span>Mostrando {filteredTrips.length} resultados</span>

            <div className="sort-container">
              <select value={sortBy} onChange={handleSortChange}>
                <option value="valorados">Mejor valorados</option>
                <option value="popularidad">Más populares</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="duracion">Duración</option>
              </select>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <h3><FaMapMarkerAlt /> Destino</h3>
                <select
                  value={selectedDestination}
                  onChange={handleDestinationChange}
                >
                  <option value="">Todos los destinos</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaMapMarkerAlt /> País</h3>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Todos los países</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaRoute /> Categoría</h3>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaStar /> Valoración</h3>
                <div className="months-grid">
                  {[4, 4.5, 4.8].map(rating => (
                    <button
                      key={rating}
                      className={selectedRating === rating ? 'active' : ''}
                      onClick={() => handleRatingChange(rating)}
                    >
                      {rating}+ <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3>Precio: ${priceRange[0]} - ${priceRange[1]}</h3>
                <div className="price-inputs">
                  <input
                    type="range"
                    min={minMaxPrice[0]}
                    max={minMaxPrice[1]}
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    className="price-slider min-price"
                  />
                  <input
                    type="range"
                    min={minMaxPrice[0]}
                    max={minMaxPrice[1]}
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="price-slider max-price"
                  />
                </div>
                <div className="price-labels">
                  <span>${minMaxPrice[0]}</span>
                  <span>${minMaxPrice[1]}</span>
                </div>
              </div>

              <div className="filter-group">
                <h3><FaRegClock /> Duración</h3>
                <div className="duration-options">
                  {durationOptions.map((option, index) => (
                    <button
                      key={index}
                      className={selectedDuration[0] === option.min && selectedDuration[1] === option.max ? 'active' : ''}
                      onClick={() => handleDurationChange(option.min, option.max)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3><FaCalendarAlt /> Temporada / Meses</h3>
                <div className="months-grid">
                  {months.map((month, index) => (
                    <button
                      key={index}
                      className={selectedMonths.includes(month) ? 'active' : ''}
                      onClick={() => handleMonthToggle(month)}
                    >
                      {month.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3><FaRoute /> Dificultad</h3>
                <select
                  value={selectedDifficulty}
                  onChange={handleDifficultyChange}
                >
                  <option value="">Cualquier dificultad</option>
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaHotel /> Alojamiento</h3>
                <select
                  value={selectedAccommodation}
                  onChange={handleAccommodationChange}
                >
                  <option value="">Cualquier alojamiento</option>
                  {accommodations.map(accommodation => (
                    <option key={accommodation} value={accommodation}>{accommodation}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaUtensils /> Comidas</h3>
                <select
                  value={selectedMeals}
                  onChange={handleMealsChange}
                >
                  <option value="">Cualquier régimen</option>
                  {meals.map(meal => (
                    <option key={meal} value={meal}>{meal}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3><FaUsers /> Tamaño del grupo</h3>
                <select
                  value={selectedGroupSize}
                  onChange={handleGroupSizeChange}
                >
                  <option value="">Cualquier tamaño</option>
                  {groupSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3>Servicios incluidos</h3>
                <div className="includes-options">
                  {includesOptions.map((option) => (
                    <label key={option.id} className="include-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIncludes[option.id] || false}
                        onChange={() => handleIncludeToggle(option.id)}
                      />
                      <span className="include-icon">{option.icon}</span>
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-btn" onClick={clearFilters}>Limpiar filtros</button>
              <button className="apply-btn" onClick={() => setShowFilters(false)}>Aplicar filtros</button>
            </div>
          </div>
        )}
      </div>

      <div className="catalog-results">
        {filteredTrips.length > 0 ? (
          <>
            <div className="tour-packages-grid">
              {currentPackages.map(trip => (
                <TourPackage key={trip.id} package={trip} onAddToCart={(e) => handleAddToCart(trip.id)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? 'active' : ''}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className="next-page"
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <h3>No se encontraron viajes</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
            <button className="clear-btn" onClick={clearFilters}>Limpiar filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;