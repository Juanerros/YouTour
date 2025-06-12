import './style.css'
import Logo from '/YouTourLogo.png'
import { useEffect, useState } from "react";
import { MdCardTravel } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { LuPlane } from "react-icons/lu";
import { useUser } from '../../hooks/useUser';
import useNotification from '../../hooks/useNotification';

const Nav = () => {
  const { handleLogout, getUser } = useUser();
  const { notify } = useNotification();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (getUser()) setIsLogin(true);
  }, []);

  return (
    <div className='Navbar'>
      <div className="NavUp">
        <img src={Logo} alt="Logo" className='Logo' />
        <div className='NavContent'>
          <a
            href=""
            className={activeIndex === 0 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(0); }}
          >
            <LuPlane size={40} /> Vuelos
          </a>
          <a
            href=""
            className={activeIndex === 1 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(1); }}
          >
            <BsTicketPerforated size={40} />
            Actividades
          </a>
          <a
            href=""
            className={activeIndex === 2 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(2); }}
          >
            <MdOutlineLocalOffer size={40} />
            Ofertas
          </a>
          <a
            href=""
            className={activeIndex === 3 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(3); }}
          >
            <MdCardTravel size={40} /> Paquetes de Viaje
          </a>
        </div>
        {isLogin ? (
          <button className='Login' onClick={() => { handleLogout(); notify("Sesión cerrada", "success"); }}>Cerrar Sesión</button>
        ) : (
          <a href="/auth" className='Log-btn'>Iniciar Sesión</a>
        )}
      </div>
      <div className="NavDown">
        <div className='SearchBar'>
        </div>
        <input type="submit" value="Buscar" className='Search' />
      </div>
    </div>
  );
};

export default Nav;