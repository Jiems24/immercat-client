import './OwnerCreatePage.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function OwnerCreatePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = { firstName, lastName, phone, email, dni, address };
    axios
      .post(`${API_URL}/api/owners`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate("/admin/owners"))
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error creating owner";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="OwnerCreatePage page-container">
      <h1>Crear propietario</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-section-title">Datos del propietario</div>
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
            <div className="form-group">
              <label>DNI <span className="required">*</span></label>
              <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Crear propietario</button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/owners")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default OwnerCreatePage;