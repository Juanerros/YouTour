import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaGift, FaClock, FaPercent } from 'react-icons/fa';

const HomeSlider = () => {
    const offers = [
        {
          title: "Paquete Todo Incluido",
          subtitle: "Servicios gratuitos en tu primer viaje",
          description: "Transfer, seguro y guía privado sin costo adicional",
          icon: <FaGift />,
          image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073",
          buttonText: "Ver Ofertas"
        },
        {
          title: "Reserva Anticipada",
          subtitle: "Ahorra hasta $200 reservando con 3 meses de antelación",
          description: "Planifica tu viaje perfecto y obtén los mejores precios",
          icon: <FaClock />,
          image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070",
          buttonText: "Ver Ofertas"
        },
        {
          title: "¡Oferta Especial Europa!",
          subtitle: "Hasta 30% de descuento en paquetes seleccionados",
          description: "Descubre las ciudades más hermosas de Europa con precios increíbles",
          icon: <FaPercent />,
          image: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070",
          buttonText: "Ver Ofertas"
        }
      ];

    return(
        <section className="slider-offers">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="offers-swiper"
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={index}>
              <div 
                className="offer-card" 
                style={{ 
                  backgroundImage: `url(${offer.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                <div className="offer-overlay"></div>
                <div className="offer-content">
                  <div className="offer-icon">{offer.icon}</div>
                  <h2>{offer.title}</h2>
                  <h3>{offer.subtitle}</h3>
                  <p>{offer.description}</p>
                  <button className="offer-btn">{offer.buttonText}</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    )
}
export default HomeSlider;