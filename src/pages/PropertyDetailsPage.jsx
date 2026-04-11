import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
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

  useEffect(() => {
    getProperty();
  }, [propertyId]);

  const handleArchive = () => {
    axios
      .put(
        `${API_URL}/api/properties/${propertyId}/archive`,
        {},
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => navigate("/admin/properties"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este inmueble definitivamente?"
    );

    if (confirmDelete) {
      axios
        .delete(`${API_URL}/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => navigate("/admin/properties"))
        .catch((error) => console.log(error));
    }
  };

  if (!property) return <p>Cargando...</p>;

  return (
    <div className="PropertyDetailsPage">
      <h1>{property.title}</h1>

      <p><strong>Tipo:</strong> {property.propertyType}</p>
      <p><strong>Operación:</strong> {property.operationType}</p>
      <p><strong>Precio:</strong> {property.price.toLocaleString("es-ES")} €</p>
      <p><strong>Estado:</strong> {property.status}</p>
      <p><strong>Ubicación:</strong> {property.location}</p>
      <p><strong>Dirección:</strong> {property.address}</p>
      <p><strong>Superficie:</strong> {property.squareMeters} m²</p>
      <p><strong>Habitaciones:</strong> {property.rooms}</p>
      <p><strong>Baños:</strong> {property.bathrooms}</p>
      <p><strong>Descripción:</strong> {property.description}</p>

      {property.realOwner && (
        <p>
          <strong>Propietario:</strong>{" "}
          {property.realOwner.firstName} {property.realOwner.lastName}
        </p>
      )}

      {property.agency && (
        <p>
          <strong>Inmobiliaria:</strong>{" "}
          {property.agency.name} ({property.agency.city})
        </p>
      )}

      {property.owner && (
        <p>
          <strong>Creado por:</strong> {property.owner.name}
        </p>
      )}

      <div>
        <Link to={`/admin/properties/edit/${property._id}`}>
          <button>Editar</button>
        </Link>

        {!property.isArchived && (
          <button onClick={handleArchive}>Archivar</button>
        )}

        <button onClick={handleDelete}>Eliminar</button>

        <Link to="/admin/properties">
          <button>Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;