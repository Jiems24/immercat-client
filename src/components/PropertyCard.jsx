import { Link } from "react-router-dom";
 
function PropertyCard({ property }) {
  return (
    <div className="PropertyCard">
      <h3>{property.title}</h3>
      <p>{property.propertyType} — {property.operationType}</p>
      <p>{property.price.toLocaleString("es-ES")} €</p>
      <p>{property.location}</p>
      <p>{property.rooms} hab. | {property.bathrooms} baños | {property.squareMeters} m²</p>
      <p>Estado: {property.status}</p>
      <Link to={`/admin/properties/${property._id}`}>Ver detalle</Link>
    </div>
  );
}
 
export default PropertyCard;