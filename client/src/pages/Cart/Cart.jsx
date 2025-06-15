import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { FaShoppingCart, FaArrowLeft, FaPlus, FaMinus, FaTimes, FaCar, FaUser, FaHeart, FaLock, FaCreditCard, FaMobileAlt } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('cart'); // 'cart' or 'checkout'
  const [cartItems, setCartItems] = useState([
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
      location: "Praga, República Checa",
      title: "Magia Medieval en Praga",
      rating: 4.6,
      reviews: 142,
      originalPrice: 1399,
      currentPrice: 1099,
      duration: 5,
      nights: 4,
      persons: "2-6",
      date: "3 oct",
      includes: [
        "Vuelos ida y vuelta",
        "Hotel boutique",
        "Desayuno incluido",
        "Tour nocturno"
      ],
      quantity: {
        adults: 1,
        children: 0
      },
      additionalServices: [
        { id: 'transfer', name: 'Transfer Premium', icon: 'car', price: 89, selected: true },
        { id: 'guide', name: 'Guía Turístico Privado', icon: 'user', price: 150, selected: false },
        { id: 'insurance', name: 'Seguro Premium', icon: 'user', price: 45, selected: false },
        { id: 'wellness', name: 'Paquete Spa & Wellness', icon: 'heart', price: 120, selected: false }
      ]
    }
  ]);

  // For testing empty cart
  // const [cartItems, setCartItems] = useState([]);

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

  // Calculate total price
  const calculateItemTotal = (item) => {
    const basePrice = item.currentPrice * (item.quantity.adults + item.quantity.children * 0.7);
    const additionalServicesPrice = item.additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + service.price, 0);
    return basePrice + additionalServicesPrice;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleQuantityChange = (itemId, type, action) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = { ...item.quantity };
        if (action === 'increase') {
          newQuantity[type] += 1;
        } else if (action === 'decrease' && newQuantity[type] > 0) {
          newQuantity[type] -= 1;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
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

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleCheckout = () => {
    setView('checkout');
  };

  const handleBackToCart = () => {
    setView('cart');
  };

  const handleSubmitOrder = () => {
    // Here you would typically send the order to your backend
    alert('¡Pedido realizado con éxito! Gracias por tu compra.');
    setCartItems([]);
    setView('cart');
    navigate('/');
  };

  // Empty Cart Component
  const EmptyCart = () => (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <FaShoppingCart />
      </div>
      <h2>Tu carrito está vacío</h2>
      <p>Descubre nuestros increíbles destinos y añade algunos paquetes a tu carrito</p>
      <button className="explore-btn" onClick={() => navigate('/catalog')}>
        Explorar Destinos
      </button>
    </div>
  );

  // Cart Item Component
  const CartItem = ({ item }) => {
    const itemTotal = calculateItemTotal(item);
    
    return (
      <div className="cart-item">
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
            <div className="cart-item-price">{item.currentPrice} €</div>
          </div>
          
          <div className="cart-item-passengers">
            <h4>Pasajeros</h4>
            <div className="passenger-controls">
              <div className="passenger-type">
                <span className="passenger-label">
                  <FaUser /> Adultos
                </span>
                <div className="quantity-control">
                  <button 
                    onClick={() => handleQuantityChange(item.id, 'adults', 'decrease')}
                    disabled={item.quantity.adults <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity.adults}</span>
                  <button onClick={() => handleQuantityChange(item.id, 'adults', 'increase')}>
                    <FaPlus />
                  </button>
                </div>
              </div>
              
              <div className="passenger-type">
                <span className="passenger-label">
                  <FaUser className="small-icon" /> Niños
                </span>
                <div className="quantity-control">
                  <button 
                    onClick={() => handleQuantityChange(item.id, 'children', 'decrease')}
                    disabled={item.quantity.children <= 0}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity.children}</span>
                  <button onClick={() => handleQuantityChange(item.id, 'children', 'increase')}>
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
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
                    <span className="service-price">{service.price} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="cart-item-subtotal">
          <div className="subtotal-label">Subtotal:</div>
          <div className="subtotal-amount">{itemTotal} €</div>
        </div>
      </div>
    );
  };

  // Cart Summary Component
  const CartSummary = ({ total, onCheckout }) => (
    <div className="cart-summary">
      <h3>Resumen del Pedido</h3>
      <div className="summary-item">
        <span>{cartItems[0]?.location} ({cartItems.reduce((sum, item) => sum + item.quantity.adults + item.quantity.children, 0)} pax)</span>
        <span>{total} €</span>
      </div>
      <div className="summary-total">
        <span>Total:</span>
        <span>{total} €</span>
      </div>
      <button className="checkout-btn" onClick={onCheckout}>
        Proceder al Checkout
      </button>
      <div className="secure-payment">
        <FaLock /> Pago 100% seguro y protegido
      </div>
    </div>
  );

  // Checkout Form Component
  const CheckoutForm = ({ total, onSubmit }) => (
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
            <div className="checkout-trip-price">{cartItems[0]?.currentPrice} €</div>
          </div>
          <div className="checkout-total">
            <span>Total:</span>
            <span>{total} €</span>
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
            <h3><FaUser /> Dirección de Facturación</h3>
            <div className="form-group">
              <label htmlFor="address">Dirección *</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ciudad *</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Código Postal *</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
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
          
          <button className="pay-button" onClick={onSubmit}>
            Pagar con Ualá {total} €
          </button>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="cart-page">
      {view === 'cart' ? (
        <div className="cart-container">
          <h1>Tu Carrito de Viajes</h1>
          
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <CartSummary 
                total={calculateTotal()} 
                onCheckout={handleCheckout} 
              />
            </div>
          )}
        </div>
      ) : (
        <CheckoutForm 
          total={calculateTotal()} 
          onSubmit={handleSubmitOrder} 
        />
      )}
    </div>
  );
};

export default Cart;