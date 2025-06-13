import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import './styles.css';
import '../../globals.css';
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto';
  };

  return (
    <nav className="nav-container">
      <Link to="/">
        <div className="nav-logo">
          <img src="/img/LogoNoText.png" className="logo-image" />
          <div className="logo-text">You<span>Tour</span></div>
        </div>
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <span>Inicio</span>
        </Link>
        <Link to="/destinos" className="nav-link">
          <span>Destinos</span>
        </Link>
        <Link to="/paquetes" className="nav-link">
          <span>Paquetes</span>
        </Link>
        <Link to="/ofertas" className="nav-link">
          <span>Ofertas</span>
        </Link>
        <Link to="/contacto" className="nav-link">
          <span>Contacto</span>
        </Link>
      </div>
      <div className="nav-actions">
        <button className="cart-btn">
          <FaShoppingCart size={24} />
          <span className="cart-count">0</span>
        </button>
        <button className="login-btn">Iniciar sesión</button>
      </div>

      {/* Movil Responsive */}
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Fondo Negro para cerrar */}
      <div
        className={`menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      />

      {/* Sidebar Nav */}
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <Link to="/" className="mobile-link">Inicio</Link>
        <Link to="/destinos" className="mobile-link">Destinos</Link>
        <Link to="/paquetes" className="mobile-link">Paquetes</Link>
        <Link to="/ofertas" className="mobile-link">Ofertas</Link>
        <Link to="/contacto" className="mobile-link">Contacto</Link>
        <div className="mobile-actions">
          <button className="mobile-login-btn">Iniciar sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;