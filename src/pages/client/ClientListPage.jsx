import './ClientListPage.css'

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import ClientCard from "../../components/ClientCard";

function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const storedToken = localStorage.getItem("authToken");

  const getAllClients = (page = 1) => {
    const endpoint = showArchived
      ? `${API_URL}/api/clients/archived?page=${page}`
      : `${API_URL}/api/clients?page=${page}`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setClients(response.data.clients);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setCurrentPage(1);
    getAllClients(1);
  }, [showArchived]);

  const handlePageChange = (page) => {
    getAllClients(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="ClientListPage page-container">
      <div className="list-header">
        <h1>{showArchived ? "Clientes archivados" : "Clientes"}</h1>
        <div className="list-actions">
          <button
            className={showArchived ? "btn-primary" : "btn-secondary"}
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Ver activos" : "Ver archivados"}
          </button>
          {!showArchived && (
            <Link to="/admin/clients/create">
              <button className="btn-primary">Crear cliente</button>
            </Link>
          )}
        </div>
      </div>

      {clients.length === 0 && (
        <p className="empty-message">{showArchived ? "No hay clientes archivados." : "No hay clientes."}</p>
      )}

      <div className="list-grid">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientListPage;