import './ClientDetailsPage.css'

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function ClientDetailsPage() {
  const [client, setClient] = useState(null);
  const [linkedNotes, setLinkedNotes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [matchingProperties, setMatchingProperties] = useState([]);
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
      .then((response) => {
        setClient(response.data);
        getMatchingProperties(response.data);
      })
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
      .then((response) => setProperties(response.data.properties))
      .catch((error) => console.log(error));
  };

  const getMatchingProperties = (clientData) => {
    if (!clientData.demandType || !clientData.demandPropertyType || !clientData.demandBudget) return;

    axios
      .get(`${API_URL}/api/properties?limit=100`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const filtered = response.data.properties.filter((p) =>
          p.status === "disponible" &&
          p.price <= clientData.demandBudget &&
          p.operationType === (clientData.demandType === "compra" ? "venta" : "alquiler") &&
          p.propertyType === clientData.demandPropertyType
        );
        setMatchingProperties(filtered);
      })
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
      .post(`${API_URL}/api/linked-notes`, { text: newNote, client: clientId, property: selectedProperty }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => { setNewNote(""); setSelectedProperty(""); getLinkedNotes(); })
      .catch((error) => console.log(error));
  };

  const handleArchive = () => {
    const confirmArchive = window.confirm("¿Estás seguro de que quieres archivar este cliente?");
    if (confirmArchive) {
      axios.put(`${API_URL}/api/clients/${clientId}/archive`, {}, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/clients"))
        .catch((error) => console.log(error));
    }
  };

  const handleRestore = () => {
    axios.put(`${API_URL}/api/clients/${clientId}`, { isArchived: false }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => navigate("/admin/clients"))
      .catch((error) => console.log(error));
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente definitivamente?");
    if (confirmDelete) {
      axios.delete(`${API_URL}/api/clients/${clientId}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => navigate("/admin/clients"))
        .catch((error) => console.log(error));
    }
  };

  if (!client) return <p className="loading">Cargando...</p>;

  return (
    <div className="ClientDetailsPage page-container">
      <div className="detail-header">
        <h1>{client.firstName} {client.lastName}</h1>
      </div>

      <div className="form-card">
        <div className="form-section-title">Datos de contacto</div>
        <div className="property-detail-grid">
          <div className="property-detail-item">
            <span className="detail-label">Teléfono</span>
            <span className="detail-value">{client.phone}</span>
          </div>
          {client.email && (
            <div className="property-detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{client.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-card">
        <div className="form-section-title">Demanda</div>
        {client.demandType || client.demandPropertyType || client.demandBudget || client.demandZone ? (
          <div className="property-detail-grid">
            {client.demandType && (
              <div className="property-detail-item">
                <span className="detail-label">Tipo</span>
                <span className="detail-value">{client.demandType}</span>
              </div>
            )}
            {client.demandPropertyType && (
              <div className="property-detail-item">
                <span className="detail-label">Inmueble que busca</span>
                <span className="detail-value">{client.demandPropertyType}</span>
              </div>
            )}
            {client.demandBudget && (
              <div className="property-detail-item">
                <span className="detail-label">Presupuesto</span>
                <span className="detail-value detail-price">{client.demandBudget.toLocaleString("es-ES")} €</span>
              </div>
            )}
            {client.demandZone && (
              <div className="property-detail-item">
                <span className="detail-label">Zona</span>
                <span className="detail-value">{client.demandZone}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="empty-message">No hay demanda registrada.</p>
        )}
      </div>

      {matchingProperties.length > 0 && (
        <div className="form-card">
          <div className="form-section-title">Inmuebles que encajan</div>
          <ul className="matching-properties-list">
            {matchingProperties.map((property) => (
              <li key={property._id} className="matching-property-item">
                <div className="matching-property-info">
                  <span className="matching-property-title">{property.title}</span>
                  <span className="matching-property-price">{property.price.toLocaleString("es-ES")} €</span>
                  {property.location && <span className="matching-property-location">{property.location}</span>}
                </div>
                <Link to={`/admin/properties/${property._id}`}>
                  <button className="btn-secondary">Ver inmueble</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-card">
        <div className="form-section-title">Visitas</div>
        <div className="visits-form">
          <div className="form-group">
            <label>Inmueble</label>
            <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
              <option value="">-- Seleccionar inmueble --</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>{property.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Nota de visita</label>
            <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Añadir nota de visita..." />
          </div>
          <button type="button" className="btn-primary" onClick={handleAddLinkedNote} disabled={!newNote.trim() || !selectedProperty}>
            Añadir visita
          </button>
        </div>

        {linkedNotes.length > 0 ? (
          <ul className="linked-notes-list">
            {linkedNotes.map((note) => (
              <li key={note._id} className="linked-note-item">
                <div className="linked-note-client">
                  <strong>{note.property.title}</strong>
                </div>
                <p className="linked-note-text">{note.text}</p>
                <small className="linked-note-date">{new Date(note.createdAt).toLocaleString("es-ES")}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No hay visitas registradas.</p>
        )}
      </div>

      <div className="form-actions">
        <Link to={`/admin/clients/edit/${client._id}`}>
          <button className="btn-primary">Editar</button>
        </Link>
        {!client.isArchived && (
          <button className="btn-warning" onClick={handleArchive}>Archivar</button>
        )}
        {client.isArchived && (
          <button className="btn-success" onClick={handleRestore}>Restaurar</button>
        )}
        <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
        <Link to="/admin/clients">
          <button className="btn-secondary">Volver al listado</button>
        </Link>
      </div>
    </div>
  );
}

export default ClientDetailsPage;