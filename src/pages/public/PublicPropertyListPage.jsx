import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";

function PublicPropertyListPage() {
  const [properties, setProperties] = useState([]);
  const [operationType, setOperationType] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProperties = (page = 1) => {
    const params = [];

    if (operationType) params.push(`operationType=${operationType}`);
    if (selectedTypes.length > 0) params.push(`propertyType=${selectedTypes.join(",")}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);
    params.push(`page=${page}`);

    const query = "?" + params.join("&");

    axios
      .get(`${API_URL}/public/properties${query}`)
      .then((response) => {
        setProperties(response.data.properties);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProperties(1);
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
    setCurrentPage(1);
    getProperties(1);
  };

  const handleClearFilters = () => {
    setOperationType("");
    setSelectedTypes([]);
    setMaxPrice("");
    setCurrentPage(1);
    getProperties(1);
  };

  const handlePageChange = (page) => {
    getProperties(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (operationType === "" && selectedTypes.length === 0 && maxPrice === "") {
      getProperties(1);
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
            {property.images && property.images.length > 0 && (
              <img src={property.images[0]} alt={property.title} width="300" />
            )}
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

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicPropertyListPage;