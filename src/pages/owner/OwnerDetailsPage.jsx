import './OwnerDetailsPage.css'

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
    const confirmArchive = window.confirm("¿Estás seguro de que quieres archivar este propietario?");
    if (confirmArchive) {
      axios.put(`${API_URL}/api/owners/${ownerId}/archive`, {}, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/owners"))
        .catch((error) => console.log(error));
    }
  };

  const handleRestore = () => {
    axios.put(`${API_URL}/api/owners/${ownerId}`, { isArchived: false }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => navigate("/admin/owners"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este propietario definitivamente?");
    if (confirmDelete) {
      axios.delete(`${API_URL}/api/owners/${ownerId}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/owners"))
        .catch((error) => console.log(error));
    }
  };

  if (!owner) return <p className="loading">Cargando...</p>;

  return (
    <div className="OwnerDetailsPage page-container">
      <div className="detail-header">
        <h1>{owner.firstName} {owner.lastName}</h1>
      </div>

      <div className="form-card">
        <div className="form-section-title">Datos del propietario</div>
        <div className="property-detail-grid">
          <div className="property-detail-item">
            <span className="detail-label">Teléfono</span>
            <span className="detail-value">{owner.phone}</span>
          </div>
          {owner.email && (
            <div className="property-detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{owner.email}</span>
            </div>
          )}
          <div className="property-detail-item">
            <span className="detail-label">DNI</span>
            <span className="detail-value">{owner.dni}</span>
          </div>
          {owner.address && (
            <div className="property-detail-item">
              <span className="detail-label">Dirección</span>
              <span className="detail-value">{owner.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Link to={`/admin/owners/edit/${owner._id}`}>
          <button className="btn-primary">Editar</button>
        </Link>
        {!owner.isArchived && (
          <button className="btn-warning" onClick={handleArchive}>Archivar</button>
        )}
        {owner.isArchived && (
          <button className="btn-success" onClick={handleRestore}>Restaurar</button>
        )}
        <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
        <Link to="/admin/owners">
          <button className="btn-secondary">Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default OwnerDetailsPage;