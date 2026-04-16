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
  const [currentImages, setCurrentImages] = useState([]); // NUEVO — fotos actuales
  const [images, setImages] = useState([]); // NUEVO — fotos nuevas
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
        setCurrentImages(property.images || []); // NUEVO
      })
      .catch((error) => console.log(error));

    axios
      .get(`${API_URL}/api/owners`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOwners(response.data.owners))
      .catch((error) => console.log(error));
  }, [propertyId]);

  const handleImageChange = (e) => { // NUEVO
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

    const requestBody = {
      title,
      propertyType,
      operationType,
      price,
      location,
      squareMeters,
      rooms,
      bathrooms,
    };

    axios
      .post(
        `${API_URL}/api/generate-description`,
        requestBody,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
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

    const formData = new FormData(); // NUEVO

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

    images.forEach((image) => { // NUEVO
      formData.append("images", image);
    });

    axios
      .put(`${API_URL}/api/properties/${propertyId}`, formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/admin/properties/${propertyId}`);
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error updating property";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="PropertyEditPage">
      <h1>Editar inmueble</h1>

      <form onSubmit={handleSubmit}>
        <label>Título: *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Tipo de inmueble: *</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          required
        >
          <option value="">-- Seleccionar --</option>
          <option value="piso">Piso</option>
          <option value="casa">Casa</option>
          <option value="local">Local</option>
          <option value="oficina">Oficina</option>
        </select>

        <label>Tipo de operación: *</label>
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
          required
        >
          <option value="">-- Seleccionar --</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>

        <label>Precio (€): *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="1"
          required
        />

        <label>Ubicación:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Dirección:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label>Metros cuadrados:</label>
        <input
          type="number"
          value={squareMeters}
          onChange={(e) => setSquareMeters(e.target.value)}
        />

        <label>Habitaciones:</label>
        <input
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />

        <label>Baños:</label>
        <input
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />

        <label>Descripción:</label>
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={isGenerating}
        >
          {isGenerating ? "Generando..." : "Generar descripción con IA"}
        </button>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isGenerating}
        />

        <label>Fotos actuales:</label> {/* NUEVO */}
        {currentImages.length > 0 ? (
          <div className="current-images">
            {currentImages.map((url, index) => (
              <img key={index} src={url} alt={`Foto ${index + 1}`} width="100" />
            ))}
          </div>
        ) : (
          <p>Sin fotos</p>
        )}

        <label>Subir fotos nuevas (máximo 4, reemplaza las actuales):</label> {/* NUEVO */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {images.length > 0 && (
          <p>{images.length} foto(s) seleccionada(s)</p>
        )}

        <label>Estado:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
          <option value="alquilado">Alquilado</option>
        </select>

        <label>Propietario:</label>
        <select
          value={realOwner}
          onChange={(e) => setRealOwner(e.target.value)}
        >
          <option value="">-- Sin propietario --</option>
          {owners.map((owner) => (
            <option key={owner._id} value={owner._id}>
              {owner.firstName} {owner.lastName}
            </option>
          ))}
        </select>

        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={() => navigate(`/admin/properties/${propertyId}`)}>
          Cancelar
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default PropertyEditPage;