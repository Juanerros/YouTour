import React from "react";
import { FaMapMarkerAlt, FaClock, FaUsers, FaSpinner, FaStar } from "react-icons/fa";

const TourPackageCard = ({ 
  package: pkg, 
  onPackageClick, 
  onAddToCart, 
  addingToCart, 
  formatPrice 
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div
      className="tour-package-card"
      onClick={() => onPackageClick(pkg.id_paquete)}
    >
      <div className="tour-package-image">
        <img src={pkg.image} alt={pkg.title} />
        <div className="tour-package-overlay">
          <div className="tour-package-rating">
            <div className="rating-stars">
              {renderStars(pkg.rating)}
            </div>
            <span className="rating-text">{pkg.rating} ({pkg.reviews})</span>
          </div>
          <div className="tour-package-location">
            <FaMapMarkerAlt />
            <span>{pkg.location}</span>
          </div>
        </div>
      </div>

      <div className="tour-package-content">
        <h3 className="tour-package-title">{pkg.title}</h3>

        <div className="tour-package-features">
          <div className="feature-item">
            <FaClock />
            <span>{pkg.duration} días / {pkg.nights} noches</span>
          </div>
          <div className="feature-item">
            <FaUsers />
            <span>Hasta {pkg.maxPersons} personas</span>
          </div>
        </div>

        <div className="tour-package-footer">
          <div className="price-section">
            <span className="price-label">Desde</span>
            <div className="price-value">
              {formatPrice(pkg.currentPrice)}
            </div>
            <span className="price-per-person">por persona</span>
          </div>
          
          <button
            className="btn-add-to-cart"
            onClick={(e) => onAddToCart(pkg.id_paquete, e)}
            disabled={addingToCart === pkg.id_paquete}
          >
            {addingToCart === pkg.id_paquete ? (
              <>
                <FaSpinner className="spinner-small" />
                Añadiendo...
              </>
            ) : (
              "Añadir al Carrito"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourPackageCard; 