import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaRegClock, FaHotel, FaPlane, FaUtensils, FaRoute, FaUserTie } from 'react-icons/fa';
import { months, durationOptions } from '../services/catalogService';

const FilterPanel = ({
  filters,
  handlers,
  options,
  minMaxPrice,
  onClose
}) => {
  const {
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
    selectedIncludes
  } = filters;

  const {
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
  } = handlers;

  const {
    destinations,
    countries,
    categories,
    difficulties,
    accommodations,
    meals,
    groupSizes
  } = options;

  const includesOptions = [
    { id: "vuelos", label: "Vuelos", icon: <FaPlane /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "comidas", label: "Comidas", icon: <FaUtensils /> },
    { id: "guia", label: "Guía", icon: <FaUserTie /> },
    { id: "transporte", label: "Transporte", icon: <FaRoute /> }
  ];

  return (
    <div className="filters-panel">
      <div className="filters-grid">
        {/* Filtro de Destino */}
        <div className="filter-group">
          <h3><FaMapMarkerAlt /> Destino</h3>
          <select value={selectedDestination} onChange={handleDestinationChange}>
            <option value="">Todos los destinos</option>
            {destinations.map(dest => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>

        {/* Filtro de País */}
        <div className="filter-group">
          <h3><FaMapMarkerAlt /> País</h3>
          <select value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Todos los países</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Categoría */}
        <div className="filter-group">
          <h3><FaRoute /> Categoría</h3>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Valoración */}
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

        {/* Filtro de Precio */}
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

        {/* Filtro de Duración */}
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

        {/* Filtro de Temporada/Meses */}
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

        {/* Filtro de Dificultad */}
        <div className="filter-group">
          <h3><FaRoute /> Dificultad</h3>
          <select value={selectedDifficulty} onChange={handleDifficultyChange}>
            <option value="">Cualquier dificultad</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Alojamiento */}
        <div className="filter-group">
          <h3><FaHotel /> Alojamiento</h3>
          <select value={selectedAccommodation} onChange={handleAccommodationChange}>
            <option value="">Cualquier alojamiento</option>
            {accommodations.map(accommodation => (
              <option key={accommodation} value={accommodation}>{accommodation}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Comidas */}
        <div className="filter-group">
          <h3><FaUtensils /> Comidas</h3>
          <select value={selectedMeals} onChange={handleMealsChange}>
            <option value="">Cualquier régimen</option>
            {meals.map(meal => (
              <option key={meal} value={meal}>{meal}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Tamaño del grupo */}
        <div className="filter-group">
          <h3><FaUsers /> Tamaño del grupo</h3>
          <select value={selectedGroupSize} onChange={handleGroupSizeChange}>
            <option value="">Cualquier tamaño</option>
            {groupSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Servicios incluidos */}
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
        <button className="clear-btn" onClick={clearFilters}>
          Limpiar filtros
        </button>
        <button className="apply-btn" onClick={onClose}>
          Aplicar filtros
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 