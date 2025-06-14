import '../style.css'
import '../../../components/Modal/ModalAirplanes.css'
import './css/Airplanes.css'
import { useState } from 'react';
import { PiAirplaneTaxiing, PiAirplaneTiltLight } from "react-icons/pi";

const Airplanes = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    aerolinea: '',
    duracion: '',
    salida: '',
    llegada: '',
    precio: ''
  });
  const [vuelos, setVuelos] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setVuelos([...vuelos, { ...form }]);
    setShowModal(false);
    setForm({
      origen: '', destino: '', aerolinea: '', duracion: '', salida: '', llegada: '', precio: ''
    });
  };

  return (
    <>
      <div className="Airplanes">
        <div className="row">
          <span>
            <h1>Gestión de vuelos</h1>
            <h4>Administra los vuelos.</h4>
          </span>
          <input
            type="button"
            value="+ Agregar Vuelo"
            className='agregar-vuelo-btn'
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="vuelos-container">
          {vuelos.map((vuelo, idx) => (
            <div className="vuelos-card" key={idx}>
              <div className="info-general">
                <PiAirplaneTiltLight className='card-ico' />
                <div className="info-container">
                  <div className="info">
                    <h2>{vuelo.origen}</h2>
                    <hr />
                    <PiAirplaneTaxiing size={30} />
                    <hr />
                    <h2>{vuelo.destino}</h2>
                  </div>
                  <div className="info">
                    <h3>{vuelo.aerolinea}</h3>
                    <hr />
                    <h3>
                      {vuelo.salida && vuelo.llegada
                        ? `${new Date(vuelo.salida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vuelo.llegada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="precio">
                <div className="info-container">
                  <h1>${vuelo.precio}</h1>
                  <h3>por persona</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Agregar Vuelo</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Origen:
                    <input
                      type="text"
                      name="origen"
                      value={form.origen}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Aerolínea:
                    <input
                      type="text"
                      name="aerolinea"
                      value={form.aerolinea}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Salida:
                    <input
                      type="datetime-local"
                      name="salida"
                      value={form.salida}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <div className="modal-inputs-col">
                  <label>
                    Destino:
                    <input
                      type="text"
                      name="destino"
                      value={form.destino}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Precio:
                    <input
                      type="number"
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </label>
                  <label>
                    Llegada:
                    <input
                      type="datetime-local"
                      name="llegada"
                      value={form.llegada}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn-agregar"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Airplanes;