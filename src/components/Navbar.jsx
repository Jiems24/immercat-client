import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import logo from "../img/logo.png";
import onlyLogo from "../img/only-logo.png";
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logOutUser();
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="ImmerCAT" className="logo-full" />
          <img src={onlyLogo} alt="ImmerCAT" className="logo-icon" />
        </Link>

        <button
          className={`navbar-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""} onClick={closeMenu}>Dashboard</Link>
              <Link to="/admin/properties" className={location.pathname.startsWith("/admin/properties") ? "active" : ""} onClick={closeMenu}>Inmuebles</Link>
              <Link to="/admin/clients" className={location.pathname.startsWith("/admin/clients") ? "active" : ""} onClick={closeMenu}>Clientes</Link>
              <Link to="/admin/owners" className={location.pathname.startsWith("/admin/owners") ? "active" : ""} onClick={closeMenu}>Propietarios</Link>
              <span className="navbar-user">{user && user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={closeMenu}>Inicio</Link>
              <Link to="/properties" className={location.pathname.startsWith("/properties") ? "active" : ""} onClick={closeMenu}>Inmuebles</Link>
              <Link to="/login" className="btn-login" onClick={closeMenu}>Acceder</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;