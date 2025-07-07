import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
import { FiUser, FiMail, FiPhone, FiShield, FiHome, FiLogOut } from 'react-icons/fi';
import '../styles/ProfileDropdown.css';

const ProfileDropdown = ({ isOpen, onClose, position }) => {
  const { user, handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    onClose();
    await handleLogout();
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
      <div className={`profile-dropdown${position === "bottom" ? " profile-dropdown-bottom" : ""}`}>
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
            onClick={logout}
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