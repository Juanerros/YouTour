import './style.css'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsSuitcaseFill } from "react-icons/bs";
import { IoIosAirplane } from "react-icons/io";
import { RiHotelFill } from "react-icons/ri";
import { PiSunFill, PiAirplaneTiltDuotone } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";

const sidebarOptions = [
  { icon: <BsSuitcaseFill className='op-ico' />, label: "Paquetes Turisticos", path: "/admin/packages" },
  { icon: <IoIosAirplane className='op-ico' />, label: "Vuelos", path: "/admin/airplanes" },
  { icon: <RiHotelFill className='op-ico' />, label: "Hoteles", path: "/admin/hotels" },
  { icon: <PiSunFill className='op-ico' />, label: "Actividades", path: "/admin/activities" },
  { icon: <FaShoppingBag className='op-ico' />, label: "Pedidos", path: "/admin/orders" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Set active index based on current path
    const idx = sidebarOptions.findIndex(opt => location.pathname.startsWith(opt.path));
    setActiveIndex(idx === -1 ? 0 : idx);
  }, [location.pathname]);

  return (
    <>
      {/* Navbar visible en todas las secciones */}
      <div className="navbar">
        <h1>Administracion de YouTour</h1>
        <div className="nav-links">
          <a href="/admin/settings">Configuración<IoMdSettings size={15}/></a>
        </div>
      </div>

      <div className="admin-layout-container">
        <aside>
          <div className="sidebar">
            <div className="w-dashboard">
              <PiAirplaneTiltDuotone className='ico'/>
              <span>
                <h1>YouTour</h1><h4>Dashboard</h4>
              </span>
            </div>
            <div className="op-container">
              {sidebarOptions.map((opt, idx) => (
                <a
                  href={opt.path}
                  key={opt.label}
                  className={`sidebar-op${activeIndex === idx ? " active" : ""}`}
                  onClick={e => {
                    e.preventDefault();
                    setActiveIndex(idx);
                    navigate(opt.path);
                  }}
                >
                  {opt.icon}{opt.label}
                </a>
              ))}
            </div>
          </div>
        </aside>
        <section className="main-content">
          <Outlet/>
        </section>
      </div>
    </>
  );
};

export default AdminLayout;