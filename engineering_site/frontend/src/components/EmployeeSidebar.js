import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./EmployeeSidebar.css";

function EmployeeSidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const initials = user?.nom_employe
    ? user.nom_employe.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "EM";

 const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};

  const today = new Date().toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="emp-sidebar">
      <div className="emp-sidebar-header">
        <div className="emp-sidebar-avatar">{initials}</div>
        <div className="emp-sidebar-name">{user?.nom_employe || "Employé"}</div>
        <div className="emp-sidebar-role">{user?.role || "Utilisateur"}</div>
      </div>

      <nav className="emp-sidebar-nav">
        <div className="emp-sidebar-nav-label">Menu</div>

        <NavLink
          to="/mes-projets"
          className={({ isActive }) =>
            "emp-sidebar-nav-item" + (isActive ? " active" : "")
          }
        >
          <span className="emp-sidebar-nav-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
            </svg>
          </span>
          Mes Projets
        </NavLink>

    <NavLink
  to="/mes-suivi"
  className={({ isActive }) =>
    "emp-sidebar-nav-item" + (isActive ? " active" : "")
  }
>
  <span className="emp-sidebar-nav-icon">
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  </span>
  Suivi
</NavLink>
      </nav>

      <div className="emp-sidebar-footer">
        <div className="emp-sidebar-date">{today}</div>
        <button className="emp-sidebar-logout" onClick={handleLogout}>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default EmployeeSidebar;