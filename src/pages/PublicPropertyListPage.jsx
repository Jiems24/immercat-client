import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

function PublicPropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [operationType, setOperationType] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");

  const getProperties = () => {
    const params = [];

    if (operationType) params.push(`operationType=${operationType}`);
    if (selectedTypes.length > 0) params.push(`propertyType=${selectedTypes.join(",")}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);

    const query = params.length > 0 ? "?" + params.join("&") : "";

    axios
      .get(`${API_URL}/public/properties${query}`)
      .then((response) => setProperties(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProperties();
  }, []);

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    getProperties();
  };

  const handleClearFilters = () => {
    setOperationType("");
    setSelectedTypes([]);
    setMaxPrice("");
  };

  useEffect(() => {
    if (operationType === "" && selectedTypes.length === 0 && maxPrice === "") {
      getProperties();
    }
  }, [operationType, selectedTypes, maxPrice]);

  return (
    <div className="PublicPropertyListPage">
      <h1>Inmuebles disponibles</h1>

      <form onSubmit={handleFilter} className="filters">
        <label>Operación:</label>
        <select
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>

        <label>Tipo de inmueble:</label>
        <div className="type-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes("piso")}
              onChange={() => handleTypeToggle("piso")}
            />
            Piso
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes("casa")}
              onChange={() => handleTypeToggle("casa")}
            />
            Casa
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes("local")}
              onChange={() => handleTypeToggle("local")}
            />
            Local
          </label>
          <label>
            <input
              type="checkbox"
              checked={selectedTypes.includes("oficina")}
              onChange={() => handleTypeToggle("oficina")}
            />
            Oficina
          </label>
        </div>

        <label>Precio máximo (€):</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Sin límite"
        />

        <button type="submit">Filtrar</button>
        <button type="button" onClick={handleClearFilters}>Limpiar filtros</button>
      </form>

      {properties.length === 0 && (
        <p>No se han encontrado inmuebles con estos filtros.</p>
      )}

      <div className="public-properties">
        {properties.map((property) => (
          <div key={property._id} className="public-property-card">
            <h3>{property.title}</h3>
            <p>{property.propertyType} — {property.operationType}</p>
            <p>{property.price.toLocaleString("es-ES")} €</p>
            <p>{property.location}</p>
            {property.squareMeters && <p>{property.squareMeters} m²</p>}
            {property.rooms && <p>{property.rooms} hab. | {property.bathrooms} baños</p>}
            {property.agency && (
              <p>{property.agency.name} — {property.agency.city}</p>
            )}
            <Link to={`/properties/${property._id}`}>Ver detalle</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicPropertyListPage;