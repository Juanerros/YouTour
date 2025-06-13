import '../style.css'
import '../../../components/Modal/ModalActivities.css'
import './css/Activities.css'
import { useState } from 'react';
import { MdPhotoCamera } from "react-icons/md";

const Activities = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    ubicacion: '',
    precio: '',
    duracion: '',
    descripcion: ''
  });
  const [actividades, setActividades] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setActividades([...actividades, { ...form }]);
    setShowModal(false);
    setForm({
      nombre: '', tipo: '', ubicacion: '', precio: '', duracion: '', descripcion: ''
    });
  };

  return (
    <>
      <div className="Activities">
        <div className="row">
          <span>
            <h1>Gestión de actividades</h1>
            <h4>Administra las actividades disponibles.</h4>
          </span>
          <input
            type="button"
            value="+ Agregar Actividad"
            className='agregar-actividad-btn'
            onClick={() => setShowModal(true)}
          />
        </div>
        <div className="actividades-container">
          {actividades.map((act, idx) => (
            <div className="actividad-card" key={idx}>
              <MdPhotoCamera className="actividad-icono" />
              <div className="actividad-info">
                <div className="actividad-header">
                  <h2>{act.nombre}</h2>
                  <span className="actividad-precio">${act.precio}</span>
                </div>
                <div
                  className="actividad-descripcion"
                  title={act.descripcion}
                >
                  {act.descripcion.length > 60
                    ? act.descripcion.slice(0, 60) + '...'
                    : act.descripcion}
                </div>
                <div className="actividad-detalles">
                  <span className="actividad-duracion">{act.duracion}</span>
                  <span className="actividad-ubicacion">{act.ubicacion}</span>
                </div>
                <div className="actividad-tipo">{act.tipo}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Agregar Actividad</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Nombre de la actividad:
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    Tipo:
                    <input
                      type="text"
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      placeholder="Cultural, aventura, entretenimiento, etc."
                      required
                    />
                  </label>
                </div>
                <div className="modal-inputs-col">
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
                </div>
              </div>
              <label className="modal-label-full">
                Duración:
                <input
                  type="text"
                  name="duracion"
                  value={form.duracion}
                  onChange={handleChange}
                  required
                />
              </label>
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

export default Activities;