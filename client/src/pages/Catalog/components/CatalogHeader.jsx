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