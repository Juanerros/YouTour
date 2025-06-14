import '../style.css'
import '../../../components/Modal/ModalAirplanes.css'
import './css/Airplanes.css'
import { useState } from 'react';
import { PiAirplaneTaxiing, PiAirplaneTiltLight } from "react-icons/pi";
import useVuelos from '../hooks/useVuelos';
import usePaises from '../hooks/usePaises';
import useContinentes from '../hooks/useContinentes';

const Airplanes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPaisModal, setShowPaisModal] = useState(false);
  const [showContinenteModal, setShowContinenteModal] = useState(false);
  
  const { vuelos, loading, error, addVuelo } = useVuelos();
  const { paises, loading: paisesLoading, addPais } = usePaises();
  const { continentes, loading: continentesLoading, addContinente } = useContinentes();
  
  const [form, setForm] = useState({
    origen: '',
    destino: '',
    aerolinea: '',
    duracion: '',
    salida: '',
    llegada: '',
    precio: '',
    aeronave: '',
    fecha_vuelo: ''
  });

  const [paisForm, setPaisForm] = useState({
    nombre: '',
    continente_id: ''
  });

  const [continenteForm, setContinenteForm] = useState({
    nombre: ''
  });

  const [currentField, setCurrentField] = useState(''); // Para saber si es origen o destino

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaisChange = e => {
    setPaisForm({ ...paisForm, [e.target.name]: e.target.value });
  };

  const handleContinenteChange = e => {
    setContinenteForm({ ...continenteForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVuelo(form);
      setShowModal(false);
      setForm({
        origen: '', destino: '', aerolinea: '', duracion: '', salida: '', 
        llegada: '', precio: '', aeronave: '', fecha_vuelo: ''
      });
    } catch (err) {
      console.error('Error al agregar vuelo:', err);
    }
  };

  const handlePaisSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoPais = await addPais(paisForm);
      setForm({ ...form, [currentField]: nuevoPais.id });
      setShowPaisModal(false);
      setPaisForm({ nombre: '', continente_id: '' });
    } catch (err) {
      console.error('Error al agregar país:', err);
    }
  };

  const handleContinenteSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoContinente = await addContinente(continenteForm);
      setPaisForm({ ...paisForm, continente_id: nuevoContinente.id });
      setShowContinenteModal(false);
      setContinenteForm({ nombre: '' });
    } catch (err) {
      console.error('Error al agregar continente:', err);
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    if (value === 'agregar_nuevo') {
      setCurrentField(field);
      setShowPaisModal(true);
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const handleContinenteSelect = (e) => {
    const value = e.target.value;
    if (value === 'agregar_nuevo') {
      setShowContinenteModal(true);
    } else {
      setPaisForm({ ...paisForm, continente_id: value });
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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
                      {vuelo.salida && vuelo.llegada ? `${vuelo.salida} - ${vuelo.llegada}` : ''}
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

      {/* Modal para agregar vuelo */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Agregar Vuelo</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Origen:
                    <select
                      name="origen"
                      value={form.origen}
                      onChange={(e) => handleSelectChange(e, 'origen')}
                      required
                      disabled={paisesLoading}
                    >
                      <option value="">Selecciona un país</option>
                      {paises.map(pais => (
                        <option key={pais.id} value={pais.id}>
                          {pais.nombre}
                        </option>
                      ))}
                      <option value="agregar_nuevo">+ Agregar nuevo país</option>
                    </select>
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
                  <label>
                    Duración:
                    <input
                      type="text"
                      name="duracion"
                      value={form.duracion}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Fecha de Vuelo:
                    <input
                      type="date"
                      name="fecha_vuelo"
                      value={form.fecha_vuelo}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
                <div className="modal-inputs-col">
                  <label>
                    Destino:
                    <select
                      name="destino"
                      value={form.destino}
                      onChange={(e) => handleSelectChange(e, 'destino')}
                      required
                      disabled={paisesLoading}
                    >
                      <option value="">Selecciona un país</option>
                      {paises.map(pais => (
                        <option key={pais.id} value={pais.id}>
                          {pais.nombre}
                        </option>
                      ))}
                      <option value="agregar_nuevo">+ Agregar nuevo país</option>
                    </select>
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
                  <label>
                    Aeronave:
                    <input
                      type="text"
                      name="aeronave"
                      value={form.aeronave}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-agregar">
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

      {/* Modal para agregar país */}
      {showPaisModal && (
        <div className="modal-backdrop">
          <div className="modal modal-small">
            <h2>Agregar Nuevo País</h2>
            <form onSubmit={handlePaisSubmit}>
              <label>
                Nombre del país:
                <input
                  type="text"
                  name="nombre"
                  value={paisForm.nombre}
                  onChange={handlePaisChange}
                  required
                />
              </label>
              <label>
                Continente:
                <select
                  name="continente_id"
                  value={paisForm.continente_id}
                  onChange={handleContinenteSelect}
                  required
                  disabled={continentesLoading}
                >
                  <option value="">Selecciona un continente</option>
                  {continentes.map(continente => (
                    <option key={continente.id} value={continente.id}>
                      {continente.nombre}
                    </option>
                  ))}
                  <option value="agregar_nuevo">+ Agregar nuevo continente</option>
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-agregar">
                  Agregar País
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowPaisModal(false);
                    setPaisForm({ nombre: '', continente_id: '' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar continente */}
      {showContinenteModal && (
        <div className="modal-backdrop">
          <div className="modal modal-small">
            <h2>Agregar Nuevo Continente</h2>
            <form onSubmit={handleContinenteSubmit}>
              <label>
                Nombre del continente:
                <input
                  type="text"
                  name="nombre"
                  value={continenteForm.nombre}
                  onChange={handleContinenteChange}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-agregar">
                  Agregar Continente
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowContinenteModal(false);
                    setContinenteForm({ nombre: '' });
                  }}
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