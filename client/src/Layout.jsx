// Componentes
import Nav from './components/Nav/Nav.jsx';
// Dependencias
import { Outlet, Link, useLocation } from "react-router-dom";
import './globals.css';
import logo from '../public/img/LogoNoText.png'; 
import { useEffect } from 'react';
const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <div className="router">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="logo-container">
              <img src={logo} alt="" />
              <span className="logo-text white">You<span className="highlight">Tour</span></span>
            </div>
            <p className="footer-tagline">Explora el mundo con nosotros</p>
          </div>
          
          <div className="footer-links">
            <Link to="/packages">Paquetes</Link>
            <Link to="/services">Servicios</Link>
            <Link to="/contact">Contacto</Link>
          </div>
          
          <div className="footer-copyright">
            <p>© 2024 youTour. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;