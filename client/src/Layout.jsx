// Componentes
import Nav from './components/Nav/Nav.jsx';
// Dependencias
import { Outlet } from "react-router-dom";
import './globals.css';
const Layout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <div className="router">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;