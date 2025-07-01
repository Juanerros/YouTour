import TourPackage from '../../../components/Cards/TourPackage/TourPackage';

const CatalogResults = ({
  currentPackages,
  totalPages,
  currentPage,
  onPaginate,
  onAddToCart,
  filteredCount,
  onClearFilters
}) => {
  if (filteredCount === 0) {
    return (
      <div className="catalog-results">
        <div className="no-results">
          <h3>No se encontraron viajes</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
          <button className="clear-btn" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-results">
      <div className="tour-packages-grid">
        {currentPackages.map(trip => (
          <TourPackage
            key={trip.id}
            package={trip}
            onAddToCart={(e) => onAddToCart(trip.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => onPaginate(number)}
              className={currentPage === number ? 'active' : ''}
            >
              {number}
            </button>
          ))}

          <button
            className="next-page"
            onClick={() => currentPage < totalPages && onPaginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogResults; 