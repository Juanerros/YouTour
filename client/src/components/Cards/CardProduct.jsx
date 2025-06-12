import React from 'react';
import './CardProduct.css';

const CardProduct = ({ trip }) => {
  const {
    id,
    name,
    continent,
    country,
    province,
    price,
    duration,
    departureDate,
    month,
    image,
    hotel,
    flight,
    includes,
    description,
    rating,
    allInclusive
  } = trip;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getIncludeIcon = (include) => {
    const icons = {
      hotel: '🏨',
      flight: '✈️',
      meals: '🍽️',
      breakfast: '🥐',
      drinks: '🍹',
      activities: '🎯',
      tours: '🗺️',
      transfers: '🚐',
      spa: '💆',
      carnaval: '🎭'
    };
    return icons[include] || '✓';
  };

  const getIncludeText = (include) => {
    const texts = {
      hotel: 'Hotel',
      flight: 'Vuelo',
      meals: 'Comidas',
      breakfast: 'Desayuno',
      drinks: 'Bebidas',
      activities: 'Actividades',
      tours: 'Tours',
      transfers: 'Traslados',
      spa: 'Spa',
      carnaval: 'Carnaval'
    };
    return texts[include] || include;
  };

  return (
    <div className="card-product">
      {allInclusive && (
        <div className="all-inclusive-badge">
          Todo Incluido
        </div>
      )}
      
      <div className="card-image">
        <img src={image} alt={name} />
        <div className="card-location">
          📍 {province}, {country}
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{name}</h3>
          <div className="card-price">
            <span className="price-amount">${price}</span>
            <span className="price-label">por persona</span>
          </div>
        </div>

        <div className="card-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span>Salida: {formatDate(departureDate)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">⏱️</span>
            <span>{duration} días</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🏨</span>
            <span>{hotel}</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">✈️</span>
            <span>{flight}</span>
          </div>
        </div>

        <div className="card-includes">
          <h4>Incluye:</h4>
          <div className="includes-grid">
            {includes.map((include, index) => (
              <div key={index} className="include-tag">
                <span className="include-icon">{getIncludeIcon(include)}</span>
                <span className="include-text">{getIncludeText(include)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-description">
          <p>{description}</p>
        </div>

        <div className="card-footer">
          <div className="rating">
            <span className="stars">⭐</span>
            <span className="rating-value">{rating}</span>
          </div>
          
          <div className="card-actions">
            <button className="btn-details">
              Ver Detalles
            </button>
            <button className="btn-book">
              Al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;