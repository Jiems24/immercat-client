import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import OwnerCard from "../../components/OwnerCard";

function OwnerListPage() {
  const [owners, setOwners] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const storedToken = localStorage.getItem("authToken");

  const getAllOwners = (page = 1) => {
    const endpoint = showArchived
      ? `${API_URL}/api/owners/archived?page=${page}`
      : `${API_URL}/api/owners?page=${page}`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setOwners(response.data.owners);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setCurrentPage(1);
    getAllOwners(1);
  }, [showArchived]);

  const handlePageChange = (page) => {
    getAllOwners(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="OwnerListPage">
      <h1>{showArchived ? "Propietarios archivados" : "Propietarios"}</h1>

      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Ver activos" : "Ver archivados"}
      </button>

      {!showArchived && (
        <Link to="/admin/owners/create">
          <button>Crear propietario</button>
        </Link>
      )}

      {owners.length === 0 && (
        <p>{showArchived ? "No hay propietarios archivados." : "No hay propietarios."}</p>
      )}

      {owners.map((owner) => (
        <OwnerCard key={owner._id} owner={owner} />
      ))}

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

export default OwnerListPage;