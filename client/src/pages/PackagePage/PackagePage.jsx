import './style.css';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaCalendarAlt, FaUsers, FaCheck, FaArrowLeft, FaClock, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaUtensils, FaParking, FaDumbbell, FaSpa, FaPlane, FaHotel, FaUmbrellaBeach, FaMountain, FaCamera, FaWalking } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import axios from './../../api/axios';
import useNotification from '../../hooks/useNotification';
import { UserContext } from './../../contexts/UserContext'

const PackagePage = () => {
  const { user } = useContext(UserContext);
  const { notify } = useNotification()
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/paquetes/${id}/detallado`);
      if (response.status === 200) {

        const packageData = response.data;
        // Transformar los datos del carrito al formato esperado por el componente
        const formattedItem = {
          id: packageData.id_paquete,
          nombre: packageData.nombre,
          descripcion: packageData.descripcion,
          pais: packageData.pais,
          ciudad: packageData.ciudad,
          estado: packageData.estado,
          image: packageData.imagen || "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
          location: `${packageData.ciudad || ''}, ${packageData.pais || ''}`.replace(/^, |, $/, ''),
          title: packageData.nombre,
          currentPrice: packageData.precio_base,
          originalPrice: packageData.precio_base,
          duration: packageData.duracion_dias || 5,
          nights: (packageData.duracion_dias || 5) - 1,
          dateInit: packageData.fecha_inicio ? new Date(packageData.fecha_inicio).toLocaleDateString() : "Próximamente",
          date: packageData.fecha_inicio ? new Date(packageData.fecha_inicio).toLocaleDateString() : "Próximamente",
          departureDate: packageData.fecha_inicio ? new Date(packageData.fecha_inicio).toLocaleDateString() : "Próximamente",
          returnDate: packageData.fecha_fin ? new Date(packageData.fecha_fin).toLocaleDateString() : "Próximamente",
          maxPersons: packageData.cantidad_personas,
          persons: 1,
          rating: packageData.hotel?.rating || 0,
          reviews: 0, // Este campo no existe en la BD, se puede calcular después
          includes: packageData.servicios.map(service => ({
            price: service.precio,
            icon: service.icono,
            name: service.nombre,
            id: service.id_servicio
          })),
          activities: packageData.actividades.map(activity => ({
            id: activity.id_actividad,
            name: activity.nombre,
            type: activity.tipo,
            price: activity.precio,
            duration: activity.duracion,
            description: activity.descripcion,
            city: activity.ciudad_nombre,
          })),
                      hotel: {
              id: packageData.hotel.id_hotel,
              name: packageData.hotel.nombre,
              rating: packageData.hotel.rating,
              description: packageData.hotel.descripcion,
              amenidades: packageData.hotel.amenidades || []
            },
          vuelo: {
            id: packageData.vuelo.id_vuelo,
            airline: packageData.vuelo.aerolinea,
            duration: packageData.vuelo.duracion,
            aeronave: packageData.vuelo.aeronave,
            // fecha y hora de salida (usando campo 'salida' de la BD):
            departureDate: new Date(packageData.vuelo.salida).toLocaleDateString(),
            departureTime: new Date(packageData.vuelo.salida).toLocaleTimeString(),
            // fecha y hora de llegada (usando campo 'llegada' de la BD):
            arrivalDate: new Date(packageData.vuelo.llegada).toLocaleDateString(),
            arrivalTime: new Date(packageData.vuelo.llegada).toLocaleTimeString(),
            fechaVuelo: new Date(packageData.vuelo.fecha_vuelo).toLocaleDateString(),
          }
        };

        setSelectedPackage(formattedItem);
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      notify(error.response?.data?.message || 'Error al obtener el paquete', 'error');
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPackageDetails();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/cart/add', { userId: user.id_user, paqueteId: selectedPackage.id });
      if (response.status == 201) {
        notify(response.data.message, 'success');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      notify(error.response?.data?.message || 'Error al agregar al carrito', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />);
      }
    }

    return stars;
  };

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    if (name.includes('wifi') || name.includes('internet')) return <FaWifi />;
    if (name.includes('piscina') || name.includes('pool')) return <FaSwimmingPool />;
    if (name.includes('restaurante') || name.includes('comida') || name.includes('desayuno')) return <FaUtensils />;
    if (name.includes('parking') || name.includes('estacionamiento')) return <FaParking />;
    if (name.includes('gimnasio') || name.includes('fitness')) return <FaDumbbell />;
    if (name.includes('spa') || name.includes('masaje')) return <FaSpa />;
    if (name.includes('aire') || name.includes('climatizado')) return <FaHotel />;
    return <FaCheck />;
  };

  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('vuelo') || name.includes('transporte')) return <FaPlane />;
    if (name.includes('hotel') || name.includes('alojamiento')) return <FaHotel />;
    if (name.includes('comida') || name.includes('desayuno')) return <FaUtensils />;
    if (name.includes('playa') || name.includes('costa')) return <FaUmbrellaBeach />;
    return <FaCheck />;
  };

  const getActivityIcon = (activityType) => {
    const type = activityType.toLowerCase();
    if (type.includes('aventura') || type.includes('montaña')) return <FaMountain />;
    if (type.includes('playa') || type.includes('acuático')) return <FaUmbrellaBeach />;
    if (type.includes('cultural') || type.includes('histórico')) return <FaCamera />;
    if (type.includes('caminata') || type.includes('senderismo')) return <FaWalking />;
    return <FaCheck />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
      </div>
    )
  }

  return (
    <div className="package-page">
      <div className="back-button" onClick={() => navigate('/catalog')}>
        <FaArrowLeft /> Volver al catálogo
      </div>

      <div className="package-container">
        <div className="package-main-content">
          <div className="package-gallery">
            <img src={selectedPackage.image} alt={selectedPackage.title} />
            <div className="gallery-thumbnails">
              <div className="thumbnail active">
                <img src={selectedPackage.image} alt="Thumbnail 1" />
              </div>
              <div className="thumbnail">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070" alt="Thumbnail 2" />
              </div>
              <div className="thumbnail">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070" alt="Thumbnail 3" />
              </div>
              <div className="thumbnail">
                <img src="https://images.unsplash.com/photo-1606117331085-5760e3b58520?q=80&w=1974" alt="Thumbnail 4" />
              </div>
            </div>
          </div>

          <div className="package-details">
          <div className="package-header">
            <h1>{selectedPackage.title}</h1>
            <div className="bot">
              <div className="package-location">
                <FaMapMarkerAlt /> {selectedPackage.location}
              </div>
              <div className="package-rating">
                <div className="stars">
                  {renderStars(selectedPackage.rating)}
                </div>
                <span className="rating-value">{selectedPackage.rating}</span>
                <span className="reviews-count">({selectedPackage.reviews} opiniones)</span>
              </div>
            </div>

          </div>

          <div className="package-features">
            <div className="feature">
              <FaClock />
              <div className="feature-text">
                <span>{selectedPackage.duration} días / {selectedPackage.nights} noches</span>
              </div>
            </div>

            <div className="feature">
              <FaUsers />
              <div className="feature-text">
                <span>{selectedPackage.persons} personas</span>
              </div>
            </div>

            <div className="feature">
              <FaCalendarAlt />
              <div className="feature-text">
                <span>{selectedPackage.date}</span>
              </div>
            </div>

            <div className="feature">
              <FaStar />
              <div className="feature-text">
                <span>{selectedPackage.rating} estrellas</span>
              </div>
            </div>
          </div>

          <div className="package-section">
            <h2>¿Qué incluye este paquete?</h2>
            <div className="includes-grid">
              {selectedPackage.includes.map((item, index) => (
                <div key={item.id || index} className="include-item">
                  <FaCheck className="include-icon" />
                  <span>{item.name || item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Servicios incluidos */}
          {selectedPackage.includes && selectedPackage.includes.length > 0 && (
            <div className="services-section">
              <h2>Servicios incluidos</h2>
              <div className="services-grid">
                {selectedPackage.includes.map((service, index) => (
                  <div key={service.id || index} className="service-item">
                    <div className="service-icon">
                      {getServiceIcon(service.name || service)}
                    </div>
                    <span>{service.name || service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenidades del hotel */}
          {selectedPackage.hotel && selectedPackage.hotel.amenidades && selectedPackage.hotel.amenidades.length > 0 && (
            <div className="amenities-section">
              <h2>Amenidades del hotel</h2>
              <div className="amenities-grid">
                {selectedPackage.hotel.amenidades.map((amenity, index) => (
                  <div key={amenity.id_amenidad || index} className="amenity-item">
                    <div className="amenity-icon">
                      {getAmenityIcon(amenity.nombre)}
                    </div>
                    <span>{amenity.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actividades incluidas */}
          {selectedPackage.activities && selectedPackage.activities.length > 0 && (
            <div className="activities-section">
              <h2>Actividades incluidas</h2>
              <div className="activities-grid">
                {selectedPackage.activities.map((activity, index) => (
                  <div key={activity.id || index} className="activity-item">
                    <div className="activity-header">
                      <h3 className="activity-name">{activity.name}</h3>
                      <span className="activity-type">{activity.type}</span>
                    </div>
                    <p className="activity-description">{activity.description}</p>
                    <div className="activity-details">
                      <div className="activity-detail">
                        <FaClock />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="activity-detail">
                        <FaMapMarkerAlt />
                        <span>{activity.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="booking-card">
          <div className="price">
            <span className="current-price">{selectedPackage.currentPrice} $</span>

          </div>

          <div className="booking-dates">
            <div className="date-row">
              <span className="date-label">Fecha de salida:</span>
              <span className="date-value">{selectedPackage.departureDate}</span>
            </div>
            <div className="date-row">
              <span className="date-label">Fecha de regreso:</span>
              <span className="date-value">{selectedPackage.returnDate}</span>
            </div>
          </div>

          <div className="hotel-info">
            <span className="hotel-label">Hotel:</span>
            <span className="hotel-value">{selectedPackage.hotel.name}</span>
            <div className="hotel-rating">
              <div className="stars">
                {renderStars(selectedPackage.hotel.rating)}
              </div>
              <span className="rating-value">({selectedPackage.hotel.rating})</span>
            </div>
          </div>

          <div className="flight-info">
            <span className="flight-label">Vuelo:</span>
            <div className="flight-details">
              <span className="airline">{selectedPackage.vuelo.airline}</span>
              <span className="aircraft">{selectedPackage.vuelo.aeronave}</span>
              <span className="duration">Duración: {selectedPackage.vuelo.duration}</span>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Añadir al Carrito
          </button>

          <div className="booking-note">
            <small>Cancelación gratuita hasta 30 días antes del viaje. Seguro incluido.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePage;