import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

function PublicPropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const { propertyId } = useParams();

  useEffect(() => {
    axios
      .get(`${API_URL}/public/properties/${propertyId}`)
      .then((response) => setProperty(response.data))
      .catch((error) => console.log(error));
  }, [propertyId]);

  if (!property) return <p>Cargando...</p>;

  return (
    <div className="PublicPropertyDetailsPage">
      <h1>{property.title}</h1>

      <p><strong>Tipo:</strong> {property.propertyType}</p>
      <p><strong>Operación:</strong> {property.operationType}</p>
      <p><strong>Precio:</strong> {property.price.toLocaleString("es-ES")} €</p>
      <p><strong>Ubicación:</strong> {property.location}</p>
      {property.squareMeters && <p><strong>Superficie:</strong> {property.squareMeters} m²</p>}
      {property.rooms && <p><strong>Habitaciones:</strong> {property.rooms}</p>}
      {property.bathrooms && <p><strong>Baños:</strong> {property.bathrooms}</p>}
      {property.description && <p><strong>Descripción:</strong> {property.description}</p>}

      {property.agency && (
        <p><strong>Inmobiliaria:</strong> {property.agency.name} — {property.agency.city}</p>
      )}

      <Link to="/properties">
        <button>Volver al listado</button>
      </Link>
    </div>
  );
}

export default PublicPropertyDetailsPage;