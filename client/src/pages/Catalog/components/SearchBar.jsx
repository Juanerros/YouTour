const SearchBar = ({ searchTerm, onSearch, placeholder = "Buscar destinos, ciudades o países..." }) => {
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={onSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar; 