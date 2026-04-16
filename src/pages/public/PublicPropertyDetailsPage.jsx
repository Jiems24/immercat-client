import './PublicPropertyDetailsPage.css'

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PublicPropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const { propertyId } = useParams();

  useEffect(() => {
    axios
      .get(`${API_URL}/public/properties/${propertyId}`)
      .then((response) => setProperty(response.data))
      .catch((error) => console.log(error));
  }, [propertyId]);

  if (!property) return <p className="loading">Cargando...</p>;

  return (
    <div className="PublicPropertyDetailsPage page-container">

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
          <div className="property-detail-item">
            <span className="detail-label">Ubicación</span>
            <span className="detail-value">{property.location}</span>
          </div>
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

      {property.agency && (
        <div className="form-card">
          <div className="form-section-title">Inmobiliaria</div>
          <div className="property-detail-item">
            <span className="detail-label">Nombre</span>
            <span className="detail-value">{property.agency.name}</span>
          </div>
          <div className="property-detail-item">
            <span className="detail-label">Ciudad</span>
            <span className="detail-value">{property.agency.city}</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <Link to="/properties">
          <button className="btn-secondary">Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default PublicPropertyDetailsPage;