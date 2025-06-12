import './style.css'
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <aside>
        <div className="sidebar">
          <div className="w-dashboard">
            <img src="" alt="" />
            <span>
              <h1>YouTour</h1><h4>Dashboard</h4>
            </span>
          </div>
        </div>
      </aside>
      <section className="main-content">
      <Outlet/>
      </section>
    </div>
  );
};

export default AdminLayout;