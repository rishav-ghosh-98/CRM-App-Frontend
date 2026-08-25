import "./Navbar.css";
import { useLocation } from "react-router-dom";
import { menuItems } from "../../data/menuItem";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();

  const currentPage = menuItems.find((item) => item.to === location.pathname);

  return (
    <div className="navbar-custom">
      <button className="menu-toggle" type="button" aria-label="Open menu" onClick={onMenuToggle}>
        <FiMenu />
      </button>
      <h4>{currentPage ? currentPage.label : "Dashboard"}</h4>
    </div>
  );
};

export default Navbar;
