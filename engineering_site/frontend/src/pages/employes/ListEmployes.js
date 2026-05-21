import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListEmployes.css";
import { apiFetch } from "../../api";

function ListEmployes() {
  const [employes, setEmployes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiFetch("employes")
      .then((res) => res.json())
      .then((data) => setEmployes(data))
      .catch((err) => console.error(err));
  }, []);

  const deleteEmploye = (id) => {
    if (window.confirm("⚠️ Supprimer cet employé ?")) {
      apiFetch(`employes/${id}`, { method: "DELETE" })
        .then(() => setEmployes(employes.filter((e) => e.id_employe !== id)));
    }
  };

  const filteredEmployes = employes.filter((e) =>
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ms-root">
      <div className="ms-page">
        <div className="ms-page-header">
          <div>
            <div className="ms-breadcrumb">Tableau de bord › Employés</div>
            <h1 className="ms-page-title">Liste des Employés</h1>
            <p className="ms-page-subtitle">Gérez vos équipes et leurs accès</p>
          </div>
          <Link to="/create-employe" className="ms-btn-new">+ Nouveau Employé</Link>
        </div>

        <div className="ms-search-wrapper">
          <input
            type="text"
            className="ms-search-input"
            placeholder="Rechercher par nom, email, rôle, spécialité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ms-table-wrap">
          <table className="ms-table-element">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Employé</th>
                <th>Rôle / Spécialité</th>
                <th>Email</th>
                <th>Date Embauche</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ms-empty">Aucun employé trouvé</td>
                </tr>
              ) : (
                filteredEmployes.map((e) => (
                  <tr key={e.id_employe}>
                    <td><span className="ms-id-tag">#{e.id_employe}</span></td>
                    <td className="ms-font-bold">{e.nom}</td>
                    <td>
                      <div className="ms-role-badge">{e.role}</div>
                      <div className="ms-sub-text">{e.specialite}</div>
                    </td>
                    <td className="ms-email-cell">{e.email}</td>
                    <td className="ms-text-light">{e.date_embauche || "—"}</td>
                    <td>
                      <div className="ms-cell-actions">
                        <Link to={`/edit-employe/${e.id_employe}`} className="ms-btn-edit">Modifier</Link>
                        <button className="ms-btn-edit red" onClick={() => deleteEmploye(e.id_employe)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="ms-count-footer">Total : {filteredEmployes.length} employé(s)</div>
      </div>
    </div>
  );
}

export default ListEmployes;