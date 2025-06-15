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
          color: "linear-gradient(90deg, #e65c00, #F9423D)",
          buttonText: "Ver Ofertas"
        },
        {
          title: "Reserva Anticipada",
          subtitle: "Ahorra hasta $200 reservando con 3 meses de antelación",
          description: "Planifica tu viaje perfecto y obtén los mejores precios",
          icon: <FaClock />,
          color: "linear-gradient(90deg, #2E8B57, #00b09b)",
          buttonText: "Ver Ofertas"
        },
        {
          title: "¡Oferta Especial Europa!",
          subtitle: "Hasta 30% de descuento en paquetes seleccionados",
          description: "Descubre las ciudades más hermosas de Europa con precios increíbles",
          icon: <FaPercent />,
          color: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
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
              <div className="offer-card" style={{ background: offer.color }}>
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