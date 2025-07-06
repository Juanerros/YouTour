import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchValue, onSearchChange }) => {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar destinos, ciudades o países..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar; 