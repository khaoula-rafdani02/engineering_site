import React, { useEffect, useState } from "react";
import "./ListMessages.css";
import { apiFetch } from "../../api";

function ListMessages() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    apiFetch("messages")
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, []);

  const filteredMessages = messages.filter(msg =>
    msg.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.statut?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutClass = (statut) => {
    switch (statut) {
      case 'Nouveau': return 'ms-badge-new';
      case 'En cours': return 'ms-badge-process';
      case 'Traité': return 'ms-badge-done';
      default: return 'ms-badge-default';
    }
  };

  return (
    <div className="ms-root">
      <div className="ms-page">
        <div className="ms-page-header">
          <div>
            <div className="ms-breadcrumb">Tableau de bord › Communications</div>
            <h1 className="ms-page-title">Gestion des Messages</h1>
            <p className="ms-page-subtitle">Suivi des demandes clients et messages du site</p>
          </div>
        </div>

        <div className="ms-search-wrapper">
          <input
            type="text"
            className="ms-search-input"
            placeholder="Rechercher par nom, statut, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ms-table-wrap">
          <table className="ms-table-element">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client / Expéditeur</th>
                <th>Message</th>
                <th>Statut</th>
                <th>Date d'envoi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="ms-empty">Aucun message trouvé</td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id_message}>
                    <td><span className="ms-id-tag">#{msg.id_message}</span></td>
                    <td>
                      <div className="ms-font-bold">{msg.nom}</div>
                      <div className="ms-email-sub">{msg.email}</div>
                      {msg.id_client && <div className="ms-client-link">ID Client: {msg.id_client}</div>}
                    </td>
                    <td>
                      <div className="ms-message-preview" title={msg.message}>{msg.message}</div>
                    </td>
                    <td>
                      <span className={`ms-badge ${getStatutClass(msg.statut)}`}>{msg.statut}</span>
                    </td>
                    <td className="ms-date-cell">
                      {new Date(msg.date_envoi).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="ms-count-footer">Total : <strong>{filteredMessages.length}</strong> message(s)</div>
      </div>
    </div>
  );
}

export default ListMessages;