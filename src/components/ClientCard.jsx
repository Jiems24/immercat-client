import { Link } from "react-router-dom";

function ClientCard({ client }) {
  return (
    <div className="ClientCard">
      <h3>{client.firstName} {client.lastName}</h3>
      <p>Teléfono: {client.phone}</p>
      {client.email && <p>Email: {client.email}</p>}
      {client.demandType && <p>Busca: {client.demandType}</p>}
      {client.demandPropertyType && <p>Tipo: {client.demandPropertyType}</p>}
      {client.demandBudget && <p>Presupuesto: {client.demandBudget.toLocaleString("es-ES")} €</p>}
      {client.demandZone && <p>Zona: {client.demandZone}</p>}
      <Link to={`/admin/clients/${client._id}`}>Ver ficha</Link>
    </div>
  );
}

export default ClientCard;