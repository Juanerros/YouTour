// Estilos
import './globals.css';
// Rutas
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Notificaciones
import { ToastContainer } from "react-toastify";

// Layout
import Layout from './Layout.jsx';

// Paginas
import Home from './pages/Home/Home.jsx';
import Auth from './pages/Auth/Auth.jsx';
import Catalog from './pages/Catalog/Catalog.jsx';
import Admin from "./pages/Admin/Admin.jsx";
import Airplanes from "./pages/Admin/Pages/Airplanes.jsx";
import Activities from "./pages/Admin/Pages/Activities.jsx";
import Hotel from "./pages/Admin/Pages/Hotel.jsx";
import Packages from "./pages/Admin/Pages/Packages.jsx";
import AdminLayout from "./pages/AdminLayout/AdminLayout.jsx";
import OrdersManagement from "./pages/OrdersManagement/OrdersManagement.jsx";
import Cart from './pages/Cart/Cart.jsx';
import PackagePage from './pages/PackagePage/PackagePage.jsx';

const App = () => {
  return (
    <Router>
      <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          limit={3}
          pauseOnFocusLoss
          pauseOnHover
        />
      <Routes>
        
        {/* Rutas de Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="airplanes" element={<Airplanes />} />
          <Route path="activities" element={<Activities />} />
          <Route path="hotels" element={<Hotel />} />
          <Route path="packages" element={<Packages />} />

          {/* Rutas de gestion de pedidos */}
          <Route path="orders" element={<OrdersManagement />} />
        </Route>
        <Route path="/auth" element={<Auth />} />

        {/* Rutas del Cliente */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/package/:id" element={<PackagePage/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;