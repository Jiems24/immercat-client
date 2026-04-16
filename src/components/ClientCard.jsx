import './ClientCard.css'

import { Link } from "react-router-dom";

function ClientCard({ client }) {
  return (
    <div className="ClientCard">
      <div className="client-card-info">
        <h3>{client.firstName} {client.lastName}</h3>
        <p className="client-card-phone">{client.phone}</p>
        {client.email && <p className="client-card-email">{client.email}</p>}
      </div>
      <div className="client-card-demand">
        {client.demandType && (
          <span className="client-card-tag">{client.demandType}</span>
        )}
        {client.demandPropertyType && (
          <span className="client-card-tag">{client.demandPropertyType}</span>
        )}
        {client.demandBudget && (
          <span className="client-card-budget">{client.demandBudget.toLocaleString("es-ES")} €</span>
        )}
        {client.demandZone && (
          <span className="client-card-zone">{client.demandZone}</span>
        )}
      </div>
      <Link to={`/admin/clients/${client._id}`} className="client-card-link">Ver ficha</Link>
    </div>
  );
}

export default ClientCard;