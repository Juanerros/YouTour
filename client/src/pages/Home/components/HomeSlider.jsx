import { Swiper, SwiperSlide } from "swiper/react";

const HomeSlider = () => {
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