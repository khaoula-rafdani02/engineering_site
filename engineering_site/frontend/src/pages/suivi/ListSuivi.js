import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListSuivi.css";

export default function ListSuivi() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [photoModal, setPhotoModal] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const params = new URLSearchParams({
      role: user?.role || "",
      id_employe: user?.id_employe || ""
    });

    fetch(`http://127.0.0.1:8000/api/suivis?${params}`)
      .then(res => res.json())
      .then(data => {
        setSuivis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce suivi ?")) {
      fetch(`http://127.0.0.1:8000/api/suivis/${id}`, { method: "DELETE" })
        .then(() => setSuivis(suivis.filter(s => s.id !== id)));
    }
  };

  const filteredSuivis = suivis.filter(s =>
    s.projet?.nom_projet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employe?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.statut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total     = suivis.length;
  const enCours   = suivis.filter(s => s.statut === "En cours").length;
  const termines  = suivis.filter(s => s.statut === "Terminé").length;
  const suspendus = suivis.filter(s => s.statut === "Suspendu").length;

  const openModal  = (photos, index) => setPhotoModal({ photos, index });
  const closeModal = () => setPhotoModal(null);
  const prevPhoto  = () => setPhotoModal(pm => ({ ...pm, index: pm.index - 1 }));
  const nextPhoto  = () => setPhotoModal(pm => ({ ...pm, index: pm.index + 1 }));

  const printPhoto = (src) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Photo</title>
      <style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
      img{max-width:100%;max-height:100vh;}</style></head>
      <body><img src="${src}" onload="window.print();window.close()"></body></html>
    `);
    win.document.close();
  };

  const currentSrc = photoModal
    ? `http://127.0.0.1:8000/api/photos/${photoModal.photos[photoModal.index]}`
    : null;

  if (loading) {
    return <div className="loading">Chargement des suivis...</div>;
  }

  return (
    <div className="suivi-container">
      <div className="breadcrumb">
        Tableau de bord &gt; <span className="breadcrumb-active">Mes Suivis</span>
      </div>

      <div className="suivi-header">
        <h1 className="suivi-title">Mes Suivis</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/create-suivi">
            <button className="btn-primary">+ Nouveau Suivi</button>
          </Link>
        </div>
      </div>

      <p className="suivi-welcome">
        Bienvenue — Voici l'ensemble de vos suivis de projets
      </p>

      <div className="stats-grid">
        <div className="stat-card stat-card-total">
          <div className="stat-value">{total}</div>
          <div className="stat-label">TOTAL SUIVIS</div>
        </div>
        <div className="stat-card stat-card-encours">
          <div className="stat-value">{enCours}</div>
          <div className="stat-label">EN COURS</div>
        </div>
        <div className="stat-card stat-card-termine">
          <div className="stat-value">{termines}</div>
          <div className="stat-label">TERMINÉS</div>
        </div>
        <div className="stat-card stat-card-suspendu">
          <div className="stat-value">{suspendus}</div>
          <div className="stat-label">SUSPENDUS</div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par projet, employé, localisation, statut, commentaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredSuivis.length === 0 ? (
        <div className="empty-state">Aucun suivi trouvé.</div>
      ) : (
        <div className="table-wrapper">
          <table className="suivi-table">
            <thead>
              <tr>
                <th>Projet</th>
                <th>Employé</th>
                <th>Localisation</th>
                <th>Statut</th>
                <th>Commentaire</th>
                <th>Photos</th>
                <th>Date Suivi</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuivis.map((s) => (
                <tr key={s.id}>
                  <td className="project-cell">
                    <div className="project-name">{s.projet?.nom_projet || "-"}</div>
                  </td>
                  <td>{s.employe?.nom || "-"}</td>
                  <td>{s.localisation || "-"}</td>
                  <td>
                    <span className={`status-badge status-${s.statut?.toLowerCase().replace(" ", "")}`}>
                      {s.statut || "-"}
                    </span>
                  </td>
                  <td className="comment-cell">{s.commentaire || "-"}</td>

                  {/* ✅ غير الصورة الأولى + badge */}
                  <td>
                    {s.photos && s.photos.length > 0 ? (
                      <div className="photos-strip">
                        <img
                          src={`http://127.0.0.1:8000/api/photos/${s.photos[0]}`}
                          alt="photo 1"
                          className="photo-thumb"
                          onClick={() => openModal(s.photos, 0)}
                        />
                        {s.photos.length > 1 && (
                          <span
                            className="more-photos-badge"
                            onClick={() => openModal(s.photos, 1)}
                          >
                            +{s.photos.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="no-photo">-</span>
                    )}
                  </td>

                  <td>{new Date(s.date_suivi).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <Link to={`/edit-suivi/${s.id}`} className="action-link edit">
                      Modifier
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="action-link delete">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL PHOTOS */}
      {photoModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <h3>
                Photos
                <span className="modal-count">
                  {photoModal.index + 1} / {photoModal.photos.length}
                </span>
              </h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-img-wrap">
              {photoModal.index > 0 && (
                <button className="modal-nav modal-nav-prev" onClick={prevPhoto}>‹</button>
              )}
              <img src={currentSrc} alt="Photo agrandie" className="modal-main-img" />
              {photoModal.index < photoModal.photos.length - 1 && (
                <button className="modal-nav modal-nav-next" onClick={nextPhoto}>›</button>
              )}
            </div>

            {photoModal.photos.length > 1 && (
              <div className="modal-thumbs">
                {photoModal.photos.map((p, i) => (
                  <img
                    key={i}
                    src={`http://127.0.0.1:8000/api/photos/${p}`}
                    alt={`thumb ${i + 1}`}
                    className={`modal-thumb ${i === photoModal.index ? "active" : ""}`}
                    onClick={() => setPhotoModal(pm => ({ ...pm, index: i }))}
                  />
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-btn-print" onClick={() => printPhoto(currentSrc)}>
                Imprimer cette photo
              </button>
              <button className="modal-btn-close" onClick={closeModal}>
                ✕ Fermer
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}