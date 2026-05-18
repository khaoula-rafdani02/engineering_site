import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Projets.css";

// ── badge statut ───────────────────────────────────────────────────────────────
const statusBadge = (statut) => {
  let cls = "ms-badge ";
  if (statut === "Terminé")       cls += "badge-success";
  else if (statut === "En cours") cls += "badge-info";
  else if (statut === "Suspendu") cls += "badge-warn";
  else                            cls += "badge-gray";
  return <span className={cls}>{statut ?? "—"}</span>;
};

const PAGE_SIZE = 10;

// ── composant ──────────────────────────────────────────────────────────────────
function Projets() {
  const [projets,      setProjets]      = useState([]);
  const [selectedEmp,  setSelectedEmp]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [page,         setPage]         = useState(1);

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) { setLoading(false); return; }
    try {
      const user = JSON.parse(userString);
      if (!user?.id_employe) { setLoading(false); return; }

      fetch(`http://127.0.0.1:8000/api/projets?id_employe=${user.id_employe}&role=${user.role || ""}`)
        .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then(data => {
          const arr = Array.isArray(data) ? data
            : Array.isArray(data?.data)    ? data.data
            : Array.isArray(data?.projets) ? data.projets : [];
          setProjets(arr);
          setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
    } catch { setLoading(false); }
  }, []);

  // ── delete ─────────────────────────────────────────────────────────────────
  const deleteProjet = (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    fetch(`http://127.0.0.1:8000/api/projets/${id}`, { method: "DELETE" })
      .then(() => setProjets(prev => prev.filter(p => p.id_projet !== id)));
  };

  // ── filter + paginate ──────────────────────────────────────────────────────
  const filtered = projets.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      p.nom_projet?.toLowerCase().includes(q)     ||
      p.maitre_ouvrage?.toLowerCase().includes(q) ||
      p.localisation?.toLowerCase().includes(q)   ||
      p.statut?.toLowerCase().includes(q)         ||
      p.client?.nom?.toLowerCase().includes(q);
    const matchStatut = filterStatut === "Tous" || p.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total:    projets.length,
    encours:  projets.filter(p => p.statut === "En cours").length,
    termine:  projets.filter(p => p.statut === "Terminé").length,
    suspendu: projets.filter(p => p.statut === "Suspendu").length,
  };

  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; } })();

  const COLS = "2fr 1.4fr 1fr 1.3fr 0.9fr 220px";

  // ── loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ms-root">
        <div className="ms-loading">
          <div className="ms-spinner" />
          Chargement des projets…
        </div>
      </div>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="ms-root">
      <div className="ms-page">

        {/* ── EN-TÊTE ── */}
        <div className="ms-page-header">
          <div>
            <div className="ms-breadcrumb">Tableau de bord › Mes Projets</div>
            <h1 className="ms-page-title">Mes Projets</h1>
            <p className="ms-page-subtitle">
              Bienvenue, {user.nom || "Administrateur"} — Voici l'ensemble de vos projets assignés
            </p>
          </div>
          <Link to="/create-projet" className="ms-btn-new">
            + Nouveau Projet
          </Link>
        </div>

        {/* ── STATS 4 cards ── */}
        <div className="ms-stats" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="ms-stat-card stat-total">
            <div>
              <span className="ms-stat-val">{stats.total}</span>
              <span className="ms-stat-label">Total Projets</span>
            </div>
          </div>
          <div className="ms-stat-card stat-encours">
            <div>
              <span className="ms-stat-val">{stats.encours}</span>
              <span className="ms-stat-label">En Cours</span>
            </div>
          </div>
          <div className="ms-stat-card stat-termine">
            <div>
              <span className="ms-stat-val">{stats.termine}</span>
              <span className="ms-stat-label">Terminés</span>
            </div>
          </div>
          <div className="ms-stat-card stat-suspendu">
            <div>
              <span className="ms-stat-val">{stats.suspendu}</span>
              <span className="ms-stat-label">Suspendus</span>
            </div>
          </div>
        </div>

        {/* ── SEARCH + COUNT ── */}
        <div className="ms-toolbar">
          <div className="ms-search-wrap">
            <input
              className="ms-search-input"
              placeholder="Rechercher par nom, maître d'ouvrage, localisation, statut..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="ms-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <button className="ms-filter-btn">Filtrer</button>
          <span className="ms-count-tag">{filtered.length} projet{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── TABLE ── */}
        <div className="ms-table-wrap">

          {/* head */}
          <div className="ms-table-head" style={{ gridTemplateColumns: COLS }}>
            <div className="ms-th">Projet / Description</div>
            <div className="ms-th">Client / Localisation</div>
            <div className="ms-th">Statut</div>
            <div className="ms-th">Période</div>
            <div className="ms-th">Budget (DH)</div>
            <div className="ms-th ms-th-right">Actions</div>
          </div>

          {/* rows */}
          {paginated.length === 0 ? (
            <div className="ms-empty">
              <div className="ms-empty-title">Aucun projet trouvé</div>
              <div className="ms-empty-sub">Modifiez votre recherche ou ajoutez un nouveau projet.</div>
            </div>
          ) : (
            paginated.map(p => (
              <div key={p.id_projet} className="ms-table-row" style={{ gridTemplateColumns: COLS }}>

                {/* Projet / Description */}
                <div>
                  <div className="ms-proj-name">{p.nom_projet}</div>
                  {p.description && (
                    <div className="ms-proj-desc">
                      {p.description.length > 60 ? p.description.slice(0, 60) + "…" : p.description}
                    </div>
                  )}
                </div>

                {/* Client / Localisation */}
                <div>
                  {p.client?.nom && <div className="ms-cell">Client : {p.client.nom}</div>}
                  {p.localisation && <div className="ms-proj-desc">{p.localisation}</div>}
                  {p.employe && (
                    <span
                      className="ms-proj-desc"
                      style={{ color: "var(--blue-t)", cursor: "pointer" }}
                      onClick={() => setSelectedEmp(p.employe)}
                    >
                      · {p.employe.nom}
                    </span>
                  )}
                </div>

                {/* Statut */}
                <div>{statusBadge(p.statut)}</div>

                {/* Période */}
                <div>
                  <div className="ms-cell" style={{ fontSize: 12 }}>Début : {p.date_debut ?? "—"}</div>
                  <div className="ms-proj-desc">Clôture : {p.date_cloture ?? "—"}</div>
                </div>

                {/* Budget */}
                <div className="ms-cell" style={{ fontWeight: 700, color: "var(--navy)" }}>
                  {p.indemnite ? `${p.indemnite} DH` : "—"}
                </div>

               
                <div className="ms-cell-actions">
               
                  <Link to={`/edit-projet/${p.id_projet}`} className="ms-btn-edit">
                    Modifier
                  </Link>
                  <button
                    className="ms-btn-edit red"
                    onClick={() => deleteProjet(p.id_projet)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}

          {/* pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="ms-pagination">
              <span className="ms-page-info">
                Page {page} sur {totalPages} — {filtered.length} projets
              </span>
              <div className="ms-page-btns">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`ms-page-btn${page === n ? " active" : ""}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL EMPLOYÉ ── */}
      {selectedEmp && (
        <div onClick={() => setSelectedEmp(null)} style={{
          position: "fixed", inset: 0, background: "rgba(13,23,40,.55)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, padding: "1.5rem",
            width: 380, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(13,23,40,.25)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div className="ms-user-av" style={{ width: 48, height: 48, fontSize: 16 }}>
                {(selectedEmp.nom ?? "?")[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, margin: 0, color: "var(--navy)" }}>
                  {selectedEmp.nom}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-mid)", margin: 0 }}>
                  {selectedEmp.poste ?? "Employé"}
                </p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              {[
                ["Département", selectedEmp.departement],
                ["Email",       selectedEmp.email],
                ["Téléphone",   selectedEmp.telephone],
                ["Date emb.",   selectedEmp.date_embauche],
                ["Salaire",     selectedEmp.salaire ? selectedEmp.salaire + " MAD" : null],
                ["Statut",      selectedEmp.statut],
              ].filter(([, v]) => v).map(([label, val]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "6px 0", fontSize: 13, borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ color: "var(--text-light)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "var(--navy)" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button className="ms-btn-edit red" onClick={() => setSelectedEmp(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projets;