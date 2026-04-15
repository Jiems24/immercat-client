import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function ClientDetailsPage() {
  const [client, setClient] = useState(null);
  const [newNote, setNewNote] = useState(""); // NUEVO
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

  useEffect(() => {
    getClient();
  }, [clientId]);

  // NUEVO
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...client.notes, newNote];

    axios
      .put(
        `${API_URL}/api/clients/${clientId}`,
        { notes: updatedNotes },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
      .then(() => {
        setNewNote("");
        getClient();
      })
      .catch((error) => console.log(error));
  };

  const handleArchive = () => {
    axios
      .put(
        `${API_URL}/api/clients/${clientId}/archive`,
        {},
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

      {/* NUEVO — sección de notas */}
      <div className="notes-section">
        <h2>Notas internas</h2>
        {client.notes && client.notes.length > 0 ? (
          <ul>
            {client.notes.map((note, index) => (
              <li key={index}>{note}</li>
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
        <Link to={`/admin/clients/edit/${client._id}`}>
          <button>Editar</button>
        </Link>

        {!client.isArchived && (
          <button onClick={handleArchive}>Archivar</button>
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