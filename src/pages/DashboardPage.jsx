import './DashboardPage.css'

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

  if (!stats) return <p className="loading">Cargando...</p>;

  return (
    <div className="DashboardPage page-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        {user && <p className="dashboard-welcome">Bienvenido, {user.name}</p>}
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Resumen</h2>
        <div className="dashboard-counters">
          <div className="dashboard-card">
            <span className="dashboard-card-label">Inmuebles activos</span>
            <span className="dashboard-card-number">{stats.propertiesActive}</span>
            <span className="dashboard-card-sub">{stats.propertiesArchived} archivados</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-label">Clientes activos</span>
            <span className="dashboard-card-number">{stats.clientsActive}</span>
            <span className="dashboard-card-sub">{stats.clientsArchived} archivados</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-label">Propietarios activos</span>
            <span className="dashboard-card-number">{stats.ownersActive}</span>
            <span className="dashboard-card-sub">{stats.ownersArchived} archivados</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Inmuebles</h2>
        <div className="dashboard-stats">
          <div className="dashboard-card">
            <h3>Por tipo</h3>
            {stats.propertiesByType.map((item) => (
              <div key={item._id} className="dashboard-stat-row">
                <span className="dashboard-stat-label">{item._id}</span>
                <span className="dashboard-stat-value">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="dashboard-card">
            <h3>Por operación</h3>
            {stats.propertiesByOperation.map((item) => (
              <div key={item._id} className="dashboard-stat-row">
                <span className="dashboard-stat-label">{item._id}</span>
                <span className="dashboard-stat-value">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="dashboard-card">
            <h3>Por estado</h3>
            {stats.propertiesByStatus.map((item) => (
              <div key={item._id} className="dashboard-stat-row">
                <span className="dashboard-stat-label">{item._id}</span>
                <span className="dashboard-stat-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;