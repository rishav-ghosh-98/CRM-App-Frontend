import "./Sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { menuItems } from "../../data/menuItem";

const Sidebar = ({ isOpen, onNavigate }) => {
  return (
    <div className={`sidebar${isOpen ? " is-open" : ""}`}>
      <Link className="sidebar-brand" to="/" onClick={onNavigate}>Anvaya CRM</Link>
      <div className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to} className="sidebar-link" onClick={onNavigate}>
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