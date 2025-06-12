import React, { useState, useEffect } from 'react';
import './style.css';
import Filter from '../../components/Filter/Filter';
import CardProduct from '../../components/Cards/CardProduct';
import { travelData } from '../../components/Cards/prueba';

const Catalog = () => {
  const [filteredTrips, setFilteredTrips] = useState(travelData.trips);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [sortBy, setSortBy] = useState('valorados');
  const [currentFilters, setCurrentFilters] = useState({});

  // Obtener todas las provincias únicas
  const getAllProvinces = () => {
    const provinces = new Set();
    Object.values(travelData.continents).forEach(continent => {
      Object.values(continent.countries).forEach(country => {
        country.provinces.forEach(province => provinces.add(province));
      });
    });
    return Array.from(provinces).sort();
  };

  const provinces = getAllProvinces();

  // Función para aplicar filtros
  const applyFilters = (trips, filters, search, province, sort) => {
    let filtered = [...trips];

    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter(trip => 
        trip.name.toLowerCase().includes(search.toLowerCase()) ||
        trip.country.toLowerCase().includes(search.toLowerCase()) ||
        trip.province.toLowerCase().includes(search.toLowerCase()) ||
        trip.continent.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por provincia seleccionada
    if (province) {
      filtered = filtered.filter(trip => trip.province === province);
    }

    // Filtros del componente Filter
    if (filters.continent) {
      filtered = filtered.filter(trip => trip.continent === filters.continent);
    }

    if (filters.country) {
      filtered = filtered.filter(trip => trip.country === filters.country);
    }

    if (filters.months && filters.months.length > 0) {
      filtered = filtered.filter(trip => filters.months.includes(trip.month));
    }

    if (filters.duration) {
      filtered = filtered.filter(trip => 
        trip.duration >= filters.duration[0] && trip.duration <= filters.duration[1]
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(trip => 
        trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1]
      );
    }

    if (filters.includes) {
      const selectedIncludes = Object.entries(filters.includes)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      
      if (selectedIncludes.length > 0) {
        filtered = filtered.filter(trip => 
          selectedIncludes.some(include => trip.includes.includes(include))
        );
      }
    }

    // Ordenamiento
    switch (sort) {
      case 'valorados':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'precio-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'precio-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duracion':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      default:
        break;
    }

    return filtered;
  };

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    const filtered = applyFilters(travelData.trips, currentFilters, searchTerm, selectedProvince, sortBy);
    setFilteredTrips(filtered);
  }, [currentFilters, searchTerm, selectedProvince, sortBy]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="catalog-container">
      {/* Barra de búsqueda superior */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar destinos, ciudades o países..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">
            🔍
          </button>
        </div>
        
        <div className="search-filters">
          <select 
            value={selectedProvince} 
            onChange={handleProvinceChange}
            className="province-select"
          >
            <option value="">Seleccionar provincia en México</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="valorados">Mejor valorados</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="duracion">Duración</option>
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="catalog-content">
        {/* Sidebar con filtros */}
        <aside className="catalog-sidebar">
          <Filter onFilterChange={handleFilterChange} />
        </aside>

        {/* Grid de productos */}
        <main className="catalog-main">
          <div className="results-header">
            <h2>{filteredTrips.length} viajes encontrados</h2>
          </div>
          
          <div className="products-grid">
            {filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <CardProduct key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="no-results">
                <h3>No se encontraron viajes</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Catalog;