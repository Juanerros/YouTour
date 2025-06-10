import { Outlet } from "react-router-dom";

// Componentes
import Nav from './components/Nav/Nav.jsx';

const Layout = () => {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main style={{ display: "flex" }}>
        <div className="router">
          <Outlet /> 
        </div>
      </main>
    </>
  );
}
export default Layout;