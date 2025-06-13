import '../style.css'

const Airplanes = () => {
  return (
    <>
      <div className="Airplanes">
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
    </>
  );
};

export default Airplanes;