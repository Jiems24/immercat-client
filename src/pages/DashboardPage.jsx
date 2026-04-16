import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { AuthContext } from "../context/auth.context";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/stats`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setStats(response.data))
      .catch((error) => console.log(error));
  }, []);

  if (!stats) return <p>Cargando...</p>;

  return (
    <div className="DashboardPage">
      <h1>Dashboard</h1>
      {user && <p>Bienvenido, {user.name}</p>}

      <div className="dashboard-counters">
        <div className="dashboard-card">
          <h2>Inmuebles</h2>
          <p><strong>{stats.propertiesActive}</strong> activos</p>
          <p><strong>{stats.propertiesArchived}</strong> archivados</p>
        </div>

        <div className="dashboard-card">
          <h2>Clientes</h2>
          <p><strong>{stats.clientsActive}</strong> activos</p>
          <p><strong>{stats.clientsArchived}</strong> archivados</p>
        </div>

        <div className="dashboard-card">
          <h2>Propietarios</h2>
          <p><strong>{stats.ownersActive}</strong> activos</p>
          <p><strong>{stats.ownersArchived}</strong> archivados</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-card">
          <h2>Inmuebles por tipo</h2>
          {stats.propertiesByType.map((item) => (
            <p key={item._id}>
              <strong>{item._id}:</strong> {item.count}
            </p>
          ))}
        </div>

        <div className="dashboard-card">
          <h2>Inmuebles por operación</h2>
          {stats.propertiesByOperation.map((item) => (
            <p key={item._id}>
              <strong>{item._id}:</strong> {item.count}
            </p>
          ))}
        </div>

        <div className="dashboard-card">
          <h2>Inmuebles por estado</h2>
          {stats.propertiesByStatus.map((item) => (
            <p key={item._id}>
              <strong>{item._id}:</strong> {item.count}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;