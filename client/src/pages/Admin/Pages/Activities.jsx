import { useState } from 'react';
import { MdPhotoCamera } from "react-icons/md";
import useActividades from '../hooks/useActividades';
import '../style.css'
import '../../../components/Modal/ModalActivities.css'
import './css/Activities.css'

const Activities = () => {
  const [showModal, setShowModal] = useState(false);
  const { 
    actividades, 
    paises, 
    ciudades, 
    tiposActividad,
    loading, 
    error, 
    addActividad, 
    fetchCiudadesPorPais 
  } = useActividades();
  
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    id_ciudad: '',
    id_pais: '',
    precio: '',
    duracion_horas: '',
    duracion_minutos: '',
    descripcion: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'id_pais') {
      setForm(prev => ({ ...prev, id_pais: value, id_ciudad: '' }));
      fetchCiudadesPorPais(value);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Formatear la duración en formato HH:MM:SS para MySQL TIME
      const horas = form.duracion_horas || '0';
      const minutos = form.duracion_minutos || '0';
      const duracion = `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}:00`;
      
      const actividadData = {
        nombre: form.nombre,
        tipo: form.tipo,
        id_ciudad: form.id_ciudad,
        precio: form.precio,
        duracion: duracion,
        descripcion: form.descripcion
      };
      
      await addActividad(actividadData);
      setShowModal(false);
      setForm({
        nombre: '',
        tipo: '',
        id_ciudad: '',
        id_pais: '',
        precio: '',
        duracion_horas: '',
        duracion_minutos: '',
        descripcion: ''
      });
    } catch (err) {
      console.error('Error al agregar actividad:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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
                    <select 
                      name="tipo" 
                      value={form.tipo}
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposActividad.map(tipo => (
                        <option key={tipo.tipo} value={tipo.tipo}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="modal-inputs-col">
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
                </div>
              </div>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
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
                <div className="modal-inputs-col">
                  <label>
                    Duración:
                    <div className="duracion-container">
                      <input
                        type="number"
                        name="duracion_horas"
                        value={form.duracion_horas}
                        onChange={handleChange}
                        min="0"
                        max="23"
                        placeholder="Horas"
                        required
                      />
                      <span>:</span>
                      <input
                        type="number"
                        name="duracion_minutos"
                        value={form.duracion_minutos}
                        onChange={handleChange}
                        min="0"
                        max="59"
                        placeholder="Minutos"
                        required
                      />
                    </div>
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