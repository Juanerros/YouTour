const SpecialOffers = () => {
    return (
        <section className="special-offers-container">
        <div className="special-offers-content">
          <h2>OFERTAS ESPECIALES</h2>
          <p>Descubre nuestras promociones exclusivas y vive experiencias únicas con los mejores precios</p>

          <div className="offers-grid">
            <div className="offer-large" style={{
              backgroundImage: 'linear-gradient(rgba(255, 99, 71, 0.14), rgba(255, 99, 71, 0.14)), url("https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070")'
            }}>
              <div className="offer-content">
                <h3>OFERTAS DE VERANO</h3>
                <h4>Hasta 40% de descuento en destinos europeos</h4>
                <p>Descubre Europa con los mejores precios del año. Viajes únicos e inolvidables te esperan.</p>
                <button>Ver Ofertas →</button>
              </div>
            </div>

            <div className="offers-column">
              <div className="offer-small" style={{
                backgroundImage: 'linear-gradient(rgba(72, 61, 139, 0.14), rgba(72, 61, 139, 0.14)), url("https://images.unsplash.com/photo-1480996408299-fc0e830b5db1?q=80&w=2069")'
              }}>
                <div className="offer-content">
                  <h3>ESCAPADAS MÁGICAS</h3>
                  <h4>Destinos únicos para desconectar</h4>
                  <p>Lugares increíbles que cambiarán tu perspectiva del mundo</p>
                  <button>Ver Ofertas →</button>
                </div>
              </div>

              <div className="offer-small" style={{
                backgroundImage: 'linear-gradient(rgba(32, 178, 170, 0.14), rgba(32, 178, 170, 0.14)), url("https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070")'
              }}>
                <div className="offer-content">
                  <h3>EXTREMAS</h3>
                  <h4>Experiencias que desafían tus límites</h4>
                  <p>Adrenalina pura en los lugares más impresionantes</p>
                  <button>Ver Ofertas →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
export default SpecialOffers;