import './OwnerCard.css'

import { Link } from "react-router-dom";

function OwnerCard({ owner }) {
  return (
    <div className="OwnerCard">
      <div className="owner-card-info">
        <h3>{owner.firstName} {owner.lastName}</h3>
        <p className="owner-card-phone">{owner.phone}</p>
        {owner.email && <p className="owner-card-email">{owner.email}</p>}
        <p className="owner-card-dni">DNI: {owner.dni}</p>
      </div>
      <Link to={`/admin/owners/${owner._id}`} className="owner-card-link">Ver ficha</Link>
    </div>
  );
}

export default OwnerCard;