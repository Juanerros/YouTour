// Estilos
import './global.css';
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
import AdminLayout from "./pages/AdminLayout/AdminLayout.jsx";
import OrdersManagement from "./pages/OrdersManagement/OrdersManagement.jsx";

export default function App () {
  return (
    <Router>
      <ToastContainer
          position="top-right"
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
        {/* Despues se le agrega verificacion para que solo el admin pueda ver */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="orders" element={<OrdersManagement />} />
        </Route>
        <Route path="/auth" element={<Auth />} />

        {/* Rutas que contiene el Layout */}
        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />
          <Route path="/games" element={<Catalog />} />

        </Route>
      </Routes>
    </Router>
  );
};