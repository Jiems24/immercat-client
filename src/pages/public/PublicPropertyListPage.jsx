import './PublicPropertyListPage.css'

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

  useEffect(() => { getProperties(1); }, []);

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
      <div className="public-list-header">
        <h1>Inmuebles disponibles</h1>
      </div>

      <div className="public-list-content">
        <aside className="filters-sidebar">
          <form onSubmit={handleFilter}>
            <h3>Filtros</h3>

            <div className="filter-group">
              <label>Operación</label>
              <select value={operationType} onChange={(e) => setOperationType(e.target.value)}>
                <option value="">Todas</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Tipo de inmueble</label>
              <div className="type-checkboxes">
                {["piso", "casa", "local", "oficina"].map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Precio máximo (€)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Sin límite"
              />
            </div>

            <div className="filter-actions">
              <button type="submit" className="btn-primary">Filtrar</button>
              <button type="button" className="btn-secondary" onClick={handleClearFilters}>Limpiar</button>
            </div>
          </form>
        </aside>

        <div className="public-properties-list">
          {properties.length === 0 && (
            <p className="empty-message">No se han encontrado inmuebles con estos filtros.</p>
          )}

          {properties.map((property) => (
            <div key={property._id} className="public-property-card">
              {property.images && property.images.length > 0 ? (
                <img src={property.images[0]} alt={property.title} className="public-card-img" />
              ) : (
                <div className="public-card-no-img">Sin foto</div>
              )}
              <div className="public-card-info">
                <h3>{property.title}</h3>
                <p className="public-card-meta">{property.propertyType} — {property.operationType}</p>
                <p className="public-card-price">{property.price.toLocaleString("es-ES")} €</p>
                <p className="public-card-location">{property.location}</p>
                {property.squareMeters && <p className="public-card-features">{property.squareMeters} m²</p>}
                {property.rooms && <p className="public-card-features">{property.rooms} hab. | {property.bathrooms} baños</p>}
                {property.agency && <p className="public-card-agency">{property.agency.name} — {property.agency.city}</p>}
                <Link to={`/properties/${property._id}`} className="public-card-link">Ver detalle</Link>
              </div>
            </div>
          ))}

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
      </div>
    </div>
  );
}

export default PublicPropertyListPage;