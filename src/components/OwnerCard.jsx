import { Link } from "react-router-dom";
 
function OwnerCard({ owner }) {
  return (
    <div className="OwnerCard">
      <h3>{owner.firstName} {owner.lastName}</h3>
      <p>Teléfono: {owner.phone}</p>
      {owner.email && <p>Email: {owner.email}</p>}
      <p>DNI: {owner.dni}</p>
      <Link to={`/admin/owners/${owner._id}`}>Ver ficha</Link>
    </div>
  );
}
 
export default OwnerCard;
 