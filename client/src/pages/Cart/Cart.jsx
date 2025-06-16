import './style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaPlus, FaMinus, FaTimes, FaCar, FaUser, FaHeart, FaLock, FaCreditCard, FaMobileAlt, FaSpinner } from 'react-icons/fa';
import axios from '../../api/axios';
import { useUser } from '../../hooks/useUser';
import useNotification from '../../hooks/useNotification';
import useConfirmation from '../../hooks/useConfirmation';
import { LuUsers } from 'react-icons/lu';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { notify } = useNotification();
  const { confir } = useConfirmation();

  const [view, setView] = useState('cart'); 
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

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
    }
  }, [user]);

  // Función para obtener el carrito del usuario desde la API
  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(`/cart/${user.id_user}`);

      if (response.data && response.data.cart) {
        const cartData = response.data.cart;
        setCartId(cartData.id_carrito);

        // Transformar los datos del carrito al formato esperado por el componente
        const formattedItem = {
          id: cartData.id_paquete,
          image: cartData.imagen || "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
          location: `${cartData.ciudad || ''}, ${cartData.pais || ''}`,
          title: cartData.nombre,
          currentPrice: cartData.precio_base,
          originalPrice: cartData.precio_base,
          duration: cartData.duracion_dias || 5,
          date: cartData.fecha_inicio ? new Date(cartData.fecha_inicio).toLocaleDateString() : "Próximamente",
          persons: cartData.cantidad_personas ? `1-${cartData.cantidad_personas}` : "2-6",
          quantity: 1,
          additionalServices: [
            { id: 'transfer', name: 'Transfer Premium', icon: 'car', price: 89, selected: false },
            { id: 'guide', name: 'Guía Turístico Privado', icon: 'user', price: 150, selected: false },
            { id: 'insurance', name: 'Seguro Premium', icon: 'user', price: 45, selected: false },
            { id: 'wellness', name: 'Paquete Spa & Wellness', icon: 'heart', price: 120, selected: false }
          ]
        };

        setCartItems([formattedItem]);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(error.response?.data?.message || 'Error al obtener el carrito:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateItemTotal = (item) => {
    const basePrice = item.currentPrice * item.quantity;
    const additionalServicesPrice = item.additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    return basePrice + additionalServicesPrice;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleQuantityChange = (itemId, action) => {
    setCartItems(cartItems.map(item => {
      if (item.id !== itemId) return item;

      let newQuantity = item.quantity;
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) { // Mínimo 1 persona
        newQuantity -= 1;
      }

      return { ...item, quantity: newQuantity };
    }));
  };

  const handleServiceToggle = (itemId, serviceId) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const updatedServices = item.additionalServices.map(service => {
          if (service.id === serviceId) {
            return { ...service, selected: !service.selected };
          }
          return service;
        });
        return { ...item, additionalServices: updatedServices };
      }
      return item;
    }));
  };

  const handleRemoveItem = async (itemId) => {
    confir('¿Estás seguro de que deseas eliminar este paquete del carrito?', async () => {
      try {
        setLoading(true);
        await axios.delete(`/cart/${cartId}`);
        setCartItems([]);
        setCartId(null);
        notify('Paquete eliminado del carrito', 'success');
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

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);

      // Procesar el checkout
      const checkoutResponse = await axios.put(`/cart/${cartId}/checkout`, {
        metodoPago: formData.paymentMethod
      });

      const pedidoId = checkoutResponse.data.pedidoId;

      // Calcular el total
      const total = calculateTotal();

      // Enviar correo al cliente y jefe de ventas
      await axios.post('/email/order-confirmation', {
        orderId: pedidoId,
        userInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        orderDetails: {
          location: cartItems[0]?.location,
          title: cartItems[0]?.title,
          total: total
        }
      })

      notify('¡Pedido realizado con éxito! Gracias por tu compra.', 'success');
      setCartItems([]);
      setCartId(null);
      setView('cart');
    } catch (error) {
      console.error(error.response?.message || 'Error al procesar el pedido:', error);
      notify('Error al procesar el pedido', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalServicios = () => {
    let total = 0;
    cartItems.forEach(item => {
      item.additionalServices.forEach(service => {
        if (service.selected) {
          total += service.price;
        }
      })
    });
    return total;
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
          ) : cartItems.length === 0 ? (
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
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    {item.estado == 'Activo' ? (
                      <>
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                          <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
                            <FaTimes />
                          </button>
                        </div>

                        <div className="cart-item-details">
                          <div className="cart-item-header">
                            <h3>{item.title}</h3>
                            <div className="cart-item-location">{item.location}</div>
                            <div className="cart-item-price">{item.currentPrice} $</div>
                          </div>

                          <div className="additional-services">
                            <h4>Servicios adicionales</h4>
                            <div className="services-list">
                              {item.additionalServices.map(service => (
                                <div
                                  key={service.id}
                                  className={`service-item ${service.selected ? 'selected' : ''}`}
                                  onClick={() => handleServiceToggle(item.id, service.id)}
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
                        </div>
                      </>
                    ) : (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                          <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
                            <FaTimes />
                          </button>
                        </div>

                        <div className="cart-item-details">
                          <div className="cart-item-header">
                            <h3>{item.title}</h3>
                            <div className="cart-item-location">{item.location}</div>
                            <div className="cart-item-price">{item.currentPrice} $</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>


                ))}
              </div>

              <div className="cart-summary">
                <h3>Resumen del Pedido</h3>
                <div className="summary-item">

                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="">
                        <div className="">
                          <div className="top-cart">
                            <h4>Servicios adicionales:</h4>
                            <span className='total-price'>{calculateTotal()} $</span>
                          </div>
                          <div className="">
                            {item.additionalServices.map(service => (
                              service.selected && (
                                <div
                                  key={service.id}
                                  className={'service-item'}
                                  onClick={() => handleServiceToggle(item.id, service.id)}
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
                            {!item.additionalServices.some(s => s.selected) && (
                              <p>Ninguno</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <span>{totalServicios() + ' $'}</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>{calculateTotal()} $</span>
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
                <img src={cartItems[0]?.image} alt={cartItems[0]?.title} />
                <div className="checkout-trip-details">
                  <h4>{cartItems[0]?.title}</h4>
                  <p>{cartItems[0]?.location}</p>
                </div>
                <div className="checkout-trip-price">{cartItems[0]?.currentPrice} $</div>
              </div>
              <p>Servicios adicionales: </p>
              <div className="checkout-trip">
                {cartItems[0]?.additionalServices.map(service => (
                  service.selected && (
                    <div
                      key={service.id}
                      className={'service-item'}
                      onClick={() => handleServiceToggle(cartItems[0]?.id, service.id)}
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
                {!cartItems[0]?.additionalServices.some(s => s.selected) && (
                  <p>Ninguno</p>
                )}
              </div>
              <div className="checkout-total">
                <span>Total:</span>
                <span>{calculateTotal()} $</span>
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
                      <h4>Ualá</h4>
                      <p>Tarjeta Ualá y wallets digitales</p>
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

              <button className="pay-button" onClick={handleSubmitOrder}>
                Pagar con {formData.paymentMethod === 'uala' ? 'Ualá' : 'Mercado Pago'} {calculateTotal()} $
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;