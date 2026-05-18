import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MesSuivi.css";
import logo from "../../assets/logo.png";

function MesSuivi() {
  const [suivis, setSuivis] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, encours: 0, termine: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoModal, setPhotoModal] = useState(null);

  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const loadSuivis = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/suivis`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Données invalides");

      const mySuivis = data.filter(suivi => suivi.id_employe === user.id_employe);
      setSuivis(mySuivis);

      setStats({
        total: mySuivis.length,
        encours: mySuivis.filter((s) => s.statut === "En cours").length,
        termine: mySuivis.filter((s) => s.statut === "Terminé").length,
      });
    } catch (err) {
      setError("Impossible de charger les suivis.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadSuivis(); }, [loadSuivis]);

  const getStatutBadge = useCallback((statut) => {
    const map = { "Terminé": "badge-success", "En cours": "badge-info" };
    return map[statut] || "badge-gray";
  }, []);

  const suivisFiltres = useMemo(() => {
    if (!search.trim()) return suivis;
    const s = search.toLowerCase();
    return suivis.filter((suivi) =>
      suivi.projet?.nom_projet?.toLowerCase().includes(s) ||
      suivi.localisation?.toLowerCase().includes(s) ||
      suivi.statut?.toLowerCase().includes(s) ||
      suivi.commentaire?.toLowerCase().includes(s)
    );
  }, [suivis, search]);

  const handlePrint = (src) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Impression photo</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          <img src="${src}" onload="window.print(); window.close()">
        </body>
      </html>
    `);
    win.document.close();
  };

  const prevPhoto = () => setPhotoModal(pm => ({
    ...pm,
    index: pm.index - 1,
    src: `http://127.0.0.1:8000/api/photos/${pm.photos[pm.index - 1]}`
  }));

  const nextPhoto = () => setPhotoModal(pm => ({
    ...pm,
    index: pm.index + 1,
    src: `http://127.0.0.1:8000/api/photos/${pm.photos[pm.index + 1]}`
  }));

  if (loading) {
    return (
      <div className="ms-root">
        <div className="ms-loading">
          <div className="ms-spinner"></div>
          <p>Chargement des suivis…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ms-root">

      {/* TOPBAR */}
      <nav className="ms-topbar">
        <div className="ms-topbar-left">
          <img src={logo} alt="Logo" className="ms-logo-img" />
          <span className="ms-brand">PRO ETUDES <span>INGÉNIERIE &amp; COORDINATION</span></span>
        </div>
        <div className="ms-topbar-right">
          <div className="ms-user-chip">
            <div className="ms-user-av">
              {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                const name = u.nom_employe || u.name || u.nom || u.prenom || "E";
                return name[0].toUpperCase();
              })()}
            </div>
            <span className="ms-user-name">
              {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                return u.nom_employe || u.name || u.nom || u.prenom || "Employé";
              })()}
            </span>
          </div>
        </div>
      </nav>

      {/* PAGE */}
      <div className="ms-page">

        {/* HEADER */}
        <div className="ms-page-header">
          <div>
            <div className="ms-breadcrumb">
              Tableau de bord › Mes Suivis
            </div>
            <h1 className="ms-page-title">Mes Suivis</h1>
            <p className="ms-page-subtitle">
              Bienvenue, {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                return u.nom_employe || u.name || u.nom || u.prenom || "Employé";
              })()} — Voici l'ensemble de vos suivis de chantier
            </p>
          </div>
          <Link to="/create-suivi" className="ms-btn-new">
            Nouveau Suivi
          </Link>
        </div>

        {/* STATS */}
        <div className="ms-stats">
          <div className="ms-stat-card stat-total">
            <div><span className="ms-stat-val">{stats.total}</span><span className="ms-stat-label">Total Suivis</span></div>
          </div>
          <div className="ms-stat-card stat-encours">
            <div><span className="ms-stat-val">{stats.encours}</span><span className="ms-stat-label">En cours</span></div>
          </div>
          <div className="ms-stat-card stat-termine">
            <div><span className="ms-stat-val">{stats.termine}</span><span className="ms-stat-label">Terminés</span></div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="ms-toolbar">
          <div className="ms-search-wrap">
            <input
              className="ms-search-input"
              type="text"
              placeholder="Rechercher par projet, localisation, statut…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ms-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <button className="ms-filter-btn">Filtrer</button>
          <span className="ms-count-tag">
            {suivisFiltres.length} suivi{suivisFiltres.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="ms-error" role="alert">
            <span>⚠️</span>
            <span className="ms-error-text">{error}</span>
            <button onClick={loadSuivis} className="ms-btn-retry">Réessayer</button>
          </div>
        )}

        {/* TABLE */}
        {!error && (
          <div className="ms-table-wrap">
            <div className="ms-table-head">
              <div className="ms-th">Projet / Commentaire</div>
              <div className="ms-th">Localisation</div>
              <div className="ms-th">Statut</div>
              <div className="ms-th">Photos</div>
              <div className="ms-th">Date</div>
              <div className="ms-th ms-th-right">Actions</div>
            </div>

            <div className="ms-table-body">
              {suivisFiltres.length === 0 ? (
                <div className="ms-empty">
                  <div className="ms-empty-title">
                    {search ? "Aucun résultat trouvé" : "Aucun suivi assigné"}
                  </div>
                  <p className="ms-empty-sub">
                    {search
                      ? `Aucun suivi ne correspond à "${search}".`
                      : "Vous n'avez pas encore de suivis assignés."}
                  </p>
                </div>
              ) : (
                suivisFiltres.map((suivi) => (
                  <div key={suivi.id} className="ms-table-row">

                    <div className="ms-cell-projet">
                      <div className="ms-proj-name">
                        {suivi.projet?.nom_projet || `Projet #${suivi.id_projet}`}
                      </div>
                      <div className="ms-proj-desc">
                        {suivi.commentaire?.substring(0, 80)}
                        {suivi.commentaire?.length > 80 ? "..." : ""}
                      </div>
                    </div>

                    <div className="ms-cell-localisation">
                      {suivi.localisation || "-"}
                    </div>

                    <div className="ms-cell">
                      <span className={`ms-badge ${getStatutBadge(suivi.statut)}`}>
                        {suivi.statut || "En cours"}
                      </span>
                    </div>

                    {/* ✅ غير الصورة الأولى + badge */}
                    <div className="ms-cell-photos">
                      {suivi.photos && suivi.photos.length > 0 ? (
                        <div className="ms-photos-strip">
                          <img
                            src={`http://127.0.0.1:8000/api/photos/${suivi.photos[0]}`}
                            alt="photo 1"
                            className="ms-photo-thumb"
                            onClick={() =>
                              setPhotoModal({
                                src: `http://127.0.0.1:8000/api/photos/${suivi.photos[0]}`,
                                photos: suivi.photos,
                                index: 0,
                              })
                            }
                          />
                          {suivi.photos.length > 1 && (
                            <span
                              className="ms-more-badge"
                              onClick={() =>
                                setPhotoModal({
                                  src: `http://127.0.0.1:8000/api/photos/${suivi.photos[1]}`,
                                  photos: suivi.photos,
                                  index: 1,
                                })
                              }
                            >
                              +{suivi.photos.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="ms-no-photo">Aucune</span>
                      )}
                    </div>

                    <div className="ms-cell-date">
                      {new Date(suivi.date_suivi).toLocaleDateString("fr-FR")}
                    </div>

                    <div className="ms-cell-actions">
                      <Link to={`/edit-suivi/${suivi.id}`} className="ms-btn-edit">
                        Modifier
                      </Link>
                    </div>

                  </div>
                ))
              )}
            </div>

            {suivisFiltres.length > 0 && (
              <div className="ms-pagination">
                <span className="ms-page-info">
                  Affichage de 1–{suivisFiltres.length} sur {suivis.length} suivis
                </span>
                <div className="ms-page-btns">
                  <button className="ms-page-btn">‹</button>
                  <button className="ms-page-btn active">1</button>
                  <button className="ms-page-btn">›</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ✅ MODAL PHOTO AVEC NAVIGATION */}
      {photoModal && (
        <div className="ms-photo-overlay" onClick={() => setPhotoModal(null)}>
          <div className="ms-photo-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="ms-modal-header">
              <span className="ms-modal-count">
                {photoModal.index + 1} / {photoModal.photos.length}
              </span>
              <button className="ms-modal-close" onClick={() => setPhotoModal(null)}>✕</button>
            </div>

            {/* Photo + navigation */}
            <div className="ms-modal-img-wrap">
              {photoModal.index > 0 && (
                <button className="ms-modal-nav ms-modal-prev" onClick={prevPhoto}>‹</button>
              )}
              <img src={photoModal.src} alt="Photo agrandie" />
              {photoModal.index < photoModal.photos.length - 1 && (
                <button className="ms-modal-nav ms-modal-next" onClick={nextPhoto}>›</button>
              )}
            </div>

            {/* Miniatures */}
            {photoModal.photos.length > 1 && (
              <div className="ms-modal-thumbs">
                {photoModal.photos.map((p, i) => (
                  <img
                    key={i}
                    src={`http://127.0.0.1:8000/api/photos/${p}`}
                    alt={`thumb ${i + 1}`}
                    className={`ms-modal-thumb ${i === photoModal.index ? "active" : ""}`}
                    onClick={() => setPhotoModal(pm => ({
                      ...pm,
                      index: i,
                      src: `http://127.0.0.1:8000/api/photos/${p}`
                    }))}
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="ms-modal-actions">
              <button className="ms-btn-imprimer" onClick={() => handlePrint(photoModal.src)}>
                🖨️ Imprimer
              </button>
              <button className="ms-btn-fermer" onClick={() => setPhotoModal(null)}>
                ✕ Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MesSuivi;