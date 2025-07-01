import { FaFilter } from 'react-icons/fa';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const CatalogHeader = ({
  searchTerm,
  onSearch,
  showFilters,
  onToggleFilters,
  filteredCount,
  sortBy,
  onSortChange,
  filters,
  handlers,
  options,
  minMaxPrice
}) => {
  return (
    <div className="catalog-header">
      <h1>Catálogo de Tours</h1>
      <p>Encuentra tu próxima aventura entre más de 50 destinos increíbles</p>

      <SearchBar
        searchTerm={searchTerm}
        onSearch={onSearch}
      />

      <div className="filter-toggle">
        <button
          className={`filter-btn ${showFilters ? 'active' : ''}`}
          onClick={onToggleFilters}
        >
          <FaFilter /> Filtros
        </button>

        <div className="filter-summary">
          <span>Mostrando {filteredCount} resultados</span>

          <div className="sort-container">
            <select value={sortBy} onChange={onSortChange}>
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
        <FilterPanel
          filters={filters}
          handlers={handlers}
          options={options}
          minMaxPrice={minMaxPrice}
          onClose={onToggleFilters}
        />
      )}
    </div>
  );
};

export default CatalogHeader; 