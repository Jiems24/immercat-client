import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  return (
    <div className="PropertyCard">
      {property.images && property.images.length > 0 && (
        <img src={property.images[0]} alt={property.title} width="300" />
      )}
      <h3>{property.title}</h3>
      <p>{property.propertyType} — {property.operationType}</p>
      <p>{property.price.toLocaleString("es-ES")} €</p>
      {property.location && <p>{property.location}</p>}
      <p>
        {property.rooms && `${property.rooms} hab.`}
        {property.rooms && property.bathrooms && " | "}
        {property.bathrooms && `${property.bathrooms} baños`}
        {(property.rooms || property.bathrooms) && property.squareMeters && " | "}
        {property.squareMeters && `${property.squareMeters} m²`}
      </p>
      <p>Estado: {property.status}</p>
      <Link to={`/admin/properties/${property._id}`}>Ver detalle</Link>
    </div>
  );
}

export default PropertyCard;