import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import OwnerCard from "../../components/OwnerCard";

function OwnerListPage() {
  const [owners, setOwners] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const storedToken = localStorage.getItem("authToken");

  const getAllOwners = () => {
    const endpoint = showArchived
      ? `${API_URL}/api/owners/archived`
      : `${API_URL}/api/owners`;

    axios
      .get(endpoint, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOwners(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllOwners();
  }, [showArchived]);

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
    </div>
  );
}

export default OwnerListPage;