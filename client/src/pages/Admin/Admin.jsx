import './style.css'
import { BsSuitcaseFill } from "react-icons/bs";
import { IoIosAirplane } from "react-icons/io";
import { RiHotelFill } from "react-icons/ri";
import { PiSunFill } from "react-icons/pi";
import { FaShoppingBag, FaDollarSign } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import usePaquetes from './hooks/usePaquetes';
import useVuelos from './hooks/useVuelos';
import useHoteles from './hooks/useHoteles';
import useActividades from './hooks/useActividades';
import usePedidos from './hooks/usePedidos';

const Admin = () => {
  // Obtener datos reales de los hooks
  const { paquetes, loading: loadingPaquetes } = usePaquetes();
  const { vuelos, loading: loadingVuelos } = useVuelos();
  const { hoteles, loading: loadingHoteles } = useHoteles();
  const { actividades, loading: loadingActividades } = useActividades();
  const { pedidos, loading: loadingPedidos } = usePedidos();

  // Verificar si hay algún loading activo
  const isLoading = loadingPaquetes || loadingVuelos || loadingHoteles || loadingActividades || loadingPedidos;

  // Calcular estadísticas
  const totalPaquetes = paquetes?.length || 0;
  const totalVuelos = vuelos?.length || 0;
  const totalHoteles = hoteles?.length || 0;
  const totalActividades = actividades?.length || 0;
  const totalPedidos = pedidos?.length || 0;

  // Calcular ingresos estimados
  const calcularIngresos = () => {
    if (!pedidos || pedidos.length === 0) return '$0';
    
    const total = pedidos.reduce((sum, pedido) => {
      const precio = pedido.precio || pedido.total || pedido.amount || 0;
      return sum + (typeof precio === 'string' ? parseFloat(precio.replace(/[$,]/g, '')) || 0 : precio);
    }, 0);
    
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(total);
  };

  const dashboardData = [
    {
      title: "Paquetes Turísticos",
      value: loadingPaquetes ? "..." : totalPaquetes.toLocaleString(),
      subtitle: "Total paquetes activos",
      icon: <BsSuitcaseFill />,
      color: "#4A90E2",
      link: "Ver detalles →"
    },
    {
      title: "Vuelos Programados",
      value: loadingVuelos ? "..." : totalVuelos.toLocaleString(),
      subtitle: "Vuelos disponibles",
      icon: <IoIosAirplane />,
      color: "#50C878",
      link: "Gestionar vuelos →"
    },
    {
      title: "Hoteles Disponibles",
      value: loadingHoteles ? "..." : totalHoteles.toLocaleString(),
      subtitle: "Hoteles registrados",
      icon: <RiHotelFill />,
      color: "#9B59B6",
      link: "Ver hoteles →"
    },
    {
      title: "Actividades Populares",
      value: loadingActividades ? "..." : totalActividades.toLocaleString(),
      subtitle: "Actividades disponibles",
      icon: <PiSunFill />,
      color: "#FF8C00",
      link: "Explorar actividades →"
    },
    {
      title: "Pedidos Totales",
      value: loadingPedidos ? "..." : totalPedidos.toLocaleString(),
      subtitle: "Pedidos en sistema",
      icon: <FaShoppingBag />,
      color: "#E74C3C",
      link: "Ver pedidos →"
    },
    {
      title: "Ingresos Estimados",
      value: loadingPedidos ? "..." : calcularIngresos(),
      subtitle: "Total acumulado",
      icon: <FaDollarSign />,
      color: "#2ECC71",
      link: "Ver reportes →"
    }
  ];

  // Obtener los pedidos más recientes (máximo 5)
  const getRecentReservations = () => {
    if (loadingPedidos) {
      return [
        { 
          id: "Cargando...", 
          client: "Cargando datos...", 
          destination: "...", 
          date: "...", 
          status: "Cargando", 
          amount: "..." 
        }
      ];
    }

    if (!pedidos || pedidos.length === 0) {
      return [
        { 
          id: "Sin datos", 
          client: "No hay pedidos registrados", 
          destination: "N/A", 
          date: "N/A", 
          status: "Sin datos", 
          amount: "$0" 
        }
      ];
    }

    return pedidos.slice(0, 5).map((pedido, index) => {
      // Formatear fecha si es posible
      const formatearFecha = (fecha) => {
        if (!fecha) return new Date().toLocaleDateString();
        try {
          return new Date(fecha).toLocaleDateString('es-ES');
        } catch {
          return fecha.toString();
        }
      };

      // Formatear precio si es posible
      const formatearPrecio = (precio) => {
        if (!precio) return '$0';
        if (typeof precio === 'string' && precio.includes('$')) return precio;
        const numerico = typeof precio === 'string' ? parseFloat(precio) : precio;
        return isNaN(numerico) ? '$0' : `$${numerico.toLocaleString()}`;
      };

      return {
        id: pedido.id_carrito || pedido.id || `PD-${(index + 1).toString().padStart(3, '0')}`,
        client: pedido.cliente || pedido.usuario || pedido.user_name || 'Cliente no especificado',
        destination: pedido.destino || pedido.paquete || pedido.destination || 'Destino no especificado',
        date: formatearFecha(pedido.fecha || pedido.created_at || pedido.date),
        status: pedido.estado || pedido.status || 'Procesando',
        amount: formatearPrecio(pedido.precio || pedido.total || pedido.amount)
      };
    });
  };

  const recentReservations = getRecentReservations();

  return (
    <div className='admin-dashboard'>
      <div className="dashboard-header">
        <h1>Bienvenido al Dashboard</h1>
        <p>Resumen general de tu plataforma turística {isLoading && '(Cargando datos...)'}</p>
      </div>

      <div className="stats-grid">
        {dashboardData.map((item, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <h3>{item.title}</h3>
                <div className="stat-icon" style={{ backgroundColor: item.color }}>
                  {item.icon}
                </div>
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{item.value}</div>
              <div className="stat-subtitle">{item.subtitle}</div>
              <div className="stat-link" style={{ color: item.color }}>
                {item.link}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Reservas Recientes</h2>
        </div>
        <div className="table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>ID RESERVA</th>
                <th>CLIENTE</th>
                <th>DESTINO</th>
                <th>FECHA</th>
                <th>ESTADO</th>
                <th>MONTO</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((reservation, index) => (
                <tr key={index}>
                  <td className="reservation-id">{reservation.id}</td>
                  <td>{reservation.client}</td>
                  <td>{reservation.destination}</td>
                  <td>{reservation.date}</td>
                  <td>
                    <span className={`status-badge ${reservation.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="amount">{reservation.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;