import './style.css'
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div>
      <h1>Layout de Administración</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;