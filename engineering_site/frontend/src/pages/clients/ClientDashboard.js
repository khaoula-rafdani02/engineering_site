import { useEffect, useState } from "react";
import "./ClientDashboard.css";
import logo from "../../assets/logo.png";
export default function ClientDashboard({ user, onLogout }) {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projets");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/mes-projets-client/${user.id_client}`)
      .then((res) => res.json())
      .then((data) => {
        setProjets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const rdvMessages = {
    "En cours":   { titre: "Suivi avancement",      heure: "14:00", statut: "confirme"   },
    "Terminé":    { titre: "Réunion de clôture",    heure: "09:00", statut: "termine"    },
    "Suspendu":   { titre: "Réunion de suspension", heure: "11:00", statut: "annule"     },
    "en_cours":   { titre: "Suivi avancement",      heure: "14:00", statut: "confirme"   },
    "termine":    { titre: "Réunion de clôture",    heure: "09:00", statut: "termine"    },
    "annule":     { titre: "Annulation projet",     heure: "11:00", statut: "annule"     },
    "en_attente": { titre: "Suivi avancement",      heure: "10:00", statut: "en_attente" },
  };

  const buildRdvs = () => {
    const list = [];

    const dateCreation = new Date(user.date_creation);
    dateCreation.setDate(dateCreation.getDate() + 1);
    const dateRdv1 = isNaN(dateCreation) ? "2026-05-01" : dateCreation.toISOString().split("T")[0];

    list.push({
      id: 0,
      titre: "Réunion de lancement",
      description: "Première réunion avec l'entreprise",
      date: dateRdv1,
      heure: "10:00",
      statut: "confirme",
      agent: "PEIC",
    });

    projets.forEach((p, i) => {
      const info = rdvMessages[p.statut] ?? rdvMessages["en_attente"];
      const dateProjet = new Date(p.date_debut);
      const dateRdv = isNaN(dateProjet) ? "2026-05-10" : dateProjet.toISOString().split("T")[0];

      list.push({
        id: i + 1,
        titre: info.titre,
        description: `Projet: ${p.nom_projet ?? p.nom ?? "—"}`,
        date: dateRdv,
        heure: info.heure,
        statut: info.statut,
        agent: p.employe?.nom ?? "PEIC",
      });
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    list.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      const aExp = da < today;
      const bExp = db < today;
      if (aExp && !bExp) return 1;
      if (!aExp && bExp) return -1;
      return da - db;
    });

    return list;
  };

  const rdvs = buildRdvs();

  const stats = {
    total:      projets.length,
    en_cours:   projets.filter((p) => p.statut === "en_cours" || p.statut === "En cours").length,
    termine:    projets.filter((p) => p.statut === "termine"  || p.statut === "Terminé").length,
    en_attente: projets.filter((p) => p.statut === "en_attente").length,
  };

  const getBadgeClass = (statut) => {
    const map = {
      "en_cours":   "cd-badge cd-badge-encours",
      "En cours":   "cd-badge cd-badge-encours",
      "termine":    "cd-badge cd-badge-termine",
      "Terminé":    "cd-badge cd-badge-termine",
      "en_attente": "cd-badge cd-badge-attente",
      "annule":     "cd-badge cd-badge-annule",
      "Suspendu":   "cd-badge cd-badge-suspendu",
      "confirme":   "cd-badge cd-badge-confirme",
    };
    return map[statut] ?? "cd-badge cd-badge-attente";
  };

  const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="cd-root">

      {/* TOPBAR */}
      <nav className="cd-topbar">
        <div className="cd-topbar-left">
          <img src={logo} alt="Logo" style={{ height: 38, width: 38, borderRadius: "50%", objectFit: "cover" }} />
          <span className="cd-brand">
            PRO ETUDES
            <span>INGÉNIERIE &amp; COORDINATION</span>
          </span>
        </div>
        <div className="cd-topbar-right">
          <div className="cd-user-chip">
            <div className="cd-user-av">
              {user?.nom?.slice(0, 1).toUpperCase()}
            </div>
            <span className="cd-user-name">{user?.nom}</span>
          </div>
          <button onClick={onLogout} className="cd-btn-logout">
            Déconnexion
          </button>
        </div>
      </nav>

      {/* PAGE */}
      <div className="cd-page">

        {/* HEADER */}
        <div className="cd-page-header">
          <div>
            <div className="cd-breadcrumb">Tableau de bord › Espace Client</div>
            <h1 className="cd-page-title">Mon Espace</h1>
            <p className="cd-page-subtitle">Bienvenue, {user?.nom} — Voici vos projets et rendez-vous</p>
          </div>
        </div>

        {/* STATS */}
        <div className="cd-stats">
          <div className="cd-stat-card stat-total">
            <span className="cd-stat-val">{stats.total}</span>
            <span className="cd-stat-label">Total Projets</span>
          </div>
          <div className="cd-stat-card stat-encours">
            <span className="cd-stat-val">{stats.en_cours}</span>
            <span className="cd-stat-label">En Cours</span>
          </div>
          <div className="cd-stat-card stat-termine">
            <span className="cd-stat-val">{stats.termine}</span>
            <span className="cd-stat-label">Terminés</span>
          </div>
          <div className="cd-stat-card stat-rdv">
            <span className="cd-stat-val">{rdvs.length}</span>
            <span className="cd-stat-label">Rendez-vous</span>
          </div>
        </div>

        {/* TABS */}
        <div className="cd-tabs">
          {["projets", "rendez-vous"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cd-tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* PROJETS TAB */}
        {activeTab === "projets" && (
          <>
            {loading ? (
              <div className="cd-empty">Chargement...</div>
            ) : projets.length === 0 ? (
              <div className="cd-empty">Aucun projet trouvé</div>
            ) : (
              <div className="cd-card-list">
                {projets.map((p) => (
                  <div key={p.id_projet} className="cd-card">
                    <div className="cd-card-head">
                      <span className="cd-card-title">{p.nom_projet ?? p.nom}</span>
                      <span className={getBadgeClass(p.statut)}>{p.statut}</span>
                    </div>
                    <div className="cd-progress-bar">
                      <div className="cd-progress-fill" style={{ width: `${p.progression ?? 0}%` }} />
                    </div>
                    <div className="cd-card-meta">
                      Début: {p.date_debut} &nbsp;·&nbsp; Fin prévue: {p.date_cloture ?? "—"}
                    </div>
                    {p.description && (
                      <div className="cd-card-meta" style={{ marginTop: 4 }}>{p.description}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* RENDEZ-VOUS TAB */}
        {activeTab === "rendez-vous" && (
          <>
            {rdvs.length === 0 ? (
              <div className="cd-empty">Aucun rendez-vous trouvé</div>
            ) : (
              <div className="cd-card-list">
                {rdvs.map((r) => {
                  const d = new Date(r.date);
                  const expired = d < today;
                  return (
                    <div key={r.id} className={`cd-card ${expired ? "cd-rdv-expired" : "cd-rdv-upcoming"}`} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div className="cd-date-box">
                        <div className="cd-date-day">{d.getDate()}</div>
                        <div className="cd-date-month">{MONTHS[d.getMonth()]}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="cd-card-title">{r.titre}</div>
                        <div className="cd-card-meta">{r.heure} &nbsp;·&nbsp; Agent: {r.agent}</div>
                        <div className="cd-card-meta">{r.description}</div>
                      </div>
                      <span className={getBadgeClass(r.statut)}>{r.statut}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}