import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

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

    const requestBody = {
      firstName,
      lastName,
      phone,
      email,
      dni,
      address,
    };

    axios
      .put(`${API_URL}/api/owners/${ownerId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        navigate(`/admin/owners/${ownerId}`);
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Error updating owner";
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="OwnerEditPage">
      <h1>Editar propietario</h1>

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

        <label>DNI: *</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />

        <label>Dirección:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button type="submit">Guardar cambios</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default OwnerEditPage;