import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function ClientDetailsPage() {
  const [client, setClient] = useState(null);
  const [linkedNotes, setLinkedNotes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [newNote, setNewNote] = useState("");
  const { clientId } = useParams();
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const getClient = () => {
    axios
      .get(`${API_URL}/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setClient(response.data))
      .catch((error) => console.log(error));
  };

  const getLinkedNotes = () => {
    axios
      .get(`${API_URL}/api/linked-notes/client/${clientId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setLinkedNotes(response.data))
      .catch((error) => console.log(error));
  };

  const getProperties = () => {
    axios
      .get(`${API_URL}/api/properties`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setProperties(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getClient();
    getLinkedNotes();
    getProperties();
  }, [clientId]);

  const handleAddLinkedNote = () => {
    if (!newNote.trim() || !selectedProperty) return;

    axios
      .post(
        `${API_URL}/api/linked-notes`,
        { text: newNote, client: clientId, property: selectedProperty },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => {
        setNewNote("");
        setSelectedProperty("");
        getLinkedNotes();
      })
      .catch((error) => console.log(error));
  };

  const handleArchive = () => {
    const confirmArchive = window.confirm(
      "¿Estás seguro de que quieres archivar este cliente?"
    );
    if (confirmArchive) {
      axios
        .put(
          `${API_URL}/api/clients/${clientId}/archive`,
          {},
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then(() => navigate("/admin/clients"))
        .catch((error) => console.log(error));
    }
  };

  const handleRestore = () => {
    axios
      .put(
        `${API_URL}/api/clients/${clientId}`,
        { isArchived: false },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => navigate("/admin/clients"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este cliente definitivamente?"
    );
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/api/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => navigate("/admin/clients"))
        .catch((error) => console.log(error));
    }
  };

  if (!client) return <p>Cargando...</p>;

  return (
    <div className="ClientDetailsPage">
      <h1>{client.firstName} {client.lastName}</h1>

      <h2>Datos de contacto</h2>
      <p><strong>Teléfono:</strong> {client.phone}</p>
      {client.email && <p><strong>Email:</strong> {client.email}</p>}

      <h2>Demanda</h2>
      {client.demandType && <p><strong>Tipo:</strong> {client.demandType}</p>}
      {client.demandPropertyType && <p><strong>Inmueble que busca:</strong> {client.demandPropertyType}</p>}
      {client.demandBudget && <p><strong>Presupuesto:</strong> {client.demandBudget.toLocaleString("es-ES")} €</p>}
      {client.demandZone && <p><strong>Zona:</strong> {client.demandZone}</p>}

      {!client.demandType && !client.demandPropertyType && !client.demandBudget && !client.demandZone && (
        <p>No hay demanda registrada.</p>
      )}

      <div className="linked-notes-section">
        <h2>Visitas</h2>

        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          <option value="">-- Seleccionar inmueble --</option>
          {properties.map((property) => (
            <option key={property._id} value={property._id}>
              {property.title}
            </option>
          ))}
        </select>

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Añadir nota de visita..."
        />

        <button
          type="button"
          onClick={handleAddLinkedNote}
          disabled={!newNote.trim() || !selectedProperty}
        >
          Añadir visita
        </button>

        {linkedNotes.length > 0 ? (
          <ul>
            {linkedNotes.map((note) => (
              <li key={note._id}>
                <strong>{note.property.title}</strong>
                <p>{note.text}</p>
                <small>{new Date(note.createdAt).toLocaleString("es-ES")}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay visitas registradas.</p>
        )}
      </div>

      <div>
        <Link to={`/admin/clients/edit/${client._id}`}>
          <button>Editar</button>
        </Link>

        {!client.isArchived && (
          <button onClick={handleArchive}>Archivar</button>
        )}

        {client.isArchived && (
          <button onClick={handleRestore}>Restaurar</button>
        )}

        <button onClick={handleDelete}>Eliminar</button>

        <Link to="/admin/clients">
          <button>Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default ClientDetailsPage;