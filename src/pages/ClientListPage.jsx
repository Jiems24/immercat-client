import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import ClientCard from "../components/ClientCard";

function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const storedToken = localStorage.getItem("authToken");

  const getAllClients = () => {
    const endpoint = showArchived
      ? `${API_URL}/api/clients/archived`
      : `${API_URL}/api/clients`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setClients(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllClients();
  }, [showArchived]);

  return (
    <div className="ClientListPage">
      <h1>{showArchived ? "Clientes archivados" : "Clientes"}</h1>

      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Ver activos" : "Ver archivados"}
      </button>

      {!showArchived && (
        <Link to="/admin/clients/create">
          <button>Crear cliente</button>
        </Link>
      )}

      {clients.length === 0 && (
        <p>{showArchived ? "No hay clientes archivados." : "No hay clientes."}</p>
      )}

      {clients.map((client) => (
        <ClientCard key={client._id} client={client} />
      ))}
    </div>
  );
}

export default ClientListPage;