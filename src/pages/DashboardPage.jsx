import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import { AuthContext } from "../context/auth.context";

function DashboardPage() {
  const [propertiesActive, setPropertiesActive] = useState(0);
  const [propertiesArchived, setPropertiesArchived] = useState(0);
  const [clientsActive, setClientsActive] = useState(0);
  const [clientsArchived, setClientsArchived] = useState(0);
  const [ownersActive, setOwnersActive] = useState(0);
  const [ownersArchived, setOwnersArchived] = useState(0);

  const { user } = useContext(AuthContext);
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${storedToken}` };

    axios.get(`${API_URL}/api/properties`, { headers })
      .then((response) => setPropertiesActive(response.data.length))
      .catch((error) => console.log(error));

    axios.get(`${API_URL}/api/properties/archived`, { headers })
      .then((response) => setPropertiesArchived(response.data.length))
      .catch((error) => console.log(error));

    axios.get(`${API_URL}/api/clients`, { headers })
      .then((response) => setClientsActive(response.data.length))
      .catch((error) => console.log(error));

    axios.get(`${API_URL}/api/clients/archived`, { headers })
      .then((response) => setClientsArchived(response.data.length))
      .catch((error) => console.log(error));

    axios.get(`${API_URL}/api/owners`, { headers })
      .then((response) => setOwnersActive(response.data.length))
      .catch((error) => console.log(error));

    axios.get(`${API_URL}/api/owners/archived`, { headers })
      .then((response) => setOwnersArchived(response.data.length))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="DashboardPage">
      <h1>Dashboard</h1>
      {user && <p>Bienvenido, {user.name}</p>}

      <div className="dashboard-counters">
        <div className="dashboard-card">
          <h2>Inmuebles</h2>
          <p><strong>{propertiesActive}</strong> activos</p>
          <p><strong>{propertiesArchived}</strong> archivados</p>
        </div>

        <div className="dashboard-card">
          <h2>Clientes</h2>
          <p><strong>{clientsActive}</strong> activos</p>
          <p><strong>{clientsArchived}</strong> archivados</p>
        </div>

        <div className="dashboard-card">
          <h2>Propietarios</h2>
          <p><strong>{ownersActive}</strong> activos</p>
          <p><strong>{ownersArchived}</strong> archivados</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;