import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaSearch, FaClock, FaClock as FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaPhone, FaEnvelope, FaHeadset } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeSlider from './components/HomeSlider';
import SpecialOffers from './components/SpecialOffers';
import useNotification from '../../hooks/useNotification';
import { UserContext } from '../../contexts/UserContext.jsx';
import useTourPackages from '../../hooks/useTourPackages';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSearchRedirect = () => {
    const query = searchInput.trim();
    if (query) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/catalog');
    }
  };

  const handleContact = (e) => {
    e.preventDefault();
    notify("Se ha enviado el mensaje al correo de YouTour", 'success');
  };

  const handleAddToCart = async (paqueteId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('/cart/add', { userId: user.id_user, paqueteId });
      notify(data.message, 'success');
    } catch (error) {
      notify(error.response?.data?.message || 'Error al agregar al carrito', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPackages(tourPackages);
    setFilteredPackages(tourPackages);
    document.title = "YouTour - Inicio";
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

  return (
    <div className='Home'>
      <div className="hero">
        <div className="hero-content">
          <span className="special-offer">✈ Ofertas especiales disponibles</span>
          <h1>Explora el mundo con You<span>Tour</span></h1>
          <p>Descubre destinos increíbles con nuestros paquetes turísticos todo incluido. Vuelos, hoteles y experiencias únicas diseñadas para crear recuerdos inolvidables.</p>

          <div className="search-container">
            <div className="search-input">
              <input
                type="text"
                placeholder="¿A dónde quieres viajar?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              
            </div>
            <button className="search-btn rounded" onClick={handleSearchRedirect}>
                <FaSearch /> <p>Buscar Viajes</p>
              </button>
          </div>
        </div>
      </div>

      <HomeSlider />

      <div id="offers">
        <SpecialOffers />
      </div>

      <section className="you-tour-features">
        <div className="features-stats" id="about">
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

      <section className="contact">
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <p>Nuestro equipo de expertos en viajes está aquí para ayudarte a crear la experiencia perfecta. Conecta con nosotros y comienza a planificar tu próxima aventura.</p>

          <div className="contact-stats" id="contacto">
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
                  <p>Buenos Aires, Argentina</p>
                  <span>Av. Córdoba 123</span>
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

              <form onSubmit={handleContact}>
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

                <button className="submit-btn" type="submit">Enviar Mensaje</button>
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
                  <p>Buenos Aires, Argentina</p>
                  <p>Av. Córdoba 123</p>
                </div>
              </div>
              <div className="map-placeholder">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.842273987208!2d-58.3923453242624!3d-34.63058987294409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac302bc2b2f%3A0x2a025a62a230de2f!2sAv.%20C%C3%B3rdoba%20123%2C%20C1054AAA%20CABA%2C%20Argentina!5e0!3m2!1ses!2sar!4v1720356550000!5m2!1ses!2sar"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


      // Temporalmente JSON para previsualizar

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
  