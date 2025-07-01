import './styles.css';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { UserContext } from '../../contexts/UserContext.jsx';
import { LuTicketsPlane } from 'react-icons/lu';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, handleLogout } = useContext(UserContext);

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
        {(user && user.isAdmin) ? (
          <Link to="/admin" className="nav-link">
            <span>Admin</span>
          </Link>
        ) : null}
      </div>
      <div className="nav-actions">
        <Link className="cart-btn" to={'/cart'}>
          <LuTicketsPlane size={24} />
        </Link>
        <span>{user && user.name}</span>
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
        <Link to="/catalog" className="mobile-link">Catalogo</Link>
        {(user && user.isAdmin) ? (
          <Link to="/admin" className="nav-link">
            <span>Admin</span>
          </Link>
        ) : null}
        <div className="mobile-actions">
          <Link to="/auth" className="mobile-link"><button className="mobile-login-btn">Iniciar sesión</button></Link>

        </div>
      </div>
    </nav>
  );
};

export default Nav;