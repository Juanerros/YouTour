import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
import { FiUser, FiMail, FiShield, FiHome, FiLogOut, FiSettings } from 'react-icons/fi';
import { IoTimeOutline } from 'react-icons/io5';
import Modal from './Modal';
import '../styles/ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const footer = (
    <div className="profile-modal-actions">
      <button 
        className="btn btn-secondary"
        onClick={handleGoHome}
      >
        <FiHome />
        Ir a Inicio
      </button>
      <button 
        className="btn btn-primary"
        onClick={handleLogout}
      >
        <FiLogOut />
        Cerrar Sesión
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perfil de Usuario"
      footer={footer}
      size="medium"
    >
      <div className="profile-modal-content">
        {/* Avatar y nombre */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <FiUser />
            </div>
            <div className="avatar-status"></div>
          </div>
          <div className="profile-info">
            <h3 className="profile-name">
              {user?.nombre} {user?.apellido}
            </h3>
            <span className="profile-role">
              <FiShield />
              Administrador
            </span>
          </div>
        </div>

        {/* Información detallada */}
        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-icon">
              <FiMail />
            </div>
            <div className="detail-content">
              <span className="detail-label">Correo Electrónico</span>
              <span className="detail-value">{user?.email || 'No disponible'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FiUser />
            </div>
            <div className="detail-content">
              <span className="detail-label">ID de Usuario</span>
              <span className="detail-value">#{user?.id_usuario || 'No disponible'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <IoTimeOutline />
            </div>
            <div className="detail-content">
              <span className="detail-label">Miembro desde</span>
              <span className="detail-value">{formatDate(user?.fecha_registro)}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FiSettings />
            </div>
            <div className="detail-content">
              <span className="detail-label">Última actividad</span>
              <span className="detail-value">Ahora</span>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-number">Admin</div>
            <div className="stat-label">Nivel de acceso</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Disponibilidad</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Dashboard</div>
            <div className="stat-label">Panel actual</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal; 