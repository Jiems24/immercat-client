import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { Link } from "react-router-dom";


function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/public/properties`)
      .then((response) => {
        const lastThree = response.data.properties.slice(-3).reverse();
        setFeaturedProperties(lastThree);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="HomePage">
      <div className="hero">
        <h1>ImmerCAT</h1>
        <p>Encuentra tu hogar en Cataluña</p>
        <Link to="/properties">
          <button>Ver inmuebles disponibles</button>
        </Link>
      </div>

      <div className="featured-section">
        <h2>Últimos inmuebles</h2>

        {featuredProperties.length === 0 && (
          <p>No hay inmuebles disponibles en este momento.</p>
        )}

        <div className="featured-properties">
          {featuredProperties.map((property) => (
            <div key={property._id} className="featured-card">
              <h3>{property.title}</h3>
              <p>{property.propertyType} — {property.operationType}</p>
              <p>{property.price.toLocaleString("es-ES")} €</p>
              <p>{property.location}</p>
              {property.squareMeters && <p>{property.squareMeters} m²</p>}
              {property.rooms && <p>{property.rooms} hab.</p>}
              {property.agency && (
                <p>{property.agency.name} — {property.agency.city}</p>
              )}
              <Link to={`/properties/${property._id}`}>Ver detalle</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;