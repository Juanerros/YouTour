import React from "react";
import { FaTimes } from "react-icons/fa";

const FilterSidebar = ({
  showMobileFilters,
  onCloseMobileFilters,
  filters,
  availableOrigins,
  availableDestinations,
  priceRange,
  onClearFilters,
  onUpdateOrigin,
  onUpdateDestination,
  onUpdatePriceRange,
  onUpdateDuration,
  formatPrice
}) => {
  return (
    <div className={`catalog-sidebar ${showMobileFilters ? "show" : ""}`}>
      <div className="filters-header">
        <h3>Filtros</h3>
        <button className="clear-filters" onClick={onClearFilters}>
          Limpiar filtros
        </button>
        <button
          className="close-filters mobile-only"
          onClick={onCloseMobileFilters}
        >
          <FaTimes />
        </button>
      </div>

      {/* Filtro por origen */}
      <div className="filter-group">
        <label>Partida</label>
        <select
          value={filters.origin}
          onChange={(e) => onUpdateOrigin(e.target.value)}
        >
          {availableOrigins.map((origin) => (
            <option key={origin.value} value={origin.value}>
              {origin.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por destino */}
      <div className="filter-group">
        <label>Destino</label>
        <select
          value={filters.destination}
          onChange={(e) => onUpdateDestination(e.target.value)}
        >
          {availableDestinations.map((dest) => (
            <option key={dest.value} value={dest.value}>
              {dest.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por precio */}
      <div className="filter-group">
        <label>Precio</label>
        <div className="price-filter">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.priceRange.min}
            onChange={(e) =>
              onUpdatePriceRange(
                parseInt(e.target.value),
                filters.priceRange.max
              )
            }
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.priceRange.max}
            onChange={(e) =>
              onUpdatePriceRange(
                filters.priceRange.min,
                parseInt(e.target.value)
              )
            }
          />
          <div className="price-range-display">
            <span>{formatPrice(filters.priceRange.min)}</span>
            <span> - </span>
            <span>{formatPrice(filters.priceRange.max)}</span>
          </div>
        </div>
      </div>

      {/* Filtro por duración */}
      <div className="filter-group">
        <label>Duración (días)</label>
        <div className="duration-filter">
          <input
            type="range"
            min="1"
            max="14"
            value={filters.duration.min}
            onChange={(e) =>
              onUpdateDuration(parseInt(e.target.value), filters.duration.max)
            }
          />
          <input
            type="range"
            min="1"
            max="14"
            value={filters.duration.max}
            onChange={(e) =>
              onUpdateDuration(filters.duration.min, parseInt(e.target.value))
            }
          />
          <div className="duration-range-display">
            <span>{filters.duration.min}</span>
            <span> - </span>
            <span>{filters.duration.max} días</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 