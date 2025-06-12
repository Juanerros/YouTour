import './style.css'

const Admin = () => {
  return (
    <div className='Admin'>
      <div className="navbar">
        <div className="logo">
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className="nav-links">
          <a href="/admin/flights">Vuelos</a>
          <a href="/admin/users">Usuarios</a>
          <a href="/admin/settings">Configuración</a>
        </div>
      </div>
      <div className="row">
        <span>
          <h1>Gestión de vuelos</h1>
          <h4>Administra los vuelos disponibles.</h4>
        </span>
        <input type="submit" value="+ Agregar Vuelo" className='agregar-vuelo-btn' />
      </div>
      <div className="vuelos-container">
        <div className="vuelos-card">

        </div>
      </div>
    </div>
  );
};

export default Admin;