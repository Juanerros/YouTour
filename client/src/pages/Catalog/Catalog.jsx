import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import "./style.css";
import useCatalogFilters from "./hooks/useCatalogFilters";
import { UserContext } from "../../contexts/UserContext";
import useNotification from "../../hooks/useNotification";
import axios from "../../api/axios";
import FilterSidebar from "./components/FilterSidebar";
import CatalogControls from "./components/CatalogControls";
import PackageGrid from "./components/PackageGrid";
import Pagination from "./components/Pagination";

const Catalog = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { notify } = useNotification();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    document.title = "YouTour - Catálogo";
  }, []);

  const {
    packages,
    totalPackages,
    loading,
    error,
    filters,
    availableOrigins,
    availableDestinations,
    priceRange,
    updateSearch,
    updatePriceRange,
    updateOrigin,
    updateDestination,
    updateDuration,
    clearFilters,
    sortBy,
    updateSortBy,
    sortOptions,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  } = useCatalogFilters();

  const handlePackageClick = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  const handleAddToCart = async (packageId, event) => {
    event.stopPropagation();

    if (!user) {
      notify(
        "Debes iniciar sesión para añadir productos al carrito",
        "warning"
      );
      navigate("/auth");
      return;
    }

    try {
      setAddingToCart(packageId);
      const response = await axios.post("/cart/add", {
        userId: user.id_user,
        paqueteId: packageId,
      });

      if (response.status === 201) {
        notify("Paquete añadido al carrito exitosamente", "success");
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      notify(
        error.response?.data?.message || "Error al agregar al carrito",
        "error"
      );
    } finally {
      setAddingToCart(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="catalog-loading">
        <FaSpinner className="spinner" />
        <p>Cargando paquetes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-error">
        <h3>Error al cargar los paquetes</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="catalog-container">

      {/* Layout principal */}
      <div className="catalog-layout">
        {/* Filtros laterales */}
        <FilterSidebar
          showMobileFilters={showMobileFilters}
          onCloseMobileFilters={() => setShowMobileFilters(false)}
          filters={filters}
          availableOrigins={availableOrigins}
          availableDestinations={availableDestinations}
          priceRange={priceRange}
          onClearFilters={clearFilters}
          onUpdateOrigin={updateOrigin}
          onUpdateDestination={updateDestination}
          onUpdatePriceRange={updatePriceRange}
          onUpdateDuration={updateDuration}
          formatPrice={formatPrice}
        />

        {/* Contenido principal */}
        <div className="catalog-content">
          {/* Controles superiores */}
          <CatalogControls
            searchValue={filters.search}
            onSearchChange={updateSearch}
            onShowMobileFilters={() => setShowMobileFilters(true)}
            sortBy={sortBy}
            onSortChange={updateSortBy}
            sortOptions={sortOptions}
            totalPackages={totalPackages}
          />

          <div className="results-info">
            <span>{totalPackages} paquetes encontrados</span>
          </div>

          {/* Grid de paquetes */}
          <PackageGrid
            packages={packages}
            onPackageClick={handlePackageClick}
            onAddToCart={handleAddToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
          />

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onGoToPage={goToPage}
          />
        </div>
      </div>

      {/* Overlay para filtros móviles */}
      {showMobileFilters && (
        <div
          className="mobile-filters-overlay"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default Catalog;
