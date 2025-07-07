import { useState, useEffect } from 'react';
import '../style.css'
import './css/Packages.css';
import { FaPlane, FaHotel, FaStar, FaRegCalendarAlt, FaMapMarkerAlt, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import usePaquetes from '../hooks/usePaquetes';

const Packages = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('resumen');
  const [selectedPaquete, setSelectedPaquete] = useState(null);
  const [selectedActividades, setSelectedActividades] = useState([]);
  const [showActividadesModal, setShowActividadesModal] = useState(false);
  const [vueloDestinoPais, setVueloDestinoPais] = useState(null);
  const [vueloDestinoCiudad, setVueloDestinoCiudad] = useState(null);
  const [availableActividades, setAvailableActividades] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPaquete, setEditingPaquete] = useState(null);
  
  const { 
    paquetes, 
    paquetesDetallados,
    vuelos, 
    hoteles, 
    hotelesCompletos,
    filterHotelesByPais,
    resetHotelFilter,
    actividades,
    loading, 
    error, 
    addPaquete, 
    updatePaquete,
    deletePaquete,
    addActividadAPaquete,
    getPaqueteById,
    getPaqueteDetalladoById,
    fetchPaquetes,
    fetchPaquetesDetallados
  } = usePaquetes();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion_dias: '',
    precio_base: '',
    cantidad_personas: '1',
    fecha_inicio: '',
    fecha_fin: '',
    vuelo_id: '',
    hotel_id: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name === 'fecha_inicio' || name === 'fecha_fin') {
      // Cuando se cambian las fechas, calcular automáticamente la duración en días
      const updatedForm = { ...form, [name]: value };
      
      if (updatedForm.fecha_inicio && updatedForm.fecha_fin) {
        const fechaInicio = new Date(updatedForm.fecha_inicio);
        const fechaFin = new Date(updatedForm.fecha_fin);
        
        // Calcular la diferencia en días
        const diffTime = Math.abs(fechaFin - fechaInicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Actualizar la duración en días
        updatedForm.duracion_dias = diffDays;
        setForm(updatedForm);
      } else {
        setForm(updatedForm);
      }
    } else if (name === 'vuelo_id' && value) {
      // Cuando se selecciona un vuelo, filtrar hoteles por el país de destino
      const selectedVuelo = vuelos.find(v => v.id_vuelo === parseInt(value));
      if (selectedVuelo) {
        // Guardar información del destino del vuelo
        setVueloDestinoPais(selectedVuelo.destino_id_pais);
        setVueloDestinoCiudad(selectedVuelo.destino);
        
        // Usar la función del hook para filtrar hoteles
        filterHotelesByPais(selectedVuelo.destino_id_pais);
        
        // Resetear el hotel seleccionado
        setForm(prev => ({ ...prev, [name]: value, hotel_id: '' }));
        
        // Filtrar actividades disponibles según el destino (por ciudad y país)
        const actividadesEnDestino = actividades.filter(actividad => {
          return actividad.id_ciudad === selectedVuelo.destino || 
                 actividad.id_pais === selectedVuelo.destino_id_pais;
        });
        setAvailableActividades(actividadesEnDestino);
      }
    } else if (name === 'hotel_id' && value) {
      // Cuando se selecciona un hotel, mostrar actividades del destino y amenidades del hotel
      const selectedHotel = hoteles.find(h => h.id_hotel === parseInt(value));
      if (selectedHotel) {
        // Primero obtener actividades del destino
        const actividadesDestino = actividades.filter(actividad => {
          return actividad.id_ciudad === selectedHotel.id_ciudad || 
                 actividad.id_pais === selectedHotel.id_pais;
        });
        
        // Luego obtener las amenidades del hotel para mostrar como actividades adicionales
        fetch(`http://localhost:5001/api/hoteles/${value}/amenidades`)  
          .then(response => response.json())
          .then(amenidades => {
            // Combinar actividades del destino con amenidades del hotel
            const actividadesConAmenidades = [...actividadesDestino];
            
            // Agregar amenidades como actividades potenciales si no existen ya
            amenidades.forEach(amenidad => {
              const actividadExistente = actividadesDestino.find(act => 
                act.nombre.toLowerCase().includes(amenidad.nombre.toLowerCase()) ||
                amenidad.nombre.toLowerCase().includes(act.nombre.toLowerCase())
              );
              
              if (!actividadExistente) {
                // Crear una actividad virtual basada en la amenidad
                actividadesConAmenidades.push({
                  id_actividad: `amenidad_${amenidad.id_amenidad}`,
                  nombre: `${amenidad.nombre} (Amenidad del Hotel)`,
                  precio: 0,
                  duracion: '1 hora',
                  tipo: 'Amenidad',
                  id_ciudad: selectedHotel.id_ciudad,
                  id_pais: selectedHotel.id_pais,
                  es_amenidad: true
                });
              }
            });
            
            setAvailableActividades(actividadesConAmenidades);
          })
          .catch(error => {
            console.error('Error al obtener amenidades del hotel:', error);
            // Si falla, al menos mostrar las actividades del destino
            setAvailableActividades(actividadesDestino);
          });
      }
      setForm(prev => ({ ...prev, [name]: value }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que el hotel corresponda al destino del vuelo
      if (hoteles.length > 0 && !hoteles.some(h => h.id_hotel === parseInt(form.hotel_id))) {
        alert('El hotel seleccionado no corresponde al destino del vuelo.');
        return;
      }
      
      const paqueteData = {
        ...form,
        duracion_dias: parseInt(form.duracion_dias),
        precio_base: parseFloat(form.precio_base),
        cantidad_personas: parseInt(form.cantidad_personas)
      };
      
      let resultado;
      if (isEditing && editingPaquete) {
        resultado = await updatePaquete(editingPaquete.id_paquete, paqueteData);
        alert('Paquete actualizado exitosamente');
      } else {
        resultado = await addPaquete(paqueteData);
        // Si hay actividades seleccionadas, agregarlas al paquete
        if (selectedActividades.length > 0 && resultado.id_paquete) {
          for (const actividad of selectedActividades) {
            await addActividadAPaquete(resultado.id_paquete, {
              id_actividad: actividad.id_actividad,
              fecha: form.fecha_inicio,
              hora: '10:00:00',
              incluido_base: true
            });
          }
        }
        alert('Paquete creado exitosamente');
      }
      
      setShowModal(false);
      fetchPaquetes();
      fetchPaquetesDetallados();
      resetForm();
    } catch (err) {
      console.error('Error al procesar paquete:', err);
      alert('Error al procesar el paquete');
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      descripcion: '',
      duracion_dias: '',
      precio_base: '',
      cantidad_personas: '1',
      fecha_inicio: '',
      fecha_fin: '',
      vuelo_id: '',
      hotel_id: ''
    });
    setSelectedActividades([]);
    setVueloDestinoPais(null);
    setVueloDestinoCiudad(null);
    setAvailableActividades([]);
    setIsEditing(false);
    setEditingPaquete(null);
  };

  const handleViewDetails = async (paquete) => {
    try {
      const paqueteDetalle = await getPaqueteDetalladoById(paquete.id_paquete);
      setSelectedPaquete(paqueteDetalle);
      setShowDetailsModal(true);
      setCurrentTab('resumen');
    } catch (err) {
      console.error('Error al obtener detalles del paquete:', err);
      alert('Error al obtener detalles del paquete');
    }
  };

  const handleEditPaquete = async (paquete) => {
    try {
      setIsEditing(true);
      setEditingPaquete(paquete);
      
      console.log('Editando paquete:', paquete); // Debug

      // Si hay vuelo seleccionado, configurar hoteles filtrados PRIMERO
      if (paquete.vuelo?.id_vuelo) {
        const selectedVuelo = vuelos.find(v => v.id_vuelo === paquete.vuelo.id_vuelo);
        console.log('Vuelo encontrado:', selectedVuelo); // Debug
        
        if (selectedVuelo) {
          setVueloDestinoPais(selectedVuelo.destino_id_pais);
          setVueloDestinoCiudad(selectedVuelo.destino);
          
          // Usar la función del hook para filtrar hoteles
          await filterHotelesByPais(selectedVuelo.destino_id_pais);
        }
      } else {
        // Si no hay vuelo, usar todos los hoteles
        resetHotelFilter();
      }
      
      // Precargar los datos del paquete en el formulario
      setForm({
        nombre: paquete.nombre || '',
        descripcion: paquete.descripcion || '',
        duracion_dias: paquete.duracion_dias || '',
        precio_base: paquete.precio_base || '',
        cantidad_personas: paquete.cantidad_personas || '1',
        fecha_inicio: paquete.fecha_inicio ? new Date(paquete.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: paquete.fecha_fin ? new Date(paquete.fecha_fin).toISOString().split('T')[0] : '',
        vuelo_id: paquete.vuelo?.id_vuelo || '',
        hotel_id: paquete.hotel?.id_hotel || ''
      });

      console.log('Form data:', {
        vuelo_id: paquete.vuelo?.id_vuelo,
        hotel_id: paquete.hotel?.id_hotel
      }); // Debug

      // Si hay actividades, cargarlas
      if (paquete.actividades && paquete.actividades.length > 0) {
        setSelectedActividades(paquete.actividades);
      }

      setShowModal(true);
    } catch (err) {
      console.error('Error al preparar edición:', err);
      alert('Error al preparar la edición del paquete');
    }
  };

  const handleDeletePaquete = async (paquete) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el paquete "${paquete.nombre}"?`)) {
      try {
        await deletePaquete(paquete.id_paquete);
        alert('Paquete eliminado exitosamente');
        fetchPaquetes();
        fetchPaquetesDetallados();
      } catch (err) {
        console.error('Error al eliminar paquete:', err);
        alert('Error al eliminar el paquete');
      }
    }
  };

  const handleAddActividad = (actividad) => {
    if (!selectedActividades.some(a => a.id_actividad === actividad.id_actividad)) {
      setSelectedActividades([...selectedActividades, actividad]);
    }
  };

  const handleRemoveActividad = (id) => {
    setSelectedActividades(selectedActividades.filter(a => a.id_actividad !== id));
  };

  // Usar paquetes detallados para obtener mejor información
  const paquetesToShow = paquetesDetallados.length > 0 ? paquetesDetallados : paquetes;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="Packages">
        <div className="row">
          <span>
            <h1>Gestión de Paquetes</h1>
            <h4>Administra los paquetes.</h4>
          </span>
          <input 
            type="button" 
            value="+ Crear Paquete" 
            className='agregar-paquete-btn' 
            onClick={() => setShowModal(true)}
          />
        </div>
        
        <div className="paquetes-container">
          {paquetesToShow.map((paquete) => {
            return (
              <div className="paquete-card" key={paquete.id_paquete}>
                <div className="paquete-header">
                  <h3>{paquete.nombre}</h3>
                  <p>{paquete.duracion_dias} días / {paquete.duracion_dias - 1} noches</p>
                </div>
                <div className="paquete-body">
                  <div className="paquete-precio">
                    ${paquete.precio_base}
                    <div className="paquete-rating">
                      <FaStar />
                      <span>{paquete.hotel?.rating || '4.5'}</span>
                    </div>
                  </div>
                  
                  <div className="paquete-info">
                    {paquete.vuelo && (
                      <div className="paquete-info-item">
                        <FaPlane />
                        <span>
                          {paquete.vuelo.origen_nombre} ({paquete.vuelo.origen_codigo}) → {paquete.vuelo.destino_nombre} ({paquete.vuelo.destino_codigo})
                        </span>
                      </div>
                    )}
                    
                    {paquete.hotel && (
                      <div className="paquete-info-item">
                        <FaHotel />
                        <span>{paquete.hotel.nombre}</span>
                      </div>
                    )}
                    
                    <div className="paquete-info-item">
                      <FaRegCalendarAlt />
                      <span>{new Date(paquete.fecha_inicio).toLocaleDateString()} - {new Date(paquete.fecha_fin).toLocaleDateString()}</span>
                    </div>

                    {paquete.actividades && paquete.actividades.length > 0 && (
                      <div className="paquete-info-item">
                        <FaMapMarkerAlt />
                        <span>{paquete.actividades.length} actividades incluidas</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="paquete-footer">
                  <button 
                    className="paquete-btn btn-editar"
                    onClick={() => handleEditPaquete(paquete)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    className="paquete-btn btn-detalles"
                    onClick={() => handleViewDetails(paquete)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="paquete-btn btn-eliminar"
                    onClick={() => handleDeletePaquete(paquete)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modal para crear/editar paquete */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Paquete' : 'Crear Nuevo Paquete'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Nombre del Paquete
                    <input 
                      type="text" 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={handleChange} 
                      required 
                    />
                  </label>
                  
                  <label>
                    Duración (días)
                    <input 
                      type="number" 
                      name="duracion_dias" 
                      value={form.duracion_dias} 
                      onChange={handleChange} 
                      min="1" 
                      required 
                    />
                  </label>
                  
                  <label>
                    Precio Base
                    <input 
                      type="number" 
                      name="precio_base" 
                      value={form.precio_base} 
                      onChange={handleChange} 
                      min="0" 
                      step="0.01" 
                      required 
                    />
                  </label>
                </div>
                
                <div className="modal-inputs-col">
                  <label>
                    Fecha Inicio
                    <input 
                      type="date" 
                      name="fecha_inicio" 
                      value={form.fecha_inicio} 
                      onChange={handleChange} 
                      required 
                    />
                  </label>
                  
                  <label>
                    Fecha Fin
                    <input 
                      type="date" 
                      name="fecha_fin" 
                      value={form.fecha_fin} 
                      onChange={handleChange} 
                      required 
                    />
                  </label>
                  
                  <label>
                    Cantidad de Personas
                    <input 
                      type="number" 
                      name="cantidad_personas" 
                      value={form.cantidad_personas} 
                      onChange={handleChange} 
                      min="1" 
                      required 
                    />
                  </label>
                </div>
              </div>
              
              <label className="modal-label-full">
                Descripción
                <textarea 
                  name="descripcion" 
                  value={form.descripcion} 
                  onChange={handleChange} 
                  rows="3" 
                />
              </label>
              
              <div className="modal-inputs-row">
                <div className="modal-inputs-col">
                  <label>
                    Vuelo
                    <select 
                      name="vuelo_id" 
                      value={form.vuelo_id} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Seleccionar vuelo</option>
                      {vuelos.map(vuelo => (
                        <option key={vuelo.id_vuelo} value={vuelo.id_vuelo}>
                          {vuelo.origen_nombre} ({vuelo.origen_codigo}) → {vuelo.destino_nombre} ({vuelo.destino_codigo})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                
                <div className="modal-inputs-col">
                  <label>
                    Hotel
                    <select 
                      name="hotel_id" 
                      value={form.hotel_id} 
                      onChange={handleChange} 
                      required
                      disabled={!form.vuelo_id}
                    >
                      <option value="">Seleccionar hotel</option>
                      {hoteles.map(hotel => (
                        <option key={hotel.id_hotel} value={hotel.id_hotel}>
                          {hotel.nombre} - {hotel.ubicacion}
                        </option>
                      ))}
                    </select>
                    {form.vuelo_id && hoteles.length === 0 && (
                      <div className="error-message">
                        No hay hoteles disponibles en el destino. 
                        <a href="/admin/hotel" target="_blank" rel="noopener noreferrer">Crear un hotel</a>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              <h3>Actividades</h3>
              <div className="modal-label-full">
                <div className="amenidades-container">
                  <div className="amenidades-selected">
                    {selectedActividades.map((actividad, index) => (
                      <span key={index} className="amenidad-tag">
                        {actividad.nombre}
                        <button
                          type="button"
                          className="remove-amenidad"
                          onClick={() => handleRemoveActividad(actividad.id_actividad)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-agregar-amenidad"
                    onClick={() => {
                      if (!form.vuelo_id) {
                        alert('Primero seleccione un vuelo para ver las actividades disponibles en el destino');
                        return;
                      }
                      setShowActividadesModal(true);
                    }}
                  >
                    + Agregar Actividad
                  </button>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancelar" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-agregar">
                  {isEditing ? 'Actualizar Paquete' : 'Crear Paquete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de selección de actividades */}
      {showActividadesModal && (
        <div className="modal-backdrop">
          <div className="modal amenidades-modal">
            <h2>Seleccionar Actividades</h2>
            <div className="amenidades-selector">
              <div className="amenidades-list selected">
                <h3>Actividades Seleccionadas</h3>
                {selectedActividades.map((actividad, index) => (
                  <div key={index} className="amenidad-item">
                    <span>{actividad.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActividad(actividad.id_actividad)}
                    >
                      ←
                    </button>
                  </div>
                ))}
              </div>
              <div className="amenidades-list available">
                <h3>Actividades Disponibles</h3>
                {availableActividades
                  .filter(a => !selectedActividades.some(sa => sa.id_actividad === a.id_actividad))
                  .map((actividad, index) => (
                    <div key={index} className="amenidad-item">
                      <button
                        type="button"
                        onClick={() => handleAddActividad(actividad)}
                      >
                        →
                      </button>
                      <span>{actividad.nombre} - ${actividad.precio}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-agregar"
                onClick={() => setShowActividadesModal(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de detalles del paquete */}
      {showDetailsModal && selectedPaquete && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{selectedPaquete.nombre}</h2>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-tabs">
              <div 
                className={`modal-tab ${currentTab === 'resumen' ? 'active' : ''}`}
                onClick={() => setCurrentTab('resumen')}
              >
                Resumen
              </div>
              <div 
                className={`modal-tab ${currentTab === 'actividades' ? 'active' : ''}`}
                onClick={() => setCurrentTab('actividades')}
              >
                Actividades
              </div>
              <div 
                className={`modal-tab ${currentTab === 'servicios' ? 'active' : ''}`}
                onClick={() => setCurrentTab('servicios')}
              >
                Servicios
              </div>
            </div>
            
            <div className="modal-content">
              {currentTab === 'resumen' && (
                <>
                  <div className="modal-section">
                    <h3>Información General</h3>
                    <div className="modal-section-content">
                      <div className="modal-info-grid">
                        <div className="modal-info-item">
                          <span className="modal-info-label">Duración:</span>
                          <span className="modal-info-value">{selectedPaquete.duracion_dias} días / {selectedPaquete.duracion_dias - 1} noches</span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">Cantidad de Personas:</span>
                          <span className="modal-info-value">{selectedPaquete.cantidad_personas}</span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">Fecha de Inicio:</span>
                          <span className="modal-info-value">{new Date(selectedPaquete.fecha_inicio).toLocaleDateString()}</span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">Fecha de Fin:</span>
                          <span className="modal-info-value">{new Date(selectedPaquete.fecha_fin).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="modal-info-item">
                        <span className="modal-info-label">Descripción:</span>
                        <span className="modal-info-value">{selectedPaquete.descripcion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3>Vuelo Incluido</h3>
                    <div className="modal-section-content">
                      <div className="modal-info-grid">
                        <div className="modal-info-item">
                          <span className="modal-info-label">Ruta:</span>
                          <span className="modal-info-value">
                            {selectedPaquete.vuelo ? 
                              `${selectedPaquete.vuelo.origen_nombre} (${selectedPaquete.vuelo.origen_codigo}) → 
                              ${selectedPaquete.vuelo.destino_nombre} (${selectedPaquete.vuelo.destino_codigo})` : 
                              'No disponible'}
                          </span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">País de Destino:</span>
                          <span className="modal-info-value">
                            {selectedPaquete.vuelo?.destino_pais_nombre || 'No disponible'}
                          </span>
                        </div>
                        {selectedPaquete.vuelo?.precio && (
                          <div className="modal-info-item">
                            <span className="modal-info-label">Precio del Vuelo:</span>
                            <span className="modal-info-value">${selectedPaquete.vuelo.precio}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-section">
                    <h3>Hotel Incluido</h3>
                    <div className="modal-section-content">
                      <div className="modal-info-grid">
                        <div className="modal-info-item">
                          <span className="modal-info-label">Hotel:</span>
                          <span className="modal-info-value">
                            {selectedPaquete.hotel?.nombre || 'No disponible'}
                          </span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">Ubicación:</span>
                          <span className="modal-info-value">
                            {selectedPaquete.hotel ? 
                              `${selectedPaquete.hotel.ciudad_nombre}, ${selectedPaquete.hotel.pais_nombre}` : 
                              'No disponible'}
                          </span>
                        </div>
                        <div className="modal-info-item">
                          <span className="modal-info-label">Rating:</span>
                          <span className="modal-info-value">
                            {selectedPaquete.hotel?.rating ? 
                              <>
                                <FaStar style={{ color: '#f5a623' }} /> 
                                {selectedPaquete.hotel.rating}
                              </> : 'No disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-section">
                    <h3>Precio Base del Paquete</h3>
                    <div className="modal-section-content">
                      <div className="modal-info-item">
                        <span className="modal-info-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563ae' }}>
                          ${selectedPaquete.precio_base}
                        </span>
                        <span className="modal-info-label">
                          Incluye vuelo + hotel por {selectedPaquete.duracion_dias} días
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {currentTab === 'actividades' && (
                <div className="modal-section">
                  <h3>Actividades Incluidas</h3>
                  {selectedPaquete.actividades && selectedPaquete.actividades.length > 0 ? (
                    <div className="actividades-list">
                      {selectedPaquete.actividades.map(actividad => (
                        <div className="actividad-item" key={actividad.id_actividad}>
                          <div className="actividad-item-info">
                            <span className="actividad-item-name">{actividad.nombre}</span>
                            <span className="actividad-item-details">
                              {actividad.ciudad_nombre}, {actividad.pais_nombre} - ${actividad.precio}
                            </span>
                            {actividad.descripcion && (
                              <span className="actividad-item-description">{actividad.descripcion}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay actividades incluidas en este paquete.</p>
                  )}
                </div>
              )}

              {currentTab === 'servicios' && (
                <div className="modal-section">
                  <h3>Servicios Incluidos</h3>
                  {selectedPaquete.servicios && selectedPaquete.servicios.length > 0 ? (
                    <div className="servicios-list">
                      {selectedPaquete.servicios.map(servicio => (
                        <div className="servicio-item" key={servicio.id_servicio}>
                          <div className="servicio-item-info">
                            <span className="servicio-item-name">{servicio.nombre}</span>
                            <span className="servicio-item-details">{servicio.descripcion}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay servicios adicionales incluidos en este paquete.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-cancelar" 
                onClick={() => setShowDetailsModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Packages;