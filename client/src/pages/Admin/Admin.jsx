import './style.css'
import Logo from '/YouTourLogo.png'
import { IoMdSettings } from "react-icons/io";

const Admin = () => {
  return (
    <div className='Admin'>
      <div className="navbar">
        <h1>Administracion de YouTour</h1>
        <div className="nav-links">
          <a href="/admin/settings">Configuración<IoMdSettings size={15}/></a>
        </div>
      </div>
    </div>
  );
};

export default Admin;