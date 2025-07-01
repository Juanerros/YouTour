import './style.css'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { BsSuitcaseFill } from "react-icons/bs";
import { IoIosAirplane } from "react-icons/io";
import { RiHotelFill } from "react-icons/ri";
import { PiSunFill, PiAirplaneTiltDuotone } from "react-icons/pi";
import { FaShoppingBag } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { UserContext } from '../../contexts/UserContext.jsx';
import ProfileDropdown from '../Admin/shared/components/ProfileDropdown';

const sidebarOptions = [
  { icon: <MdDashboard className='op-ico' />, label: "Inicio", path: "/admin" },
  { icon: <BsSuitcaseFill className='op-ico' />, label: "Paquetes Turísticos", path: "/admin/packages" },
  { icon: <IoIosAirplane className='op-ico' />, label: "Vuelos", path: "/admin/airplanes" },
  { icon: <RiHotelFill className='op-ico' />, label: "Hoteles", path: "/admin/hotels" },
  { icon: <PiSunFill className='op-ico' />, label: "Actividades", path: "/admin/activities" },
  { icon: <FaShoppingBag className='op-ico' />, label: "Pedidos", path: "/admin/orders" },
];

const AdminLayout = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Set active index based on current path
    const idx = sidebarOptions.findIndex(opt => opt.path === location.pathname);
    setActiveIndex(idx === -1 ? 0 : idx);
  }, [location.pathname]);

  useEffect(() => {
    if (loading) return
    if (!user || !user.isAdmin) return navigate('/');
  }, [user, loading]);

  // Cerrar dropdown cuando se cambia de página
  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="admin-layout-container">
        <aside>
          <div className="sidebar">
            {/* Header del Dashboard */}
            <div className="w-dashboard">
              <PiAirplaneTiltDuotone className='ico' />
              <span>
                <h1>YouTour</h1><h4>Dashboard</h4>
              </span>
            </div>

            {/* Opciones de navegación */}
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
                    setIsProfileDropdownOpen(false); // Cerrar dropdown al navegar
                  }}
                >
                  {opt.icon}{opt.label}
                </a>
              ))}
            </div>

            {/* Sección de Perfil */}
            <div className="profile-section">
              <button 
                className="profile-button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="profile-avatar-small">
                  <FiUser />
                </div>
                <div className="profile-info-small">
                  <span className="profile-name-small">
                    {user?.name || `${user?.nombre} ${user?.apellido}`}
                  </span>
                  <span className="profile-role-small">
                    {user?.isAdmin === 1 ? 'Administrador' : 'Usuario'}
                  </span>
                </div>
              </button>
              
              {/* Dropdown de Perfil */}
              <ProfileDropdown 
                isOpen={isProfileDropdownOpen}
                onClose={() => setIsProfileDropdownOpen(false)}
              />
            </div>
          </div>
        </aside>

        <section className="main-content">
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default AdminLayout;