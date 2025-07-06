import React from "react";
import TourPackageCard from "./TourPackageCard";

const PackageGrid = ({ 
  packages, 
  onPackageClick, 
  onAddToCart, 
  addingToCart, 
  formatPrice 
}) => {
  return (
    <div className="tour-packages-grid">
      {packages.map((pkg) => (
        <TourPackageCard
          key={pkg.id_paquete}
          package={pkg}
          onPackageClick={onPackageClick}
          onAddToCart={onAddToCart}
          addingToCart={addingToCart}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  );
};

export default PackageGrid; 