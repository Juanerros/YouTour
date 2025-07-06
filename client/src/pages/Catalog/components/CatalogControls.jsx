import React from "react";
import { FaFilter } from "react-icons/fa";
import SearchBar from "./SearchBar";

const CatalogControls = ({
  searchValue,
  onSearchChange,
  onShowMobileFilters,
  sortBy,
  onSortChange,
  sortOptions,
  totalPackages
}) => {
  return (
    <div className="catalog-controls">
      <SearchBar 
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />
      
      <button
        className="mobile-filter-btn mobile-only"
        onClick={onShowMobileFilters}
      >
        <FaFilter /> Filtros
      </button>

      <div className="sort-controls">
        <label>Ordenar por:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CatalogControls; 