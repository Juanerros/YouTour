import './styles.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useUser } from '../../hooks/useUser';
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, handleLogout } = useUser();

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
        <Link to="/catalog" className="nav-link">
          <span>Catalogo</span>
        </Link>
        <Link to="/contacto" className="nav-link">
          <span>Contacto</span>
        </Link>
        {(user && user.isAdmin) ? (
          <Link to="/admin" className="nav-link">
            <span>Admin</span>
          </Link>
        ): null}
      </div>
      <div className="nav-actions">
        <Link className="cart-btn" to={'/cart'}>
          <FaShoppingCart size={24} />
        </Link>
        {user ? <button className="login-btn" onClick={handleLogout}>Cerrar sesión</button>
          : <Link className="login-btn" to={'/auth'}>Iniciar sesión</Link>}
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