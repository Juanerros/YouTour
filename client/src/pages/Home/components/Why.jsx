import { LuShield, LuHeadphones, LuUsers } from "react-icons/lu";
import { MdModeOfTravel } from "react-icons/md";

const Why = () => {
    const features = [
        {
            icon: <LuShield className="feature-icon" size={16}/>,
            title: "Viajes Seguros",
            description: "Seguro completo incluido en todos nuestros paquetes"
        },
        {
            icon: <LuHeadphones className="feature-icon" size={16}/>,
            title: "Soporte 24/7",
            description: "Asistencia disponible en cualquier momento del día"
        },
        {
            icon: <LuUsers className="feature-icon" size={12} color="snow"/>,
            title: "Guías Expertos",
            description: "Profesionales locales con amplio conocimiento"
        },
        {
            icon: <MdModeOfTravel className="feature-icon" size={16}/>,
            title: "Experiencias Únicas",
            description: "Tours exclusivos que no encontrarás en otro lugar"
        }
    ];
    return (
        <section className="why-us">
            <div className="why-us-content">
                <h2>¿Por qué elegir youTour?</h2>
                <p>Ofrecemos una experiencia de viaje completa con los más altos estándares de calidad y servicio</p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Why;