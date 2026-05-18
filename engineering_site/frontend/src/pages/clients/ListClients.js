import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListClients.css";

function ListClients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/clients")
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  }, []);

  const deleteClient = (id) => {
    if (window.confirm(" Supprimer ce client ?")) {
      fetch(`http://127.0.0.1:8000/api/clients/${id}`, { method: "DELETE" })
        .then(() => setClients(clients.filter(c => c.id_client !== id)))
        .catch(err => console.error(err));
    }
  };

  const filteredClients = clients.filter(c => 
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ms-root">
      <div className="ms-page">
        {/* EN-TÊTE */}
        <div className="ms-page-header">
          <div>
            <div className="ms-breadcrumb">Tableau de bord › Clients</div>
            <h1 className="ms-page-title">Liste des Clients</h1>
            <p className="ms-page-subtitle">Gérez les informations de vos clients</p>
          </div>
          <Link to="/create-client" className="ms-btn-new">
            + Nouveau Client
          </Link>
        </div>

        {/* --- LA BARRE DE RECHERCHE (KIMA L'IMAGE) --- */}
        <div className="ms-search-wrapper">
          <input 
            type="text" 
            className="ms-search-input"
            placeholder="Rechercher par nom, email, téléphone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLEAU */}
        <div className="ms-table-wrap">
          <table className="ms-table-element">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th> Nom complet</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Date création</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ms-empty">Aucun client trouvé</td>
                </tr>
              ) : (
                filteredClients.map((c) => (
                  <tr key={c.id_client}>
                    <td><span className="ms-id-tag">#{c.id_client}</span></td>
                    <td className="ms-font-bold">{c.nom}</td>
                    <td className="ms-email-cell">{c.email}</td>
                    <td className="ms-font-medium">{c.telephone || "—"}</td>
                    <td className="ms-text-light">
                      {c.date_creation ? new Date(c.date_creation).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <div className="ms-cell-actions">
                        <Link to={`/edit-client/${c.id_client}`} className="ms-btn-edit">Modifier</Link>
                        <button onClick={() => deleteClient(c.id_client)} className="ms-btn-edit red">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="ms-count-footer">
           Total : {filteredClients.length} client(s)
        </div>
      </div>
    </div>
  );
}

export default ListClients;