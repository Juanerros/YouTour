import '../style.css'
import '../../../components/Modal/ModalHotel.css'
import './css/Hotel.css'
import { useState } from 'react';

const ejemploFoto = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

const Hotel = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    ubicacion: '',
    rating: '',
    precio: '',
    descripcion: '',
    amenidades: '',
    foto: ejemploFoto
  });
  const [hoteles, setHoteles] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setHoteles([...hoteles, { ...form }]);
    setShowModal(false);
    setForm({
      nombre: '', ubicacion: '', rating: '', precio: '', descripcion: '', amenidades: '', foto: ejemploFoto
    });
  };

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
                  {hotel.amenidades.split(',').map((am, i) => (
                    <span className="amenidad-tag" key={i}>{am.trim()}</span>
                  ))}
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
                    Ubicación:
                    <input
                      type="text"
                      name="ubicacion"
                      value={form.ubicacion}
                      onChange={handleChange}
                      required
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
                      name="precio"
                      value={form.precio}
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
                <textarea
                  name="amenidades"
                  value={form.amenidades}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Ej: WiFi, Piscina, Desayuno incluido..."
                  required
                />
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
    </>
  );
};

export default Hotel;