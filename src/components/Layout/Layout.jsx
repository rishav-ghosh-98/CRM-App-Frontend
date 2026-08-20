import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Navbar />

      <div className="layout-body">
        <Sidebar />

        <main className="main-content">
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;