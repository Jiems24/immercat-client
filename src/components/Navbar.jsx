import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/");
  };

  return (
    <nav>
      {isLoggedIn && (
        <>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/properties">Inmuebles</Link>
          <Link to="/admin/clients">Clientes</Link>
          <Link to="/admin/owners">Propietarios</Link>
          <span>{user && user.name}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/">Inicio</Link>
          <Link to="/properties">Inmuebles</Link>
          <Link to="/login">Acceder</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;