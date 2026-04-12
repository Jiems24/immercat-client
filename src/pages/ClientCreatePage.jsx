import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

function ClientCreatePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [demandType, setDemandType] = useState("");
  const [demandPropertyType, setDemandPropertyType] = useState("");
  const [demandBudget, setDemandBudget] = useState("");
  const [demandZone, setDemandZone] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      firstName,
      lastName,
      email,
      phone,
    };

    if (demandType) requestBody.demandType = demandType;
    if (demandPropertyType) requestBody.demandPropertyType = demandPropertyType;
    if (demandBudget) requestBody.demandBudget = Number(demandBudget);
    if (demandZone) requestBody.demandZone = demandZone;

    axios
      .post(`${API_URL}/api/clients`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        navigate("/admin/clients");
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error creating client";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="ClientCreatePage">
      <h1>Crear cliente</h1>

      <form onSubmit={handleSubmit}>
        <label>Nombre: *</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Apellidos: *</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Teléfono: *</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Tipo de demanda:</label>
        <select
          value={demandType}
          onChange={(e) => setDemandType(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          <option value="compra">Compra</option>
          <option value="alquiler">Alquiler</option>
        </select>

        <label>Tipo de inmueble que busca:</label>
        <select
          value={demandPropertyType}
          onChange={(e) => setDemandPropertyType(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          <option value="piso">Piso</option>
          <option value="casa">Casa</option>
          <option value="local">Local</option>
          <option value="oficina">Oficina</option>
        </select>

        <label>Presupuesto (€):</label>
        <input
          type="number"
          value={demandBudget}
          onChange={(e) => setDemandBudget(e.target.value)}
        />

        <label>Zona preferida:</label>
        <input
          type="text"
          value={demandZone}
          onChange={(e) => setDemandZone(e.target.value)}
        />

        <button type="submit">Crear cliente</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default ClientCreatePage;