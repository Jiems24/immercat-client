import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import PropertyCard from "../components/PropertyCard";

function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const storedToken = localStorage.getItem("authToken");

  const getAllProperties = () => {
    const endpoint = showArchived
      ? `${API_URL}/api/properties/archived`
      : `${API_URL}/api/properties`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setProperties(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllProperties();
  }, [showArchived]);

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
    </div>
  );
}

export default PropertyListPage;