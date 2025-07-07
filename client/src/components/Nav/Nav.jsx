import './styles.css';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { UserContext } from '../../contexts/UserContext.jsx';
import { RiShoppingCart2Line } from "react-icons/ri";

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
          <RiShoppingCart2Line size={22}/>
          <span className='cart-text'>Carrito</span>
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
        <Link to="/cart" className="mobile-link">Carrito</Link>
        {(user && user.isAdmin) ? (
          <Link to="/admin" className="nav-link">
            <span>Admin</span>
          </Link>
        ) : null}
        <div className="mobile-actions">
          {user ? (
            <button
              className="mobile-login-btn"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              Cerrar sesión
            </button>
          ) : (
            <Link to="/auth" className="mobile-link">
              <button
                className="mobile-login-btn"
                onClick={() => setIsOpen(false)}
              >
                Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;