import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
import { FiUser, FiMail, FiPhone, FiShield, FiHome, FiLogOut } from 'react-icons/fi';
import '../styles/ProfileDropdown.css';

const ProfileDropdown = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay invisible para cerrar al hacer clic fuera */}
      <div className="dropdown-overlay" onClick={onClose}></div>
      
      {/* Dropdown */}
      <div className="profile-dropdown">
        {/* Header del usuario */}
        <div className="dropdown-header">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <h4 className="user-name">
              {user?.name || 'Usuario'}
            </h4>

          </div>
        </div>

        {/* Información de contacto */}
        <div className="dropdown-content">
          <div className="info-item">
            <FiMail className="info-icon" />
            <span className="info-text">{user?.email || 'No disponible'}</span>
          </div>
          
          <div className="info-item">
            <FiPhone className="info-icon" />
            <span className="info-text">{user?.phone || 'No disponible'}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="dropdown-actions">
          <button 
            className="dropdown-btn secondary"
            onClick={handleGoHome}
          >
            <FiHome />
            Ir al Inicio
          </button>
          <button 
            className="dropdown-btn primary"
            onClick={handleLogout}
          >
            <FiLogOut />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown; 