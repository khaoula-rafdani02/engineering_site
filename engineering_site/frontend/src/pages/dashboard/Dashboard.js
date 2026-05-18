import "./Dashboard.css";
import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0, projets: 0, employes: 0, messages: 0, suivis: 0,
  });

  const [allProjets, setAllProjets] = useState([]);
  const [suivis, setSuivis] = useState([]);

  const statusLabel = {
    en_cours: "En cours",
    termine: "Terminé",
    en_attente: "En attente",
    en_retard: "En retard",
    suspendu: "Suspendu"
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    const endpoints = ['clients', 'projets', 'employes', 'messages', 'documents', 'suivis'];
    endpoints.forEach(key => {
      fetch(`http://localhost:8000/api/${key}`)
        .then(res => res.json())
        .then(data => {
          const list = data.data ?? data;
          setStats(prev => ({ ...prev, [key]: list.length }));
          if (key === 'projets') setAllProjets(list);
          if (key === 'suivis') setSuivis(list.slice(0, 6)); // khdemna b 6 dyal l-activités
        })
        .catch(err => console.error(`Error fetching ${key}:`, err));
    });
  }, []);

  const chartData = useMemo(() => {
    const counts = {};
    allProjets.forEach(p => {
      const label = statusLabel[p.statut] || p.statut;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, total: counts[key] }));
  }, [allProjets]);

  return (
    <div className="dashboard">
      <div className="dash-section-label">Tableau de bord</div>

      {/* STATS CARDS */}
      <div className="dash-stats">
        {[
          { label: "Clients", val: stats.clients, icon: "◎", c: "c1" },
          { label: "Projets", val: stats.projets, icon: "▣", c: "c2" },
          { label: "Employés", val: stats.employes, icon: "◈", c: "c3" },
          { label: "Messages", val: stats.messages, icon: "✉", c: "c4" },
          { label: "Suivis", val: stats.suivis, icon: "◉", c: "c6" },
        ].map(card => (
          <div className={`dash-card ${card.c}`} key={card.label}>
            <div className="dash-card-bg-icon">{card.icon}</div>
            <div className="dash-card-label">{card.label}</div>
            <div className="dash-card-num">{card.val}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid-main">
        {/* CHART SECTION */}
        <div className="dash-chart-section">
          <div className="dash-table-title">Analyse des Projets par Statut</div>
          <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total" barSize={40} radius={[6, 6, 0, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TIMELINE ACTIVITY SECTION */}
        <div className="dash-activity-section">
          <div className="dash-table-title">Activités Récentes</div>
          <div className="timeline">
            {suivis.map((s, index) => (
              <div className="timeline-item" key={index}>
                <div className={`timeline-dot ${s.statut}`}></div>
                <div className="timeline-content">
                  <p className="timeline-text">
                    Mise à jour sur le projet <strong>#{s.id_projet}</strong>
                  </p>
                  <span className="timeline-time">{s.date_suivi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;