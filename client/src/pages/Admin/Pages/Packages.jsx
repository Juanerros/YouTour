import '../style.css'
import './css/Packages.css';

const Packages = () => {
  return (
    <>
      <div className="Packages">
        <div className="row">
        <span>
          <h1>Gestión de Paquetes</h1>
          <h4>Administra los paquetes.</h4>
        </span>
        <input type="submit" value="+ Crear Paquete" className='agregar-paquete-btn' />
      </div>
      <div className="container">
        <div className="card">

        </div>
      </div>
      </div>
    </>
  );
};

export default Packages;