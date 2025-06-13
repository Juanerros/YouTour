import '../style.css'

const Activities = () => {
  return (
    <>
      <div className="Activities">
        <div className="row">
        <span>
          <h1>Gestión de vuelos</h1>
          <h4>Administra los vuelos disponibles.</h4>
        </span>
        <input type="submit" value="+ Agregar Vuelo" className='agregar-vuelo-btn' />
      </div>
      <div className="container">
        <div className="card">

        </div>
      </div>
      </div>
    </>
  );
};

export default Activities;