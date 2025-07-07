import '../style.css'
import '../../../components/Modal/ModalHotel.css'
import './css/Hotel.css'
import { useState, useEffect } from 'react';
import useHoteles from '../hooks/useHoteles';

const ejemploFoto = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

const Hotel = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAmenidadesModal, setShowAmenidadesModal] = useState(false);
  const {
    hoteles,
    paises,
    ciudades,
    loading,
    error,
    addHotel,
    fetchCiudadesPorPais,
    amenidadesDisponibles
  } = useHoteles();

  useEffect(() => {
    document.title = "YouTour - Hoteles";
  }, []);

  const [form, setForm] = useState({
    nombre: '',
    id_pais: '',
    id_ciudad: '',
    rating: '',
    precio_noche: '',
    descripcion: '',
    ubicacion: '',
    amenidades: [],
    foto: ejemploFoto
  });

  const [selectedAmenidades, setSelectedAmenidades] = useState([]);
  const availableAmenidades = amenidadesDisponibles.filter(a => !selectedAmenidades.includes(a));

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'id_pais') {
      setForm(prev => ({ ...prev, id_pais: value, id_ciudad: '' }));
      fetchCiudadesPorPais(value);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        ...form,
        amenidades: selectedAmenidades
      };
      await addHotel(hotelData);
      setShowModal(false);
      setForm({
        nombre: '', id_pais: '', id_ciudad: '', rating: '', precio_noche: '', descripcion: '', ubicacion: '', amenidades: [], foto: ejemploFoto
      });
      setSelectedAmenidades([]);
    } catch (err) {
      console.error('Error al agregar hotel:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="Hotel">
        <div className="row">
          <span>
            <h1>Gestión de hoteles</h1>
            <h4>Administra los hoteles disponibles.</h4>
          </span>
          <input
            type="button"
            value="+ Añadir Hotel"
            className='agregar-hotel-btn'
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="hoteles-container">
          {hoteles.map((hotel, idx) => (
            <div className="hotel-card" key={idx}>
              <img src={hotel.foto} alt={hotel.nombre} className="hotel-img" />
              <div className="hotel-info">
                <div className="hotel-title">
                  <h2>{hotel.nombre}</h2>
                  <span className="hotel-ubicacion">{hotel.ubicacion}</span>
                </div>
                <div className="hotel-amenidades">
                  {hotel.amenidades?.split(',').map((am, i) => (
                    <span className="amenidad-tag" key={i}>{am.trim()}</span>
                  )) || []}
                </div>
                <div
                  className="hotel-descripcion"
                  title={hotel.descripcion}
                >
                  {hotel.descripcion.length > 80
                    ? hotel.descripcion.slice(0, 80) + '...'
                    : hotel.descripcion}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Añadir Hotel</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Nombre del hotel:
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    País:
                    <select
                      name="id_pais"
                      value={form.id_pais}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un país</option>
                      {paises.map(pais => (
                        <option key={pais.id_pais} value={pais.id_pais}>
                          {pais.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Ciudad:
                    <select
                      name="id_ciudad"
                      value={form.id_ciudad}
                      onChange={handleChange}
                      required
                      disabled={!form.id_pais}
                    >
                      <option value="">Seleccione una ciudad</option>
                      {ciudades.map(ciudad => (
                        <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                          {ciudad.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Ubicación:
                    <input
                      type="text"
                      name="ubicacion"
                      value={form.ubicacion}
                      onChange={handleChange}
                      placeholder="Dirección o ubicación específica"
                    />
                  </label>
                </div>
                <div className="modal-inputs-col">
                  <label>
                    Rating:
                    <input
                      type="number"
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.1"
                      required
                    />
                  </label>
                  <label>
                    Precio por noche:
                    <input
                      type="number"
                      name="precio_noche"
                      value={form.precio_noche}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </label>
                </div>
              </div>
              <label className="modal-label-full">
                Descripción:
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </label>
              <label className="modal-label-full">
                Amenidades:
                <div className="amenidades-container">
                  <div className="amenidades-selected">
                    {selectedAmenidades.map((amenidad, index) => (
                      <span key={index} className="amenidad-tag">
                        {amenidad}
                        <button
                          type="button"
                          className="remove-amenidad"
                          onClick={() => {
                            setSelectedAmenidades(prev =>
                              prev.filter(a => a !== amenidad)
                            );
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-agregar-amenidad"
                    onClick={() => setShowAmenidadesModal(true)}
                  >
                    + Agregar Amenidad
                  </button>
                </div>
              </label>
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

      {showAmenidadesModal && (
        <div>
          <div className="modal-backdrop">
            <div className="modal">
              <h2>Añadir Hotel</h2>
              <form onSubmit={handleSubmit}>
                <div className="modal-inputs-row">
                  <div className="modal-inputs-col">
                    <label>
                      Nombre del hotel:
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label>
                      País:
                      <select
                        name="id_pais"
                        value={form.id_pais}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione un país</option>
                        {paises.map(pais => (
                          <option key={pais.id_pais} value={pais.id_pais}>
                            {pais.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Ciudad:
                      <select
                        name="id_ciudad"
                        value={form.id_ciudad}
                        onChange={handleChange}
                        required
                        disabled={!form.id_pais}
                      >
                        <option value="">Seleccione una ciudad</option>
                        {ciudades.map(ciudad => (
                          <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Ubicación:
                      <input
                        type="text"
                        name="ubicacion"
                        value={form.ubicacion}
                        onChange={handleChange}
                        placeholder="Dirección o ubicación específica"
                      />
                    </label>
                  </div>
                  <div className="modal-inputs-col">
                    <label>
                      Rating:
                      <input
                        type="number"
                        name="rating"
                        value={form.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        required
                      />
                    </label>
                    <label>
                      Precio por noche:
                      <input
                        type="number"
                        name="precio_noche"
                        value={form.precio_noche}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </label>
                  </div>
                </div>
                <label className="modal-label-full">
                  Descripción:
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </label>
                <label className="modal-label-full">
                  Amenidades:
                  <div className="amenidades-container">
                    <div className="amenidades-selected">
                      {selectedAmenidades.map((amenidad, index) => (
                        <span key={index} className="amenidad-tag">
                          {amenidad}
                          <button
                            type="button"
                            className="remove-amenidad"
                            onClick={() => {
                              setSelectedAmenidades(prev =>
                                prev.filter(a => a !== amenidad)
                              );
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-agregar-amenidad"
                      onClick={() => setShowAmenidadesModal(true)}
                    >
                      + Agregar Amenidad
                    </button>
                  </div>
                </label>
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
          <div className="modal-backdrop">
            <div className="modal amenidades-modal">
              <h2>Seleccionar Amenidades</h2>
              <div className="amenidades-selector">
                <div className="amenidades-list selected">
                  <h3>Amenidades Seleccionadas</h3>
                  {selectedAmenidades.map((amenidad, index) => (
                    <div key={index} className="amenidad-item">
                      <span>{amenidad}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAmenidades(prev =>
                            prev.filter(a => a !== amenidad)
                          );
                        }}
                      >
                        ←
                      </button>
                    </div>
                  ))}
                </div>
                <div className="amenidades-list available">
                  <h3>Amenidades Disponibles</h3>
                  {availableAmenidades.map((amenidad, index) => (
                    <div key={index} className="amenidad-item">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAmenidades(prev => [...prev, amenidad]);
                        }}
                      >
                        →
                      </button>
                      <span>{amenidad}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-agregar"
                  onClick={() => setShowAmenidadesModal(false)}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hotel;