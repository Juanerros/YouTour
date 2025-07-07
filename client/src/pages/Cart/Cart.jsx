import './style.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaPlus, FaMinus, FaTimes, FaCar, FaUser, FaHeart, FaLock, FaCreditCard, FaMobileAlt, FaSpinner } from 'react-icons/fa';
import axios from '../../api/axios';
import { UserContext } from '../../contexts/UserContext.jsx';
import useNotification from '../../hooks/useNotification';
import useConfirmation from '../../hooks/useConfirmation';
import { LuUsers } from 'react-icons/lu';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { notify } = useNotification();
  const { confirm } = useConfirmation();

  const [view, setView] = useState('cart'); // cart o checkout
  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [otherCarts, setOtherCarts] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'uala'
  });

  // Cargar el carrito del usuario cuando se monta el componente
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchOtherCarts(); // Añadir esta línea
    }
  }, [user]);

  // Función para obtener el carrito del usuario desde la API
  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(`/cart/${user.id_user}`);

      if (response.status === 200 && response.data.cart) {
        const cartData = response.data.cart;
        setCartId(cartData.id_carrito);

        // Transformar los datos del carrito al formato esperado por el componente
        const formattedItem = {
          id: cartData.id_paquete,
          nombre: cartData.nombre,
          descripcion: cartData.descripcion,
          pais: cartData.pais_nombre,
          ciudad: cartData.ciudad_nombre,
          // location: `${cartData.ciudad_nombre || ''}, ${cartData.pais_nombre || ''}`,
          location: '',
          estado: cartData.estado,
          image: cartData.imagen || "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
          title: cartData.nombre,
          currentPrice: cartData.precio_base,
          originalPrice: cartData.precio_base,
          duration: cartData.duracion_dias || 5,
          dateInit: cartData.fecha_inicio ? new Date(cartData.fecha_inicio).toLocaleDateString() : "Próximamente",
          maxPersons: cartData.cantidad_personas,
          persons: 1,
          additionalServices: cartData.servicios.map(service => ({
            selected: false,
            price: service.precio,
            icon: service.icono,
            name: service.nombre,
            id: service.id_servicio
          })),
          activities: cartData.actividades.map(activity => ({
            id: activity.id_actividad,
            name: activity.nombre,
            type: activity.tipo,
            price: activity.precio,
            duration: activity.duracion,
            description: activity.descripcion,
            city: activity.ciudad_nombre,
          })),
          hotel: {
            id: cartData.hotel.id_hotel,
            name: cartData.hotel.nombre,
            rating: cartData.hotel.rating,
            description: cartData.hotel.descripcion,
          },
          vuelo: {
            id: cartData.vuelo.id_vuelo,
            airline: cartData.vuelo.aerolinea,
            duration: cartData.vuelo.duracion,
            // fecha y hora de salida:
            departureDate: new Date(cartData.vuelo.fecha_salida).toLocaleDateString(),
            departureTime: cartData.vuelo.hora_salida,
            // fecha y hora de llegada:
            arrivalDate: new Date(cartData.vuelo.fecha_llegada).toLocaleDateString(),
            arrivalTime: cartData.vuelo.hora_llegada,
          }
        };

        setCartItem(formattedItem);
      } else {
        setCartItem(null);
      }
    } catch (error) {
      setCartItem(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los demás carritos del usuario
  const fetchOtherCarts = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`/cart/${user.id_user}/all`);

      if (response.status === 200 && response.data.carts.length > 0) {
        setOtherCarts(response.data.carts);
      } else {
        setOtherCarts([]);
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error al obtener los carritos:', error);
      setOtherCarts([]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = cartItem.currentPrice * cartItem.persons;

    const additionalServicesPrice = cartItem.additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    return (basePrice + additionalServicesPrice);
  };

  const handleQuantityChange = (action) => {
    if (!cartItem) return;

    let newQuantity = cartItem.persons;
    if (action === 'increase' && newQuantity < cartItem.maxPersons) {
      newQuantity++;
    } else if (action === 'decrease' && newQuantity > 1) {
      newQuantity--;
    }

    // Actualizar el cartItem con la nueva cantidad y precio ajustado
    setCartItem({
      ...cartItem,
      persons: newQuantity,
      currentPrice: cartItem.originalPrice * newQuantity
    });
  };

  const handleServiceToggle = (serviceId) => {
    if (!cartItem) return;

    const updatedServices = cartItem.additionalServices.map(service => {
      if (service.id === serviceId) {
        return { ...service, selected: !service.selected };
      }
      return service;
    });

    setCartItem({ ...cartItem, additionalServices: updatedServices });
  };

  const handleRemoveItem = async () => {
    confirm('¿Estás seguro de que deseas eliminar este paquete del carrito?', async () => {
      try {
        setLoading(true);

        const response = await axios.delete(`/cart/${cartId}`);

        if (response.status == 200) {
          setCartItem(null);
          setCartId(null);
          notify('Paquete eliminado del carrito', 'success');
          fetchCart();
        }

      } catch (error) {
        console.error(error.response?.data?.message || 'Error al eliminar el paquete:', error);
      } finally {
        setLoading(false);
      }
    })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleCheckout = () => {
    // Pre-llenar el formulario con los datos del usuario si están disponibles
    setFormData(prevData => ({
      ...prevData,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      phone: user.phone || ''
    }));

    setView('checkout');
  };

  const handleBackToCart = () => {
    setView('cart');
  };

  const createCheckout = async () => {
    const metodo = formData.paymentMethod;

    try {
      const response = await axios.put(`/cart/${cartId}/checkout`,
        {
          total: calculateTotal()
        }
      );

      if (response.status == 200) {
        notify(response.data.message, 'success');
        setCartItem(null);
        setCartId(null);
        setView('cart');
        fetchOtherCarts();
      }
    } catch (err) {
      console.error('Error al realizar el pago:', err);
      notify(err.response?.data?.message || 'Error al realizar el pago', 'error')
    }

    if (metodo == 'mercad-opago') checkoutMP();
  };

  const checkoutMP = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mercado-pago/create`,
        {
          title: cartItem.nombre,
          price: calculateTotal()
        }
      );
  
      const { init_point } = response.data;
      if (init_point) {
        window.open(init_point, "_blank");
      } else {
        notify("No se pudo obtener el link de pago", "error");
      }
    } catch (err) {
      console.error("Error en checkoutMP:", err);
      notify("Error al generar link de pago", "error");
    }
  };
  
  

  const makeCheckout = () => {
    handleSubmitOrder();
    createCheckout();
  }
  const handlePay = () => {
    if (formData.paymentMethod === 'mercado-pago') {
      checkoutMP();
    } else {
      handleSubmitOrder();
    }
  };
  
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);

      // Procesar el checkout
      const checkoutResponse = await axios.put(`/cart/${cartId}/checkout`, {
        metodoPago: formData.paymentMethod,
        total: calculateTotal()
      });

      if (checkoutResponse.status == 200 || checkoutResponse.status == 201) {
        // Calcular el total
        const total = calculateTotal();

        // Enviar correo al cliente y jefe de ventas
        const response = await axios.post('/email/order-confirmation', {
          cartId: cartId,
          userInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone
          },
          orderDetails: {
            location: cartItem?.location,
            title: cartItem?.title,
            total: total
          }
        })

        console.log('Email enviado', response.data);

        notify('¡Pedido realizado con éxito! Gracias por tu compra.', 'success');
        setCartItem(null);
        setCartId(null);
        setView('cart');
        window.location.reload();
      }
    } catch (error) {
      notify('El Pedido fue procesado con exito, vuelve al carrito para ver tus vuelos!', 'success')
      console.error(error.response?.message || 'Error al procesar el pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalServicios = () => {
    if (!cartItem) return 0;

    let total = 0;
    cartItem.additionalServices.forEach(service => {
      if (service.selected) {
        total += service.price;
      }
    });
    return total;
  }

  const handleDeleteOrder = async (cartId) => {
    confirm('¿Estás seguro de que deseas cancelar este paquete?', async () => {
      try {
        setLoading(true);

        const response = await axios.post(`/cart/cancel/${cartId}`);

        if (response.status == 200) {
          setCartItem(null);
          setCartId(null);
          fetchOtherCarts();
          notify(response.data.message, 'success');
        }
      } catch (error) {
        notify(error.response?.data?.message || 'Error al eliminar el paquete', 'error')
        console.error(error.response?.data?.message || 'Error al eliminar el paquete:', error);
      } finally {
        setLoading(false);
      }
    })
  }

  return (
    <div className="cart-page">
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Cargando...</p>
        </div>
      ) : view === 'cart' ? (
        <div className="cart-container">
          <h1>Tu Carrito de Viajes</h1>

          {!user ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <LuUsers />
              </div>
              <h2>Inicia sesión para ver tu carrito</h2>
              <p>Necesitas iniciar sesión para acceder a tu carrito de compras</p>
              <button className="login-btn" onClick={() => navigate('/auth')}>
                Iniciar Sesion
              </button>
            </div>
          ) : !cartItem ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart />
              </div>
              <h2>Tu carrito está vacío</h2>
              <p>Descubre nuestros increíbles destinos y añade algunos paquetes a tu carrito</p>
              <button className="explore-btn" onClick={() => navigate('/catalog')}>
                Explorar Paquetes
              </button>
            </div>
          ) : (cartItem && cartItem.estado.toLowerCase() === 'activo') && (
            <div className="cart-content">
              <div className="cart-items">
                <div className="cart-item">
                  <div className="cart-item-image">
                    <img src={cartItem.image} alt={cartItem.title} />
                    <button className="remove-item-btn" onClick={() => handleRemoveItem()}>
                      <FaTimes />
                    </button>
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h3>{cartItem.title}</h3>
                      <div className="cart-item-location">{cartItem.location}</div>
                      <div className="cart-item-price">Precio base: {cartItem.originalPrice} $</div>
                      <div className="cart-item-duration">Duración: {cartItem.duration} días</div>
                      <div className="cart-item-date-init">Fecha de inicio: {cartItem.dateInit}</div>
                    </div>

                    <div className="additional-services">
                      <h4>Servicios adicionales</h4>
                      <div className="services-list">
                        {cartItem.additionalServices.map(service => (
                          <div
                            key={service.id}
                            className={`service-item ${service.selected ? 'selected' : ''}`}
                            onClick={() => handleServiceToggle(service.id)}
                          >
                            {service.icon === 'car' && <FaCar />}
                            {service.icon === 'user' && <FaUser />}
                            {service.icon === 'heart' && <FaHeart />}
                            <div className="service-details">
                              <span className="service-name">{service.name}</span>
                              <span className="service-price">{service.price} $</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hotel-info">
                      <h4>Hotel incluido</h4>
                      <div className="hotel-details">
                        <h5>{cartItem.hotel.name}</h5>
                        <p>Rating: {cartItem.hotel.rating}/5</p>
                        <p>{cartItem.hotel.description}</p>
                      </div>
                    </div>

                    <div className="flight-info">
                      <h4>Vuelo incluido</h4>
                      <div className="flight-details">
                        <h5>{cartItem.vuelo.airline}</h5>
                        <p>Duración: {cartItem.vuelo.duration}</p>
                        <p>Salida: {cartItem.vuelo.departureDate} a las {cartItem.vuelo.departureTime}</p>
                        <p>Llegada: {cartItem.vuelo.arrivalDate} a las {cartItem.vuelo.arrivalTime}</p>
                      </div>
                    </div>

                    <div className="activities-info">
                      <h4>Actividades incluidas</h4>
                      <div className="activities-list">
                        {cartItem.activities.map(activity => (
                          <div key={activity.id} className="activity-item">
                            <h5>{activity.name}</h5>
                            <p>Tipo: {activity.type}</p>
                            <p>Duración: {activity.duration}</p>
                            <p>Ciudad: {activity.city}</p>
                            <p>{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cart-summary">
                <h3>Resumen del Pedido</h3>
                <div className="quantity-control">
                  <span>Cantidad de pasajeros:</span>
                  <div className="quantity-buttons">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={cartItem.persons <= 1}
                      className="quantity-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-display">{cartItem.persons}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={cartItem.persons >= cartItem.maxPersons}
                      className="quantity-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="cart-item">
                    <div className="">
                      <div className="">
                        <h4>Servicios adicionales:</h4>
                        <div className="">
                          {cartItem.additionalServices.map(service => (
                            service.selected && (
                              <div
                                key={service.id}
                                className={'service-item'}
                                onClick={() => handleServiceToggle(service.id)}
                              >
                                {service.icon === 'car' && <FaCar />}
                                {service.icon === 'user' && <FaUser />}
                                {service.icon === 'heart' && <FaHeart />}
                                <div className="service-details">
                                  <span className="service-name">{service.name}</span>
                                  <span className="service-price">{service.price} $</span>
                                </div>
                              </div>
                            )
                          ))}
                          {!cartItem.additionalServices.some(s => s.selected) && (
                            <p>Ninguno</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span>{totalServicios() + ' $'}</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>{calculateTotal().toFixed(2)} $</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceder al Checkout
                </button>
                <div className="secure-payment">
                  <FaLock /> Pago 100% seguro y protegido
                </div>
              </div>
            </div>
          )}

          {otherCarts.length > 0 && (
            <div className="other-carts-section">
              <h2>Tus otros pedidos</h2>
              <div className="other-carts-container">
                {otherCarts.map(cart => (
                  <div key={cart.id_carrito} className="other-cart-item">
                    <div className="other-cart-details">
                      <h3>{cart.nombre}</h3>
                      <span className={`status-badge ${cart.estado.toLowerCase()}`}>
                        {cart.estado}
                      </span>
                      {(cart.estado.toLowerCase() === 'procesando') && (
                        <button onClick={() => handleDeleteOrder(cart.id_carrito)} >Cancelar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="checkout-container">
          <div className="checkout-header">
            <button className="back-btn" onClick={handleBackToCart}>
              <FaArrowLeft /> Volver al carrito
            </button>
            <h2>Checkout Seguro</h2>
            <div className="secure-badge">
              <FaLock /> Pago Seguro
            </div>
          </div>

          <div className="checkout-content">
            <div className="checkout-summary">
              <h3>Resumen de tu Reserva</h3>
              <div className="checkout-trip">
                <img src={cartItem?.image} alt={cartItem?.title} />
                <div className="checkout-trip-details">
                  <h4>{cartItem?.title}</h4>
                  <p>{cartItem?.location}</p>
                </div>
                <div className="checkout-trip-price">{cartItem?.currentPrice} $</div>
              </div>
              <p>Servicios adicionales: </p>
              <div className="checkout-trip">
                {cartItem?.additionalServices.map(service => (
                  service.selected && (
                    <div
                      key={service.id}
                      className={'service-item'}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      {service.icon === 'car' && <FaCar />}
                      {service.icon === 'user' && <FaUser />}
                      {service.icon === 'heart' && <FaHeart />}
                      <div className="service-details">
                        <span className="service-name">{service.name}</span>
                        <span className="service-price">{service.price} $</span>
                      </div>
                    </div>
                  )
                ))}
                {!cartItem?.additionalServices.some(s => s.selected) && (
                  <p>Ninguno</p>
                )}
              </div>
              <div className="checkout-total">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} $</span>
              </div>
              <div className="secure-payment-info">
                <FaLock /> Pago 100% Seguro
                <p>Tus datos están protegidos con encriptación SSL</p>
              </div>
            </div>

            <div className="checkout-form">
              <div className="form-section">
                <h3><FaUser /> Información Personal</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Nombre *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Apellidos *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3><FaCreditCard /> Método de Pago</h3>
                <div className="payment-methods">
                  <div
                    className={`payment-method ${formData.paymentMethod === 'uala' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('uala')}
                  >
                    <div className="payment-icon uala">
                      <FaCreditCard />
                    </div>
                    <div className="payment-details">
                      <h4>Pago Gratis</h4>
                      <p>Para versiones de testeo.</p>
                    </div>
                  </div>

                  <div
                    className={`payment-method ${formData.paymentMethod === 'mercado-pago' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodChange('mercado-pago')}
                  >
                    <div className="payment-icon mercado-pago">
                      <FaMobileAlt />
                    </div>
                    <div className="payment-details">
                      <h4>Mercado Pago</h4>
                      <p>Pagos seguros y rápidos</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="pay-button" onClick={handlePay}>
  Pagar con {formData.paymentMethod === 'mercado-pago' ? 'Mercado Pago' : 'Test'} {calculateTotal().toFixed(2)} $
</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;