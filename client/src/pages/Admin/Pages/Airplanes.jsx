import '../style.css'
import '../../../components/Modal/ModalAirplanes.css'
import './css/Airplanes.css'
import { useState, useEffect } from 'react';
import { PiAirplaneTaxiing, PiAirplaneTiltLight } from "react-icons/pi";
import { FaSearch, FaEdit, FaTrash, FaTable, FaThLarge } from "react-icons/fa";
import useVuelos from '../hooks/useVuelos';
import usePaises from '../hooks/usePaises';
import useCiudades from '../hooks/useCiudades';
import useContinentes from '../hooks/useContinentes';

// Opciones predefinidas para aerolíneas y aeronaves
const AEROLINEAS = ['Aerolíneas Argentinas', 'LATAM Airlines', 'Avianca', 'Copa Airlines'];
const AERONAVES = ['Boeing 737', 'Airbus A320', 'Embraer E190', 'Boeing 787'];

const Airplanes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPaisModal, setShowPaisModal] = useState(false);
  const [showContinenteModal, setShowContinenteModal] = useState(false);
  const [showCiudadModal, setShowCiudadModal] = useState(false);
  const [showAgregarCiudadModal, setShowAgregarCiudadModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentField, setCurrentField] = useState(''); // Para saber si es origen o destino
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPais, setSelectedPais] = useState(null);
  const [ciudadesSeleccionadas, setCiudadesSeleccionadas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVuelo, setCurrentVuelo] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  
  // Estado para almacenar los nombres de las ciudades seleccionadas
  const [ciudadesNombres, setCiudadesNombres] = useState({
    origen: '',
    destino: ''
  });
  
  const { vuelos, loading, error, addVuelo, deleteVuelo, updateVuelo } = useVuelos();
  const { paises, loading: paisesLoading, addPais } = usePaises();
  const { ciudades, loading: ciudadesLoading, fetchCiudadesPorPais, addCiudad } = useCiudades();
  const { continentes, loading: continentesLoading, addContinente } = useContinentes();

  const [form, setForm] = useState({
    origen: '',
    destino: '',
    aerolinea: AEROLINEAS[0],
    duracion: '',
    salida: '',
    llegada: '',
    precio: '',
    aeronave: AERONAVES[0],
    fecha_vuelo: ''
  });

  const [paisForm, setPaisForm] = useState({
    nombre: '',
    continente_id: ''
  });

  const [continenteForm, setContinenteForm] = useState({
    nombre: ''
  });

  const [ciudadForm, setCiudadForm] = useState({
    nombre: '',
    codigo_aeropuerto: '',
    id_pais: ''
  });

  // Calcular duración y fecha de vuelo automáticamente cuando cambian salida y llegada
  useEffect(() => {
    if (form.salida && form.llegada) {
      const salidaDate = new Date(form.salida);
      const llegadaDate = new Date(form.llegada);
      
      // Calcular duración en horas (como número decimal)
      const duracionMs = llegadaDate - salidaDate;
      const duracionHoras = duracionMs / (1000 * 60 * 60);
      
      // Formatear fecha de vuelo (solo la fecha, sin hora)
      const fechaVuelo = salidaDate.toISOString().split('T')[0];
      
      setForm(prev => ({
        ...prev,
        duracion: duracionHoras.toFixed(2),
        fecha_vuelo: fechaVuelo
      }));
    }
  }, [form.salida, form.llegada]);

  // Cargar ciudades cuando se selecciona un país
  useEffect(() => {
    if (selectedPais) {
      const cargarCiudades = async () => {
        const ciudadesPais = await fetchCiudadesPorPais(selectedPais.id_pais);
        setCiudadesSeleccionadas(ciudadesPais);
      };
      cargarCiudades();
    }
  }, [selectedPais, fetchCiudadesPorPais]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaisChange = e => {
    setPaisForm({ ...paisForm, [e.target.name]: e.target.value });
  };

  const handleContinenteChange = e => {
    setContinenteForm({ ...continenteForm, [e.target.name]: e.target.value });
  };

  const handleCiudadChange = e => {
    setCiudadForm({ ...ciudadForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentVuelo) {
        await updateVuelo(currentVuelo.id_vuelo, form);
        setIsEditing(false);
        setCurrentVuelo(null);
      } else {
        await addVuelo(form);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error al procesar vuelo:', err);
    }
  };

  const resetForm = () => {
    setForm({
      origen: '', 
      destino: '', 
      aerolinea: AEROLINEAS[0], 
      duracion: '', 
      salida: '', 
      llegada: '', 
      precio: '', 
      aeronave: AERONAVES[0], 
      fecha_vuelo: ''
    });
    setCiudadesNombres({
      origen: '',
      destino: ''
    });
  };

  const handlePaisSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoPais = await addPais(paisForm);
      setSelectedPais(nuevoPais);
      setCiudadForm({ ...ciudadForm, id_pais: nuevoPais.id_pais });
      setShowPaisModal(false);
      setShowCiudadModal(true);
      setPaisForm({ nombre: '', continente_id: '' });
    } catch (err) {
      console.error('Error al agregar país:', err);
    }
  };

  const handleContinenteSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoContinente = await addContinente(continenteForm);
      setPaisForm({ ...paisForm, continente_id: nuevoContinente.id_continente });
      setShowContinenteModal(false);
      setContinenteForm({ nombre: '' });
    } catch (err) {
      console.error('Error al agregar continente:', err);
    }
  };

  const handleCiudadSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevaCiudad = await addCiudad(ciudadForm);
      setForm({ ...form, [currentField]: nuevaCiudad.id_ciudad });
      setCiudadesNombres(prev => ({
        ...prev,
        [currentField]: nuevaCiudad.nombre
      }));
      setShowAgregarCiudadModal(false);
      setShowCiudadModal(false);
      setCiudadForm({ nombre: '', codigo_aeropuerto: '', id_pais: '' });
      
      // Actualizar la lista de ciudades del país seleccionado
      if (selectedPais) {
        const ciudadesActualizadas = await fetchCiudadesPorPais(selectedPais.id_pais);
        setCiudadesSeleccionadas(ciudadesActualizadas);
      }
    } catch (err) {
      console.error('Error al agregar ciudad:', err);
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

  const handlePaisSelect = (pais) => {
    setSelectedPais(pais);
    setCiudadForm({ ...ciudadForm, id_pais: pais.id_pais });
  };

  const handleCiudadSelect = (ciudad) => {
    setForm({ ...form, [currentField]: ciudad.id_ciudad });
    setCiudadesNombres(prev => ({
      ...prev,
      [currentField]: ciudad.nombre
    }));
    setShowCiudadModal(false);
  };

  const abrirModalCiudad = (field) => {
    setCurrentField(field);
    setSearchTerm('');
    setSelectedPais(null);
    setCiudadesSeleccionadas([]);
    setShowCiudadModal(true);
  };

  const handleEditVuelo = (vuelo) => {
    // Buscar los nombres de las ciudades
    setForm({
      origen: vuelo.origen,
      destino: vuelo.destino,
      aerolinea: vuelo.aerolinea,
      duracion: vuelo.duracion,
      salida: vuelo.salida,
      llegada: vuelo.llegada,
      precio: vuelo.precio,
      aeronave: vuelo.aeronave,
      fecha_vuelo: vuelo.fecha_vuelo
    });
    setCiudadesNombres({
      origen: vuelo.origen_nombre,
      destino: vuelo.destino_nombre
    });
    setCurrentVuelo(vuelo);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteVuelo = (vuelo) => {
    setCurrentVuelo(vuelo);
    setShowConfirmModal(true);
  };

  const confirmDeleteVuelo = async () => {
    try {
      await deleteVuelo(currentVuelo.id_vuelo);
      setShowConfirmModal(false);
      setCurrentVuelo(null);
    } catch (err) {
      console.error('Error al eliminar vuelo:', err);
    }
  };

  const formatearDuracion = (duracion) => {
    if (!duracion) return '';
    const horas = Math.floor(parseFloat(duracion));
    const minutos = Math.round((parseFloat(duracion) - horas) * 60);
    return `${horas}h ${minutos}m`;
  };

  const filtrarPaises = () => {
    if (!searchTerm) return paises;
    return paises.filter(pais => 
      pais.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filtrarCiudades = () => {
    if (!searchTerm) return ciudadesSeleccionadas;
    return ciudadesSeleccionadas.filter(ciudad => 
      ciudad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ciudad.codigo_aeropuerto && ciudad.codigo_aeropuerto.toLowerCase().includes(searchTerm.toLowerCase()))
    );
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
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Ver como tarjetas"
            >
              <FaThLarge />
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Ver como tabla"
            >
              <FaTable />
            </button>
            <input
              type="button"
              value="+ Agregar Vuelo"
              className='agregar-vuelo-btn'
              onClick={() => {
                resetForm();
                setIsEditing(false);
                setCurrentVuelo(null);
                setShowModal(true);
              }}
            />
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="vuelos-container">
            {vuelos.map((vuelo, idx) => (
              <div className="vuelos-card" key={idx}>
                <div className="info-general">
                  <PiAirplaneTiltLight className='card-ico' />
                  <div className="info-container">
                    <div className="info">
                      <h2>{vuelo.origen_nombre}</h2>
                      <hr />
                      <PiAirplaneTaxiing size={30} />
                      <hr />
                      <h2>{vuelo.destino_nombre}</h2>
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
                <div className="precio-acciones">
                  <div className="info-container">
                    <h1>${vuelo.precio}</h1>
                    <h3>por persona</h3>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn-editar" 
                      onClick={() => handleEditVuelo(vuelo)}
                      title="Editar vuelo"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-eliminar" 
                      onClick={() => handleDeleteVuelo(vuelo)}
                      title="Eliminar vuelo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vuelos-table-container">
            <table className="vuelos-table">
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Aerolínea</th>
                  <th>Fecha</th>
                  <th>Salida</th>
                  <th>Llegada</th>
                  <th>Duración</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vuelos.map((vuelo, idx) => (
                  <tr key={idx}>
                    <td>{vuelo.origen_nombre}</td>
                    <td>{vuelo.destino_nombre}</td>
                    <td>{vuelo.aerolinea}</td>
                    <td>{vuelo.fecha_vuelo}</td>
                    <td>{vuelo.salida}</td>
                    <td>{vuelo.llegada}</td>
                    <td>{formatearDuracion(vuelo.duracion)}</td>
                    <td>${vuelo.precio}</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn-editar" 
                          onClick={() => handleEditVuelo(vuelo)}
                          title="Editar vuelo"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-eliminar" 
                          onClick={() => handleDeleteVuelo(vuelo)}
                          title="Eliminar vuelo"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar vuelo */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isEditing ? 'Editar Vuelo' : 'Agregar Vuelo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Origen:
                    <button 
                      type="button" 
                      className="select-ciudad-btn"
                      onClick={() => abrirModalCiudad('origen')}
                    >
                      {form.origen && ciudadesNombres.origen ? 
                        ciudadesNombres.origen : 
                        'Seleccionar ciudad'}
                    </button>
                  </label>
                  <label>
                    Aerolínea:
                    <select
                      name="aerolinea"
                      value={form.aerolinea}
                      onChange={handleChange}
                      required
                    >
                      {AEROLINEAS.map((aerolinea, idx) => (
                        <option key={idx} value={aerolinea}>
                          {aerolinea}
                        </option>
                      ))}
                    </select>
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
                      readOnly
                      placeholder="Calculado automáticamente"
                    />
                    {form.duracion && (
                      <span className="duracion-formato">
                        {formatearDuracion(form.duracion)}
                      </span>
                    )}
                  </label>
                  <label>
                    Fecha de Vuelo:
                    <input
                      type="date"
                      name="fecha_vuelo"
                      value={form.fecha_vuelo}
                      onChange={handleChange}
                      readOnly
                      placeholder="Tomada de la fecha de salida"
                    />
                  </label>
                </div>
                <div className="modal-inputs-col">
                  <label>
                    Destino:
                    <button 
                      type="button" 
                      className="select-ciudad-btn"
                      onClick={() => abrirModalCiudad('destino')}
                    >
                      {form.destino && ciudadesNombres.destino ? 
                        ciudadesNombres.destino : 
                        'Seleccionar ciudad'}
                    </button>
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
                    <select
                      name="aeronave"
                      value={form.aeronave}
                      onChange={handleChange}
                      required
                    >
                      {AERONAVES.map((aeronave, idx) => (
                        <option key={idx} value={aeronave}>
                          {aeronave}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-agregar">
                  {isEditing ? 'Guardar Cambios' : 'Agregar'}
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

      {/* Modal de confirmación para eliminar */}
      {showConfirmModal && currentVuelo && (
        <div className="modal-backdrop">
          <div className="modal modal-small">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar el vuelo de {currentVuelo.origen_nombre} a {currentVuelo.destino_nombre}?</p>
            <div className="modal-actions">
              <button 
                className="btn-eliminar" 
                onClick={confirmDeleteVuelo}
              >
                Eliminar
              </button>
              <button 
                className="btn-cancelar" 
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar ciudad */}
      {showCiudadModal && (
        <div className="modal-backdrop">
          <div className="modal modal-medium">
            <h2>Seleccionar {currentField === 'origen' ? 'Origen' : 'Destino'}</h2>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar país o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            {!selectedPais ? (
              <>
                <h3>Selecciona un país</h3>
                <div className="paises-grid">
                  {filtrarPaises().map(pais => (
                    <div 
                      key={pais.id_pais} 
                      className="pais-item"
                      onClick={() => handlePaisSelect(pais)}
                    >
                      {pais.nombre}
                    </div>
                  ))}
                  <div 
                    className="pais-item pais-nuevo"
                    onClick={() => {
                      setShowCiudadModal(false);
                      setShowPaisModal(true);
                    }}
                  >
                    + Agregar nuevo país
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="selected-pais">
                  <span>País seleccionado: <strong>{selectedPais.nombre}</strong></span>
                  <button 
                    type="button" 
                    className="btn-volver"
                    onClick={() => {
                      setSelectedPais(null);
                      setCiudadesSeleccionadas([]);
                    }}
                  >
                    Cambiar país
                  </button>
                </div>
                
                <h3>Selecciona una ciudad</h3>
                {ciudadesLoading ? (
                  <div>Cargando ciudades...</div>
                ) : (
                  <div className="ciudades-grid">
                    {filtrarCiudades().map(ciudad => (
                      <div 
                        key={ciudad.id_ciudad} 
                        className="ciudad-item"
                        onClick={() => handleCiudadSelect(ciudad)}
                      >
                        <span className="ciudad-nombre">{ciudad.nombre}</span>
                        {ciudad.codigo_aeropuerto && (
                          <span className="ciudad-codigo">{ciudad.codigo_aeropuerto}</span>
                        )}
                      </div>
                    ))}
                    <div 
                      className="ciudad-item ciudad-nueva"
                      onClick={() => {
                        setCiudadForm({ ...ciudadForm, id_pais: selectedPais.id_pais });
                        setShowAgregarCiudadModal(true);
                      }}
                    >
                      + Agregar nueva ciudad
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setShowCiudadModal(false)}
              >
                Cancelar
              </button>
            </div>
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
                  className="input-border-blue"
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
                  className="ciudad-item ciudad-nueva"
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

      {/* Modal para agregar ciudad */}
      {showAgregarCiudadModal && (
        <div className="modal-backdrop">
          <div className="modal modal-small">
            <h2>Agregar Nueva Ciudad</h2>
            <form onSubmit={handleCiudadSubmit}>
              <label>
                Nombre de la ciudad:
                <input
                  type="text"
                  name="nombre"
                  value={ciudadForm.nombre}
                  onChange={handleCiudadChange}
                  required
                />
              </label>
              <label>
                Código de aeropuerto:
                <input
                  type="text"
                  name="codigo_aeropuerto"
                  value={ciudadForm.codigo_aeropuerto}
                  onChange={handleCiudadChange}
                  placeholder="Ej: MEX, LAX, MAD"
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-agregar">
                  Agregar Ciudad
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => {
                    setShowAgregarCiudadModal(false);
                    setCiudadForm({ nombre: '', codigo_aeropuerto: '', id_pais: '' });
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
            <div className="modal-inputs-row">
              <div className="modal-inputs-col">
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
          </div>
        </div>
      )}
    </>
  );
};

export default Airplanes;