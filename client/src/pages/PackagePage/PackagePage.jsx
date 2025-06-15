import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaCalendarAlt, FaUsers, FaMoon, FaCheck, FaShoppingCart, FaArrowLeft, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import './style.css';

const tourPackages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
      location: "París, Francia",
      title: "Escapada Romántica a París",
      rating: 4.8,
      reviews: 254,
      originalPrice: 1599,
      currentPrice: 1299,
      duration: 4,
      nights: 3,
      persons: "2-6",
      date: "14 jul",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel 4 estrellas",
        "Desayuno incluido",
        "Tour Torre Eiffel"
      ],
      description: "Disfruta de una escapada romántica a la Ciudad de la Luz. Este paquete incluye alojamiento en un hotel de 4 estrellas en el centro de París, desayuno diario y un tour exclusivo a la Torre Eiffel.",
      highlights: [
        "Visita guiada a la Torre Eiffel",
        "Crucero por el río Sena",
        "Cena romántica en restaurante con vista a la ciudad",
        "Visita al Museo del Louvre"
      ],
      hotel: "Hotel Le Marais Parisien",
      hotelRating: 4,
      departureDate: "25 de julio de 2024",
      returnDate: "28 de julio de 2024",
      additionalInfo: "El paquete incluye vuelos directos desde Madrid."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=2088",
      location: "Interlaken, Suiza",
      title: "Aventura en los Alpes Suizos",
      rating: 4.9,
      reviews: 186,
      originalPrice: 2199,
      currentPrice: 1899,
      duration: 7,
      nights: 6,
      persons: "2-8",
      date: "21 jul",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel de montaña",
        "Excursión alpinismo",
        "Vuelo en parapente"
      ],
      description: "Vive una experiencia única en los majestuosos Alpes Suizos. Este paquete incluye alojamiento en un acogedor hotel de montaña, excursiones de alpinismo guiadas y la emocionante experiencia de volar en parapente.",
      highlights: [
        "Excursión de alpinismo con guías profesionales",
        "Vuelo en parapente sobre los Alpes",
        "Visita al glaciar Jungfrau",
        "Experiencia en teleférico panorámico"
      ],
      hotel: "Alpine Resort",
      hotelRating: 4.5,
      departureDate: "21 de julio de 2024",
      returnDate: "27 de agosto de 2024",
      additionalInfo: "Se recomienda llevar ropa adecuada para actividades de montaña."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996",
      location: "Roma, Italia",
      title: "Tour Histórico por Roma",
      rating: 4.7,
      reviews: 163,
      originalPrice: 1699,
      currentPrice: 999,
      duration: 4,
      nights: 3,
      persons: "2-8",
      date: "5 sep",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel céntrico",
        "Desayuno",
        "Visita Coliseo",
        "Visita Vaticano"
      ],
      description: "Sumérgete en la historia de la Ciudad Eterna con este tour por Roma. Visita el imponente Coliseo, los Museos Vaticanos y la Capilla Sixtina. Alójate en un hotel céntrico y disfruta de la auténtica gastronomía italiana.",
      highlights: [
        "Visita guiada al Coliseo y Foro Romano",
        "Tour por los Museos Vaticanos y la Capilla Sixtina",
        "Experiencia gastronómica italiana",
        "Visita a la Fontana di Trevi y Piazza Navona"
      ],
      itinerary: [
        {
          day: 1,
          title: "Llegada a Roma",
          description: "Llegada al aeropuerto de Roma Fiumicino. Traslado al hotel y check-in. Paseo de orientación por el centro histórico."
        },
        {
          day: 2,
          title: "Coliseo y Roma Antigua",
          description: "Desayuno en el hotel. Visita guiada al Coliseo, Foro Romano y Palatino. Tarde libre para explorar la ciudad."
        },
        {
          day: 3,
          title: "Ciudad del Vaticano",
          description: "Desayuno en el hotel. Visita a los Museos Vaticanos, Capilla Sixtina y Basílica de San Pedro. Tarde libre para compras."
        },
        {
          day: 4,
          title: "Regreso",
          description: "Desayuno en el hotel. Tiempo libre para últimas visitas. Traslado al aeropuerto para el vuelo de regreso."
        }
      ],
      hotel: "Hotel Roma Centrale",
      hotelRating: 4,
      departureDate: "5 de septiembre de 2024",
      returnDate: "8 de septiembre de 2024",
      additionalInfo: "Las entradas a los monumentos están incluidas. Se recomienda llevar ropa adecuada para la visita al Vaticano (hombros y rodillas cubiertos)."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070",
      location: "Santorini, Grecia",
      title: "Relax en las Islas Griegas",
      rating: 4.9,
      reviews: 210,
      originalPrice: 2299,
      currentPrice: 1899,
      duration: 7,
      nights: 6,
      persons: "2-4",
      date: "10 ago",
      includes: [
        "Vuelos ida y vuelta",
        "Villa con vista al mar",
        "Desayuno incluido",
        "Tour en barco"
      ]
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
      location: "Praga, República Checa",
      title: "Magia Medieval en Praga",
      rating: 4.6,
      reviews: 142,
      originalPrice: 1399,
      currentPrice: 1099,
      duration: 5,
      nights: 4,
      persons: "2-6",
      date: "3 oct",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel boutique",
        "Desayuno incluido",
        "Tour nocturno"
      ]
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070",
      location: "Barcelona, España",
      title: "Descubre Barcelona",
      rating: 4.8,
      reviews: 178,
      originalPrice: 1499,
      currentPrice: 1199,
      duration: 5,
      nights: 4,
      persons: "2-8",
      date: "17 sep",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel 4 estrellas",
        "Desayuno incluido",
        "Tour Sagrada Familia"
      ]
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=2071",
      location: "Venecia, Italia",
      title: "Romántica Venecia",
      rating: 4.7,
      reviews: 156,
      originalPrice: 1799,
      currentPrice: 1499,
      duration: 4,
      nights: 3,
      persons: "2-4",
      date: "25 ago",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel junto al canal",
        "Paseo en góndola",
        "Desayuno incluido"
      ]
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=2070",
      location: "Ámsterdam, Países Bajos",
      title: "Encanto de Ámsterdam",
      rating: 4.6,
      reviews: 132,
      originalPrice: 1399,
      currentPrice: 1199,
      duration: 4,
      nights: 3,
      persons: "2-6",
      date: "8 oct",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel céntrico",
        "Tour en bicicleta",
        "Crucero por los canales"
      ]
    }
  ];

const PackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  useEffect(() => {
    const packageId = parseInt(id);
    const foundPackage = tourPackages.find(pkg => pkg.id === packageId);
    
    if (foundPackage) {
      setSelectedPackage(foundPackage);
    } else {
      navigate('/catalog');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    alert(`Paquete "${selectedPackage.title}" añadido al carrito`);
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

  if (!selectedPackage) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="package-page">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver al catálogo
      </div>
      
      <div className="package-container">
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
                <div key={index} className="include-item">
                  <FaCheck className="include-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="package-section">
            <h2>Características destacadas</h2>
            <div className="highlights-grid">
              {selectedPackage.highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">
                    <span>{index + 1}</span>
                  </div>
                  <div className="highlight-text">{highlight}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="booking-card">
          <div className="price">
            <span className="current-price">{selectedPackage.currentPrice} €</span>
            <span className="per-person">por persona</span>
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
            <span className="hotel-value">{selectedPackage.hotel}</span>
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