import "./Navbar.css";
import { useLocation } from "react-router-dom";
import { menuItems } from "../../data/menuItem";

const Navbar = () => {
  const location = useLocation();

  const currentPage = menuItems.find((item) => item.to === location.pathname);

  return (
    <div className="navbar-custom">
      <h4>{currentPage ? currentPage.label : "Dashboard"}</h4>
    </div>
  );
};

export default Navbar;
