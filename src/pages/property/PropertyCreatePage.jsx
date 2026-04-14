import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PropertyCreatePage() {
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
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/owners`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOwners(response.data))
      .catch((error) => console.log(error));
  }, []);

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

    const requestBody = {
      title,
      propertyType,
      operationType,
      price: Number(price),
      location,
      address,
      squareMeters: squareMeters ? Number(squareMeters) : undefined,
      rooms: rooms ? Number(rooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      description,
      status,
    };

    if (realOwner) {
      requestBody.realOwner = realOwner;
    }

    axios
      .post(`${API_URL}/api/properties`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        navigate("/admin/properties");
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error creating property";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="PropertyCreatePage">
      <h1>Crear inmueble</h1>

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

        <button type="submit">Crear inmueble</button>
        <button type="button" onClick={() => navigate("/admin/properties")}>
          Cancelar
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default PropertyCreatePage;