// Componentes
import Nav from './components/Nav/Nav.jsx';
// Dependencias
import { Outlet, Link, useLocation } from "react-router-dom";
import './globals.css';
import logo from '/img/LogoNoText.png';
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
            <Link to="/">Inicio</Link>
            <Link to="/catalog">Catalogo</Link>
          </div>

          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} youTour. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;