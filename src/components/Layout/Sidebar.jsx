import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { menuItems } from "../../data/menuItem";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>CRM</h3>
      <div className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to} className="sidebar-link">
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;