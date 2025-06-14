import './styles.css';
import { FaSearch, FaFilter, FaGift, FaClock, FaPercent, FaClock as FaSupport, FaUsers, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TourPackage from '../../components/Cards/TourPackage/TourPackage';
import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaHeadset } from 'react-icons/fa';
import HomeSlider from './components/HomeSlider';

const Home = () => {
  const [packages, setPackages] = useState([]);
        const [filteredPackages, setFilteredPackages] = useState([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [showFilters, setShowFilters] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const packagesPerPage = 6;
        
        useEffect(() => {
          setPackages(tourPackages);
        setFilteredPackages(tourPackages);
        }, []);
        
        const handleSearch = (e) => {
          const term = e.target.value;
        setSearchTerm(term);
          
          const filtered = packages.filter(pkg =>
        pkg.title.toLowerCase().includes(term.toLowerCase()) ||
        pkg.location.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredPackages(filtered);
        setCurrentPage(1);
        };

        const indexOfLastPackage = currentPage * packagesPerPage;
        const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
        const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
        
        const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const offers = [
    {
      title: "Paquete Todo Incluido",
      subtitle: "Servicios gratuitos en tu primer viaje",
      description: "Transfer, seguro y guía privado sin costo adicional",
      icon: <FaGift />,
      color: "linear-gradient(90deg, #e65c00, #F9423D)",
      buttonText: "Ver Ofertas"
    },
    {
      title: "Reserva Anticipada",
      subtitle: "Ahorra hasta €200 reservando con 3 meses de antelación",
      description: "Planifica tu viaje perfecto y obtén los mejores precios",
      icon: <FaClock />,
      color: "linear-gradient(90deg, #2E8B57, #00b09b)",
      buttonText: "Ver Ofertas"
    },
    {
      title: "¡Oferta Especial Europa!",
      subtitle: "Hasta 30% de descuento en paquetes seleccionados",
      description: "Descubre las ciudades más hermosas de Europa con precios increíbles",
      icon: <FaPercent />,
      color: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
      buttonText: "Ver Ofertas"
    }
  ];

  const features = [
    {
      icon: <FaSupport className="feature-icon" />,
      title: "Viajes Seguros",
      description: "Seguro completo incluido en todos nuestros paquetes"
    },
    {
      icon: <FaSupport className="feature-icon" />,
      title: "Soporte 24/7",
      description: "Asistencia disponible en cualquier momento del día"
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Guías Expertos",
      description: "Profesionales locales con amplio conocimiento"
    },
    {
      icon: <FaStar className="feature-icon" />,
      title: "Experiencias Únicas",
      description: "Tours exclusivos que no encontrarás en otro lugar"
    }
  ];

  return (
    <div className='Home'>
      <div className="hero">
        <div className="hero-content">
          <span className="special-offer">✈ Ofertas especiales disponibles</span>
          <h1>Explora el mundo con You<span>Tour</span></h1>
          <p>Descubre destinos increíbles con nuestros paquetes turísticos todo incluido. Vuelos, hoteles y experiencias únicas diseñadas para crear recuerdos inolvidables.</p>

          <div className="search-container">
            <div className="search-input">
              <input type="text" placeholder="¿A dónde quieres viajar?" />
            </div>

            <button className="search-btn rounded">
              <FaSearch /> Buscar Viajes
            </button>
          </div>
        </div>
      </div>
      <HomeSlider />
      <section className="why-us">
        <div className="why-us-content">
          <h2>¿Por qué elegir youTour?</h2>
          <p>Ofrecemos una experiencia de viaje completa con los más altos estándares de calidad y servicio</p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="special-offers-container">
        <div className="special-offers-content">
          <h2>OFERTAS ESPECIALES</h2>
          <p>Descubre nuestras promociones exclusivas y vive experiencias únicas con los mejores precios</p>

          <div className="offers-grid">
            <div className="offer-large" style={{
              backgroundImage: 'linear-gradient(rgba(255, 99, 71, 0.85), rgba(255, 99, 71, 0.85)), url("https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070")'
            }}>
              <div className="offer-content">
                <h3>OFERTAS DE VERANO</h3>
                <h4>Hasta 40% de descuento en destinos europeos</h4>
                <p>Descubre Europa con los mejores precios del año. Viajes únicos e inolvidables te esperan.</p>
                <button>Ver Ofertas →</button>
              </div>
            </div>

            <div className="offers-column">
              <div className="offer-small" style={{
                backgroundImage: 'linear-gradient(rgba(72, 61, 139, 0.85), rgba(72, 61, 139, 0.85)), url("https://images.unsplash.com/photo-1480996408299-fc0e830b5db1?q=80&w=2069")'
              }}>
                <div className="offer-content">
                  <h3>ESCAPADAS MÁGICAS</h3>
                  <h4>Destinos únicos para desconectar</h4>
                  <p>Lugares increíbles que cambiarán tu perspectiva del mundo</p>
                  <button>Ver Ofertas →</button>
                </div>
              </div>

              <div className="offer-small" style={{
                backgroundImage: 'linear-gradient(rgba(32, 178, 170, 0.85), rgba(32, 178, 170, 0.85)), url("https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070")'
              }}>
                <div className="offer-content">
                  <h3>EXTREMAS</h3>
                  <h4>Experiencias que desafían tus límites</h4>
                  <p>Adrenalina pura en los lugares más impresionantes</p>
                  <button>Ver Ofertas →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="you-tour-features">
        <div className="features-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#6C5CE7' }}>
              <FaMapMarkerAlt />
            </div>
            <h3>50+</h3>
            <p>Destinos Disponibles</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#00B894' }}>
              <FaUsers />
            </div>
            <h3>10,000+</h3>
            <p>Viajeros Felices</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FF7675' }}>
              <FaCalendarAlt />
            </div>
            <h3>365</h3>
            <p>Días de Aventura</p>
          </div>
        </div>
      </section>
      
      <section className="catalog">
        <div className="catalog-container">
          <h2>Paquetes Turísticos</h2>
          <p>Descubre nuestros paquetes cuidadosamente diseñados para ofrecerte las mejores experiencias de viaje</p>

          <div className="search-filters-container">
            <div className="search-filters">
              <div className="filter-item">
                <label><FaSearch /> Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="filter-item">
                <label><FaMapMarkerAlt /> Destino</label>
                <select>
                  
                </select>
              </div>

              <div className="filter-item">
                <label><FaCalendarAlt /> Fecha</label>
                <input type="date" />
              </div>

              <button className="search-btn">
                <FaSearch /> Buscar
              </button>

              <button
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="advanced-filters">
              <h3>Filtros Avanzados</h3>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Categoría</label>
                  <select>
                    <option>Todas las categorías</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Duración</label>
                  <select>
                    <option>Cualquier duración</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Viajeros</label>
                  <input type="number" min="1" defaultValue="1" />
                </div>
                
                <div className="filter-group">
                  <label>Época del año</label>
                  <select>
                    <option>Cualquier época</option>
                  </select>
                </div>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Transporte</label>
                  <select>
                    <option>Cualquier transporte</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Alojamiento</label>
                  <select>
                    <option>Cualquier alojamiento</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Comidas</label>
                  <select>
                    <option>Sin especificar</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Dificultad</label>
                  <select>
                    <option>Cualquier nivel</option>
                  </select>
                </div>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Idioma del guía</label>
                  <select>
                    <option>Cualquier idioma</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Tamaño del grupo</label>
                  <select>
                    <option>Cualquier tamaño</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Categoría hotel</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} className="star-btn">{star}★</button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="price-range">
                <label>Rango de precio: €0 - €3000</label>
                <input type="range" min="0" max="3000" defaultValue="3000" />
              </div>
              
              <div className="filters-actions">
                <button className="btn-clear">Limpiar Filtros</button>
                <button className="btn-apply">Aplicar Filtros</button>
              </div>
            </div>
          )}

          <div className="packages-grid">
            {currentPackages.map((pkg, index) => (
              <TourPackage key={index} package={pkg} />
            ))}
          </div>

          {filteredPackages.length > packagesPerPage && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredPackages.length / packagesPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="next-page"
                onClick={() => currentPage < Math.ceil(filteredPackages.length / packagesPerPage) && paginate(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredPackages.length / packagesPerPage)}
              >
                Ver más <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="contact">
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <p>Nuestro equipo de expertos en viajes está aquí para ayudarte a crear la experiencia perfecta. Conecta con nosotros y comienza a planificar tu próxima aventura.</p>
          
          <div className="contact-stats">
            <div className="contact-stat-card">
              <div className="contact-stat-icon">
                <FaUsers />
              </div>
              <h3>10,000+</h3>
              <p>Clientes Satisfechos</p>
            </div>
            
            <div className="contact-stat-card">
              <div className="contact-stat-icon">
                <FaClock />
              </div>
              <h3>15</h3>
              <p>Tiempos Reducidos</p>
            </div>
            
            <div className="contact-stat-card">
              <div className="contact-stat-icon">
                <FaHeadset />
              </div>
              <h3>24h</h3>
              <p>Tiempo de Respuesta</p>
            </div>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Información de Contacto</h3>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-details">
                  <h4>Línea Directa</h4>
                  <p>+34 900 123 456</p>
                  <span>Lunes a Viernes: 9:00 - 20:00</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Correo Electrónico</h4>
                  <p>info@youtour.com</p>
                  <span>Respuesta garantizada en 24h</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-details">
                  <h4>Oficina Central</h4>
                  <p>Madrid, España</p>
                  <span>Calle del Turismo, 123</span>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <FaHeadset />
                </div>
                <div className="contact-details">
                  <h4>Soporte Online</h4>
                  <p>24/7 Disponible</p>
                  <span>Chat en vivo siempre activo</span>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Envíanos un Mensaje</h3>
              <p>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>
              
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre completo *</label>
                    <input type="text" required />
                  </div>
                  
                  <div className="form-group">
                    <label>Correo electrónico *</label>
                    <input type="email" required />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="tel" />
                  </div>
                  
                  <div className="form-group">
                    <label>Asunto *</label>
                    <input type="text" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Mensaje *</label>
                  <textarea rows="5" required placeholder="Cuéntanos más detalles sobre tu consulta o viaje que deseas planear."></textarea>
                </div>
                
                <div className="form-privacy">
                  <p>Al enviar este formulario, aceptas nuestros términos y política de datos.</p>
                </div>
                
                <button type="submit" className="submit-btn">Enviar Mensaje</button>
              </form>
            </div>
          </div>
          
          <div className="location-map">
            <h3>Nuestra ubicación</h3>
            <div className="map-container">
              <div className="map-info">
                <div className="map-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Oficina Principal</h4>
                  <p>Calle del Turismo, 123</p>
                  <p>28001 Madrid</p>
                </div>
              </div>
              <div className="map-placeholder">
                {/* Vincular el google maps despues */}
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=Madrid,Spain&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CMadrid,Spain&key="/>
              </div>
            </div>
          </div>
        </div>
      </section>    </div>
  );
};

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
    ]
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
    duration: 5,
    nights: 4,
    persons: "2-8",
    date: "21 jul",
    includes: [
      "Vuelos ida y vuelta",
      "Hotel de montaña",
      "Excursión alpinismo",
      "Vuelo en parapente"
    ]
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
    ]
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

export default Home;
