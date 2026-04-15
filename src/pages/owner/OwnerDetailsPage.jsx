import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function OwnerDetailsPage() {
  const [owner, setOwner] = useState(null);
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const getOwner = () => {
    axios
      .get(`${API_URL}/api/owners/${ownerId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOwner(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getOwner();
  }, [ownerId]);

  const handleArchive = () => {
    const confirmArchive = window.confirm(
      "¿Estás seguro de que quieres archivar este propietario?"
    );
    if (confirmArchive) {
      axios
        .put(
          `${API_URL}/api/owners/${ownerId}/archive`,
          {},
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then(() => navigate("/admin/owners"))
        .catch((error) => console.log(error));
    }
  };

  const handleRestore = () => {
    axios
      .put(
        `${API_URL}/api/owners/${ownerId}`,
        { isArchived: false },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => navigate("/admin/owners"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este propietario definitivamente?"
    );
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/api/owners/${ownerId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => navigate("/admin/owners"))
        .catch((error) => console.log(error));
    }
  };

  if (!owner) return <p>Cargando...</p>;

  return (
    <div className="OwnerDetailsPage">
      <h1>{owner.firstName} {owner.lastName}</h1>

      <p><strong>Teléfono:</strong> {owner.phone}</p>
      {owner.email && <p><strong>Email:</strong> {owner.email}</p>}
      <p><strong>DNI:</strong> {owner.dni}</p>
      {owner.address && <p><strong>Dirección:</strong> {owner.address}</p>}

      <div>
        <Link to={`/admin/owners/edit/${owner._id}`}>
          <button>Editar</button>
        </Link>

        {!owner.isArchived && (
          <button onClick={handleArchive}>Archivar</button>
        )}

        {owner.isArchived && (
          <button onClick={handleRestore}>Restaurar</button>
        )}

        <button onClick={handleDelete}>Eliminar</button>

        <Link to="/admin/owners">
          <button>Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default OwnerDetailsPage;