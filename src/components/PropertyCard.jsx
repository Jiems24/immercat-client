import './PropertyCard.css'

import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  return (
    <div className="PropertyCard">
      {property.images && property.images.length > 0 ? (
        <img src={property.images[0]} alt={property.title} className="property-card-img" />
      ) : (
        <div className="property-card-no-img">Sin foto</div>
      )}
      <div className="property-card-info">
        <h3>{property.title}</h3>
        <p className="property-card-meta">{property.propertyType} — {property.operationType}</p>
        <p className="property-card-price">{property.price.toLocaleString("es-ES")} €</p>
        {property.location && <p className="property-card-location">{property.location}</p>}
        <p className="property-card-features">
          {property.rooms && `${property.rooms} hab.`}
          {property.rooms && property.bathrooms && " | "}
          {property.bathrooms && `${property.bathrooms} baños`}
          {(property.rooms || property.bathrooms) && property.squareMeters && " | "}
          {property.squareMeters && `${property.squareMeters} m²`}
        </p>
        <span className={`badge badge-${property.status}`}>{property.status}</span>
        <Link to={`/admin/properties/${property._id}`} className="property-card-link">Ver detalle</Link>
      </div>
    </div>
  );
}

export default PropertyCard;