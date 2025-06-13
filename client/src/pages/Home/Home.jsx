import './styles.css';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Home = () => {
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
            
            <button className="search-btn">
              <FaSearch /> Buscar Viajes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;