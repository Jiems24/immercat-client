import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [newNote, setNewNote] = useState("");
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

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...property.notes, { text: newNote }]; // MODIFICADO

    axios
      .put(
        `${API_URL}/api/properties/${propertyId}/notes`,
        { notes: updatedNotes },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => {
        setNewNote("");
        getProperty();
      })
      .catch((error) => console.log(error));
  };

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

  const handleRestore = () => {
    axios
      .put(
        `${API_URL}/api/properties/${propertyId}`,
        { isArchived: false },
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

      {property.images && property.images.length > 0 && (
        <div className="property-images">
          {property.images.map((url, index) => (
            <img key={index} src={url} alt={`Foto ${index + 1}`} width="300" />
          ))}
        </div>
      )}

      <p><strong>Tipo:</strong> {property.propertyType}</p>
      <p><strong>Operación:</strong> {property.operationType}</p>
      <p><strong>Precio:</strong> {property.price.toLocaleString("es-ES")} €</p>
      <p><strong>Estado:</strong> {property.status}</p>
      {property.location && <p><strong>Ubicación:</strong> {property.location}</p>}
      {property.address && <p><strong>Dirección:</strong> {property.address}</p>}
      {property.squareMeters && <p><strong>Superficie:</strong> {property.squareMeters} m²</p>}
      {property.rooms && <p><strong>Habitaciones:</strong> {property.rooms}</p>}
      {property.bathrooms && <p><strong>Baños:</strong> {property.bathrooms}</p>}
      {property.description && <p><strong>Descripción:</strong> {property.description}</p>}

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

      <div className="notes-section">
        <h2>Notas internas</h2>
        {property.notes && property.notes.length > 0 ? (
          <ul>
            {property.notes.map((note, index) => (
              <li key={index}>
                <span>{note.text}</span> {/* MODIFICADO */}
                <small> — {new Date(note.createdAt).toLocaleString("es-ES")}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay notas.</p>
        )}
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Añadir nota..."
        />
        <button type="button" onClick={handleAddNote}>Añadir nota</button>
      </div>

      <div>
        <Link to={`/admin/properties/edit/${property._id}`}>
          <button>Editar</button>
        </Link>

        {!property.isArchived && (
          <button onClick={handleArchive}>Archivar</button>
        )}

        {property.isArchived && (
          <button onClick={handleRestore}>Restaurar</button>
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