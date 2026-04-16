import './PropertyDetailsPage.css'

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [linkedNotes, setLinkedNotes] = useState([]);
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const getProperty = () => {
    axios
      .get(`${API_URL}/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setProperty(response.data))
      .catch((error) => console.log(error));
  };

  const getLinkedNotes = () => {
    axios
      .get(`${API_URL}/api/linked-notes/property/${propertyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setLinkedNotes(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProperty();
    getLinkedNotes();
  }, [propertyId]);

  const handleArchive = () => {
    const confirmArchive = window.confirm("¿Estás seguro de que quieres archivar este inmueble?");
    if (confirmArchive) {
      axios
        .put(`${API_URL}/api/properties/${propertyId}/archive`, {}, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/properties"))
        .catch((error) => console.log(error));
    }
  };

  const handleRestore = () => {
    axios
      .put(`${API_URL}/api/properties/${propertyId}`, { isArchived: false }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => navigate("/admin/properties"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este inmueble definitivamente?");
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/api/properties/${propertyId}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/properties"))
        .catch((error) => console.log(error));
    }
  };

  if (!property) return <p className="loading">Cargando...</p>;

  return (
    <div className="PropertyDetailsPage page-container">

      {property.images && property.images.length > 0 && (
        <div className="property-images">
          {property.images.map((url, index) => (
            <img key={index} src={url} alt={`Foto ${index + 1}`} className="property-detail-img" />
          ))}
        </div>
      )}

      <div className="property-detail-header">
        <h1>{property.title}</h1>
        <span className={`badge badge-${property.status}`}>{property.status}</span>
      </div>

      <div className="property-detail-body">
        <div className="property-detail-main">
          <div className="form-card">
            <div className="form-section-title">Información</div>
            <div className="property-detail-grid">
              <div className="property-detail-item">
                <span className="detail-label">Tipo</span>
                <span className="detail-value">{property.propertyType}</span>
              </div>
              <div className="property-detail-item">
                <span className="detail-label">Operación</span>
                <span className="detail-value">{property.operationType}</span>
              </div>
              <div className="property-detail-item">
                <span className="detail-label">Precio</span>
                <span className="detail-value detail-price">{property.price.toLocaleString("es-ES")} €</span>
              </div>
              {property.location && (
                <div className="property-detail-item">
                  <span className="detail-label">Ubicación</span>
                  <span className="detail-value">{property.location}</span>
                </div>
              )}
              {property.address && (
                <div className="property-detail-item">
                  <span className="detail-label">Dirección</span>
                  <span className="detail-value">{property.address}</span>
                </div>
              )}
              {property.squareMeters && (
                <div className="property-detail-item">
                  <span className="detail-label">Superficie</span>
                  <span className="detail-value">{property.squareMeters} m²</span>
                </div>
              )}
              {property.rooms && (
                <div className="property-detail-item">
                  <span className="detail-label">Habitaciones</span>
                  <span className="detail-value">{property.rooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="property-detail-item">
                  <span className="detail-label">Baños</span>
                  <span className="detail-value">{property.bathrooms}</span>
                </div>
              )}
            </div>
          </div>

          {property.description && (
            <div className="form-card">
              <div className="form-section-title">Descripción</div>
              <p className="property-description">{property.description}</p>
            </div>
          )}

          <div className="form-card">
            <div className="form-section-title">Detalles adicionales</div>
            {property.realOwner && (
              <div className="property-detail-item">
                <span className="detail-label">Propietario</span>
                <span className="detail-value">{property.realOwner.firstName} {property.realOwner.lastName}</span>
              </div>
            )}
            {property.agency && (
              <div className="property-detail-item">
                <span className="detail-label">Inmobiliaria</span>
                <span className="detail-value">{property.agency.name} — {property.agency.city}</span>
              </div>
            )}
            {property.owner && (
              <div className="property-detail-item">
                <span className="detail-label">Creado por</span>
                <span className="detail-value">{property.owner.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-card linked-notes-section">
          <div className="form-section-title">Clientes interesados</div>
          {linkedNotes.length > 0 ? (
            <ul className="linked-notes-list">
              {linkedNotes.map((note) => (
                <li key={note._id} className="linked-note-item">
                  <div className="linked-note-client">
                    <strong>{note.client.firstName} {note.client.lastName}</strong>
                    <span> — {note.client.phone}</span>
                  </div>
                  <p className="linked-note-text">{note.text}</p>
                  <small className="linked-note-date">{new Date(note.createdAt).toLocaleString("es-ES")}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">No hay clientes interesados registrados.</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Link to={`/admin/properties/edit/${property._id}`}>
          <button className="btn-primary">Editar</button>
        </Link>
        {!property.isArchived && (
          <button className="btn-warning" onClick={handleArchive}>Archivar</button>
        )}
        {property.isArchived && (
          <button className="btn-success" onClick={handleRestore}>Restaurar</button>
        )}
        <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
        <Link to="/admin/properties">
          <button className="btn-secondary">Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;