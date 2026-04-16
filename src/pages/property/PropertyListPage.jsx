import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import PropertyCard from "../../components/PropertyCard";

function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const storedToken = localStorage.getItem("authToken");

  const getAllProperties = (page = 1) => {
    const endpoint = showArchived
      ? `${API_URL}/api/properties/archived?page=${page}`
      : `${API_URL}/api/properties?page=${page}`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setProperties(response.data.properties);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setCurrentPage(1);
    getAllProperties(1);
  }, [showArchived]);

  const handlePageChange = (page) => {
    getAllProperties(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="PropertyListPage">
      <h1>{showArchived ? "Inmuebles archivados" : "Inmuebles"}</h1>

      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Ver activos" : "Ver archivados"}
      </button>

      {!showArchived && (
        <Link to="/admin/properties/create">
          <button>Crear inmueble</button>
        </Link>
      )}

      {properties.length === 0 && (
        <p>{showArchived ? "No hay inmuebles archivados." : "No hay inmuebles."}</p>
      )}

      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
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

export default PropertyListPage;