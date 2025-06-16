import { FaStar, FaRegClock, FaMoon, FaUsers, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import './styles.css';

const TourPackage = ({ package: pkg, onAddToCart }) => {
  return (
    <div className="tour-package">
      <div className="package-header">
        <img src={pkg.image} alt={pkg.title} className="package-image" />
        <div className="package-location-2">
          <span>{pkg.location}</span>
        </div>
        <div className="package-rating-2">
          <FaStar className="star-icon" />
          <span>{pkg.rating}</span>
          <span className="reviews-2">({pkg.reviews})</span>
        </div>
      </div>
      
      <div className="package-body">
        <h3 className="package-title">{pkg.title}</h3>
        
        <div className="package-details">
          <div className="detail-item">
            <FaRegClock className="detail-icon" />
            <span>{pkg.duration} días / {pkg.nights} noches</span>
          </div>
          <div className="detail-item">
            <FaUsers className="detail-icon" />
            <span>{pkg.persons} personas</span>
          </div>
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>{pkg.date}</span>
          </div>
        </div>
        
        <div className="package-includes">
          <h4>Incluye:</h4>
          <ul>
            {pkg.includes.map((item, index) => (
              <li key={index}>
                <FaCheck className="check-icon" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="package-footer">
        <div className="package-price">
          <div className="original-price">
            <span>Desde</span>
            <span className="price-value">${pkg.originalPrice} ARS</span>
          </div>
          <div className="current-price">
            <span className="price-value">${pkg.currentPrice} ARS</span>
          </div>
        </div>
        
        <div className="package-actions">
          <button className="btn-details">Ver Detalles</button>
          <button className="btn-add-cart" onClick={onAddToCart} >Añadir al Carrito</button>
        </div>
      </div>
    </div>
  );
};

export default TourPackage;