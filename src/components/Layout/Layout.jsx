import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";
import { useState } from "react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Navbar onMenuToggle={() => setIsSidebarOpen((isOpen) => !isOpen)} />

      <div className="layout-body">
        <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
        {isSidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close menu" onClick={() => setIsSidebarOpen(false)} />}

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