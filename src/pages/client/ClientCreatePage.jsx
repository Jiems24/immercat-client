import './ClientCreatePage.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

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
    const requestBody = { firstName, lastName, email, phone };
    if (demandType) requestBody.demandType = demandType;
    if (demandPropertyType) requestBody.demandPropertyType = demandPropertyType;
    if (demandBudget) requestBody.demandBudget = Number(demandBudget);
    if (demandZone) requestBody.demandZone = demandZone;

    axios
      .post(`${API_URL}/api/clients`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate("/admin/clients"))
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error creating client";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="ClientCreatePage page-container">
      <h1>Crear cliente</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section-title">Datos de contacto</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre <span className="required">*</span></label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Apellidos <span className="required">*</span></label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Teléfono <span className="required">*</span></label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-section-title">Demanda</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de demanda</label>
              <select value={demandType} onChange={(e) => setDemandType(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                <option value="compra">Compra</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de inmueble que busca</label>
              <select value={demandPropertyType} onChange={(e) => setDemandPropertyType(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                <option value="piso">Piso</option>
                <option value="casa">Casa</option>
                <option value="local">Local</option>
                <option value="oficina">Oficina</option>
              </select>
            </div>
            <div className="form-group">
              <label>Presupuesto (€)</label>
              <input type="number" value={demandBudget} onChange={(e) => setDemandBudget(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Zona preferida</label>
              <input type="text" value={demandZone} onChange={(e) => setDemandZone(e.target.value)} />
            </div>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Crear cliente</button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/clients")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default ClientCreatePage;