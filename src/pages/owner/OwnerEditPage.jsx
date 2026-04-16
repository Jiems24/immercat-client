import './OwnerEditPage.css'

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function OwnerEditPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { ownerId } = useParams();
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/owners/${ownerId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const owner = response.data;
        setFirstName(owner.firstName || "");
        setLastName(owner.lastName || "");
        setPhone(owner.phone || "");
        setEmail(owner.email || "");
        setDni(owner.dni || "");
        setAddress(owner.address || "");
      })
      .catch((error) => console.log(error));
  }, [ownerId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestBody = { firstName, lastName, phone, email, dni, address };
    axios
      .put(`${API_URL}/api/owners/${ownerId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => navigate(`/admin/owners/${ownerId}`))
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error updating owner";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="OwnerEditPage page-container">
      <h1>Editar propietario</h1>

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
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(`/admin/owners/${ownerId}`)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default OwnerEditPage;