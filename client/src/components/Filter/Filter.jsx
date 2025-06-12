import React, { useState } from 'react';
import './style.css';
import { travelData } from '../Cards/prueba.js';

const Filter = ({ onFilterChange }) => {
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [duration, setDuration] = useState([2, 14]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [includes, setIncludes] = useState({
    hotel: false,
    flight: false,
    meals: false,
    breakfast: false,
    drinks: false,
    activities: false,
    tours: false,
    transfers: false,
    spa: false
  });

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleContinentChange = (continent) => {
    setSelectedContinent(continent === selectedContinent ? '' : continent);
    setSelectedCountry('');
    applyFilters();
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country === selectedCountry ? '' : country);
    applyFilters();
  };

  const handleMonthChange = (month) => {
    const newMonths = selectedMonths.includes(month)
      ? selectedMonths.filter(m => m !== month)
      : [...selectedMonths, month];
    setSelectedMonths(newMonths);
    applyFilters();
  };

  const handleIncludeChange = (service) => {
    setIncludes(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
    applyFilters();
  };

  const applyFilters = () => {
    const filters = {
      continent: selectedContinent,
      country: selectedCountry,
      months: selectedMonths,
      duration,
      priceRange,
      includes
    };
    onFilterChange && onFilterChange(filters);
  };

  const getCountryCount = (continent) => {
    return Object.keys(travelData.continents[continent]?.countries || {}).length;
  };

  const getMonthCount = (month) => {
    return travelData.trips.filter(trip => trip.month === month).length;
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3>Filtros</h3>
      </div>

      {/* Destinos */}
      <div className="filter-section">
        <h4>Destinos</h4>
        {Object.keys(travelData.continents).map(continent => (
          <div key={continent} className="continent-item">
            <div 
              className={`continent-header ${selectedContinent === continent ? 'active' : ''}`}
              onClick={() => handleContinentChange(continent)}
            >
              <span className="continent-icon">▶</span>
              <span>{continent}</span>
              <span className="count">{getCountryCount(continent)}</span>
            </div>
            {selectedContinent === continent && (
              <div className="countries-list">
                {Object.keys(travelData.continents[continent].countries).map(country => (
                  <div 
                    key={country}
                    className={`country-item ${selectedCountry === country ? 'selected' : ''}`}
                    onClick={() => handleCountryChange(country)}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Salidas Disponibles */}
      <div className="filter-section">
        <h4>Salidas Disponibles</h4>
        <div className="months-grid">
          {months.map(month => {
            const count = getMonthCount(month);
            return (
              <div key={month} className="month-item">
                <input
                  type="checkbox"
                  id={month}
                  checked={selectedMonths.includes(month)}
                  onChange={() => handleMonthChange(month)}
                />
                <label htmlFor={month}>
                  {month} <span className="count">{count}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Duración */}
      <div className="filter-section">
        <h4>Duración: {duration[0]} - {duration[1]} días</h4>
        <input
          type="range"
          min="2"
          max="14"
          value={duration[1]}
          onChange={(e) => setDuration([duration[0], parseInt(e.target.value)])}
          className="duration-slider"
        />
      </div>

      {/* Precio */}
      <div className="filter-section">
        <h4>Precio (USD)</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Mín"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
          />
          <input
            type="number"
            placeholder="Máx"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 3000])}
          />
        </div>
        <button className="apply-price-btn" onClick={applyFilters}>
          Aplicar Precio
        </button>
      </div>

      {/* Incluye */}
      <div className="filter-section">
        <h4>Incluye</h4>
        <div className="includes-list">
          {Object.keys(includes).map(service => (
            <div key={service} className="include-item">
              <input
                type="checkbox"
                id={service}
                checked={includes[service]}
                onChange={() => handleIncludeChange(service)}
              />
              <label htmlFor={service}>
                {service === 'hotel' && '🏨 Hotel'}
                {service === 'flight' && '✈️ Vuelo'}
                {service === 'meals' && '🍽️ Comidas'}
                {service === 'breakfast' && '🥐 Desayuno'}
                {service === 'drinks' && '🍹 Bebidas'}
                {service === 'activities' && '🎯 Actividades'}
                {service === 'tours' && '🗺️ Tours'}
                {service === 'transfers' && '🚐 Traslados'}
                {service === 'spa' && '💆 Spa'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;