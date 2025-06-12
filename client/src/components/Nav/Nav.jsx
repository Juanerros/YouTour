import './style.css'
import React, { useState } from "react";
import Logo from '../../../public/YouTourLogo.png'
import { MdCardTravel } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbMountain } from "react-icons/tb";

const Nav = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
            <MdCardTravel size={30}/> Vuelos
          </a>
          <a
            href=""
            className={activeIndex === 1 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(1); }}
          >
            <BsTicketPerforated size={30} />
            Actividades
          </a>
          <a
            href=""
            className={activeIndex === 2 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(2); }}
          >
            <MdOutlineLocalOffer size={30}/>
            Ofertas
          </a>
          <a
            href=""
            className={activeIndex === 3 ? "active" : ""}
            onClick={e => { e.preventDefault(); setActiveIndex(3); }}
          >
            <TbMountain size={30}/>
            Paquetes de Viaje
          </a>
        </div>
        <a href="" className='Log-btn'>Iniciar Sesión</a>
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