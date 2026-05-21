import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MesProjets.css";
import logo from "../../assets/logo.png";
import { apiFetch } from "../../api";

function MesProjets() {
  const [projets, setProjets] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, encours: 0, termine: 0, suspendu: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const loadProjets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(
        `projets?id_employe=${user.id_employe}&role=${user.role}`
      );
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Données invalides");
      setProjets(data);
      setStats({
        total: data.length,
        encours: data.filter((p) => p.statut === "En cours").length,
        termine: data.filter((p) => p.statut === "Terminé").length,
        suspendu: data.filter((p) => p.statut === "Suspendu").length,
      });
    } catch (err) {
      setError("Impossible de charger les projets.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadProjets(); }, [loadProjets]);

  const getStatutBadge = useCallback((statut) => {
    const map = { "Terminé": "badge-success", "Suspendu": "badge-warn", "En cours": "badge-info" };
    return map[statut] || "badge-gray";
  }, []);

  const projetsFiltres = useMemo(() => {
    if (!search.trim()) return projets;
    const s = search.toLowerCase();
    return projets.filter((p) =>
      p.nom_projet?.toLowerCase().includes(s) ||
      p.maitre_ouvrage?.toLowerCase().includes(s) ||
      p.statut?.toLowerCase().includes(s) ||
      p.localisation?.toLowerCase().includes(s) ||
      p.description?.toLowerCase().includes(s)
    );
  }, [projets, search]);

  if (loading) {
    return (
      <div className="mp-root">
        <div className="mp-loading">
          <div className="mp-spinner"></div>
          <p>Chargement des projets…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-root">
      <nav className="mp-topbar">
        <div className="mp-topbar-left">
          <img src={logo} className="mp-logo-img" />
          <span className="mp-brand">PRO ETUDES <span>INGÉNIERIE &amp; COORDINATION</span></span>
        </div>
        <div className="mp-topbar-right">
          <div className="mp-user-chip">
            <div className="mp-user-av">
              {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                const name = u.nom_employe || u.name || u.nom || u.prenom || "E";
                return name[0].toUpperCase();
              })()}
            </div>
            <span className="mp-user-name">
              {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                return u.nom_employe || u.name || u.nom || u.prenom || "Employé";
              })()}
            </span>
          </div>
        </div>
      </nav>

      <div className="mp-page">
        <div className="mp-page-header">
          <div>
            <div className="mp-breadcrumb">Tableau de bord › Mes Projets</div>
            <h1 className="mp-page-title">Mes Projets</h1>
            <p className="mp-page-subtitle">
              Bienvenue, {(() => {
                const u = JSON.parse(localStorage.getItem("user") || "{}");
                return u.nom_employe || u.name || u.nom || u.prenom || "Employé";
              })()} — Voici l'ensemble de vos projets assignés
            </p>
          </div>
          <Link to="/mes-create-projet" className="mp-btn-new">Nouveau Projet</Link>
        </div>

        <div className="mp-stats">
          <div className="mp-stat-card stat-total">
            <div><span className="mp-stat-val">{stats.total}</span><span className="mp-stat-label">Total Projets</span></div>
          </div>
          <div className="mp-stat-card stat-encours">
            <div><span className="mp-stat-val">{stats.encours}</span><span className="mp-stat-label">En cours</span></div>
          </div>
          <div className="mp-stat-card stat-termine">
            <div><span className="mp-stat-val">{stats.termine}</span><span className="mp-stat-label">Terminés</span></div>
          </div>
          <div className="mp-stat-card stat-suspendu">
            <div><span className="mp-stat-val">{stats.suspendu}</span><span className="mp-stat-label">Suspendus</span></div>
          </div>
        </div>

        <div className="mp-toolbar">
          <div className="mp-search-wrap">
            <input
              className="mp-search-input"
              type="text"
              placeholder="Rechercher par nom, maître d'ouvrage, localisation, statut…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="mp-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <button className="mp-filter-btn">Filtrer</button>
          <span className="mp-count-tag">
            {projetsFiltres.length} projet{projetsFiltres.length !== 1 ? "s" : ""}
          </span>
        </div>

        {error && (
          <div className="mp-error" role="alert">
            <span>⚠️</span>
            <span className="mp-error-text">{error}</span>
            <button onClick={loadProjets} className="mp-btn-retry">Réessayer</button>
          </div>
        )}

        {!error && (
          <div className="mp-table-wrap">
            <div className="mp-table-head">
              <div className="mp-th">Projet / Description</div>
              <div className="mp-th">Client / Localisation</div>
              <div className="mp-th">Statut</div>
              <div className="mp-th">Période</div>
              <div className="mp-th">Budget (DH)</div>
              <div className="mp-th mp-th-right">Actions</div>
            </div>

            <div className="mp-table-body">
              {projetsFiltres.length === 0 ? (
                <div className="mp-empty">
                  <div className="mp-empty-title">
                    {search ? "Aucun résultat trouvé" : "Aucun projet assigné"}
                  </div>
                  <p className="mp-empty-sub">
                    {search
                      ? `Aucun projet ne correspond à "${search}".`
                      : "Vous n'avez pas encore de projets assignés."}
                  </p>
                </div>
              ) : (
                projetsFiltres.map((projet) => (
                  <div key={projet.id_projet} className="mp-table-row">
                    <div className="mp-cell-projet">
                      <div>
                        <div className="mp-proj-name">{projet.nom_projet}</div>
                        <div className="mp-proj-desc">
                          {projet.description?.substring(0, 60)}
                          {projet.description?.length > 60 ? "..." : ""}
                        </div>
                      </div>
                    </div>

                    <div className="mp-cell-client">
                      <div className="mp-client-name">
                        Client: {(() => {
                          const client = projet.client;
                          if (client) {
                            const nom = client.nom;
                            const email = client.email;
                            if (nom && nom.trim() !== "") return nom;
                            if (email && email.trim() !== "") return email;
                          }
                          return projet.id_client ? `#${projet.id_client}` : "-";
                        })()}
                      </div>
                      <div className="mp-localisation">{projet.localisation || "-"}</div>
                    </div>

                    <div className="mp-cell">
                      <span className={`mp-badge ${getStatutBadge(projet.statut)}`}>
                        {projet.statut}
                      </span>
                    </div>

                    <div className="mp-cell-date">
                      <div>Début: {projet.date_debut}</div>
                      {projet.date_cloture ? (
                        <div>Clôture: {projet.date_cloture}</div>
                      ) : (
                        <div>Fin prév: —</div>
                      )}
                    </div>

                    <div className="mp-cell">
                      <span className="mp-cell-budget">
                        {parseFloat(projet.indemnite || 0).toLocaleString("fr-FR")} DH
                      </span>
                    </div>

                    <div className="mp-cell-actions">
                      <Link to={`/edit-projet/${projet.id_projet}`} className="mp-btn-edit">
                        Modifier
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {projetsFiltres.length > 0 && (
              <div className="mp-pagination">
                <span className="mp-page-info">
                  Affichage de 1–{projetsFiltres.length} sur {projets.length} projets
                </span>
                <div className="mp-page-btns">
                  <button className="mp-page-btn">‹</button>
                  <button className="mp-page-btn active">1</button>
                  <button className="mp-page-btn">›</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MesProjets;