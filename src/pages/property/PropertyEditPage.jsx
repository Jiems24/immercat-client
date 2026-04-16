import './PropertyEditPage.css'

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PropertyEditPage() {
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [operationType, setOperationType] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [squareMeters, setSquareMeters] = useState("");
  const [rooms, setRooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("disponible");
  const [realOwner, setRealOwner] = useState("");
  const [owners, setOwners] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const { propertyId } = useParams();
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const property = response.data;
        setTitle(property.title || "");
        setPropertyType(property.propertyType || "");
        setOperationType(property.operationType || "");
        setPrice(property.price || "");
        setLocation(property.location || "");
        setAddress(property.address || "");
        setSquareMeters(property.squareMeters || "");
        setRooms(property.rooms || "");
        setBathrooms(property.bathrooms || "");
        setDescription(property.description || "");
        setStatus(property.status || "disponible");
        setRealOwner(property.realOwner?._id || "");
        setCurrentImages(property.images || []);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${API_URL}/api/owners`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOwners(response.data.owners))
      .catch((error) => console.log(error));
  }, [propertyId]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 4) {
      setErrorMessage("Máximo 4 fotos permitidas.");
      return;
    }
    setImages(selectedFiles);
    setErrorMessage(undefined);
  };

  const handleGenerateDescription = () => {
    if (!propertyType || !operationType || !price) {
      setErrorMessage("Rellena al menos tipo, operación y precio antes de generar la descripción.");
      return;
    }
    setIsGenerating(true);
    setErrorMessage(undefined);
    const requestBody = { title, propertyType, operationType, price, location, squareMeters, rooms, bathrooms };
    axios
      .post(`${API_URL}/api/generate-description`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((response) => {
        setDescription(response.data.description);
        setIsGenerating(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error al generar la descripción. Puedes escribirla manualmente.");
        setIsGenerating(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("propertyType", propertyType);
    formData.append("operationType", operationType);
    formData.append("price", Number(price));
    formData.append("location", location);
    formData.append("address", address);
    if (squareMeters) formData.append("squareMeters", Number(squareMeters));
    if (rooms) formData.append("rooms", Number(rooms));
    if (bathrooms) formData.append("bathrooms", Number(bathrooms));
    formData.append("description", description);
    formData.append("status", status);
    if (realOwner) formData.append("realOwner", realOwner);
    images.forEach((image) => formData.append("images", image));

    axios
      .put(`${API_URL}/api/properties/${propertyId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}`, "Content-Type": "multipart/form-data" },
      })
      .then(() => navigate(`/admin/properties/${propertyId}`))
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error updating property";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="PropertyEditPage page-container">
      <h1>Editar inmueble</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section-title">Información básica</div>
          <div className="form-grid">
            <div className="form-group form-full">
              <label>Título <span className="required">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo de inmueble <span className="required">*</span></label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
                <option value="">-- Seleccionar --</option>
                <option value="piso">Piso</option>
                <option value="casa">Casa</option>
                <option value="local">Local</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de operación <span className="required">*</span></label>
              <select value={operationType} onChange={(e) => setOperationType(e.target.value)} required>
                <option value="">-- Seleccionar --</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div className="form-group">
              <label>Precio (€) <span className="required">*</span></label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="1" required />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="alquilado">Alquilado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ubicación</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Metros cuadrados</label>
              <input type="number" value={squareMeters} onChange={(e) => setSquareMeters(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Habitaciones</label>
              <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Baños</label>
              <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Propietario</label>
              <select value={realOwner} onChange={(e) => setRealOwner(e.target.value)}>
                <option value="">-- Sin propietario --</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>
                    {owner.firstName} {owner.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-section-title">Descripción</div>
          <div className="ai-row">
            <button type="button" className="btn-ai" onClick={handleGenerateDescription} disabled={isGenerating}>
              {isGenerating ? "Generando..." : "Generar descripción con IA"}
            </button>
          </div>
          <div className="form-group">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={isGenerating} placeholder="Descripción del inmueble..." />
          </div>
        </div>

        <div className="form-card">
          <div className="form-section-title">Fotos</div>
          <div className="form-section-title" style={{borderBottom: "none", paddingBottom: 0, marginBottom: 8}}>Fotos actuales</div>
          {currentImages.length > 0 ? (
            <div className="current-images">
              {currentImages.map((url, index) => (
                <img key={index} src={url} alt={`Foto ${index + 1}`} className="current-img-thumb" />
              ))}
            </div>
          ) : (
            <p className="photos-count">Sin fotos</p>
          )}
          <div className="form-group" style={{marginTop: 16}}>
            <label>Subir fotos nuevas (máximo 4, reemplaza las actuales)</label>
            <div className="file-input-wrapper">
              <label htmlFor="file-upload-edit" className="btn-file">
                Elegir fotos
              </label>
              <input
                id="file-upload-edit"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input-hidden"
              />
              <span className="file-input-text">
                {images.length > 0 ? `${images.length} foto(s) seleccionada(s)` : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(`/admin/properties/${propertyId}`)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default PropertyEditPage;