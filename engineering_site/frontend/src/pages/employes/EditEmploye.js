import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

function EditEmploye() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [date_embauche, setDate] = useState("");

  useEffect(() => {
    apiFetch(`employes/${id}`)
      .then(res => res.json())
      .then(data => {
        setNom(data.nom);
        setEmail(data.email);
        setRole(data.role);
        setSpecialite(data.specialite);
        setDate(data.date_embauche);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiFetch(`employes/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nom, email, mot_de_passe, role, specialite, date_embauche })
    }).then(() => navigate("/employes"));
  };

  return (
    <div className="container">
      <h2>Edit Employé</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-2" value={nom} onChange={(e) => setNom(e.target.value)} />
        <input type="email" className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Nouveau mot de passe" className="form-control mb-2" onChange={(e) => setPassword(e.target.value)} />
        <select className="form-control mb-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Employé">Employé</option>
          <option value="Administrateur">Administrateur</option>
        </select>
        <input type="text" className="form-control mb-2" value={specialite} onChange={(e) => setSpecialite(e.target.value)} />
        <input type="date" className="form-control mb-2" value={date_embauche} onChange={(e) => setDate(e.target.value)} />
        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default EditEmploye;