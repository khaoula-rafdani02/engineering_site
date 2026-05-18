import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./BackLayout.css";
import logo from "../assets/logo.png";

function BackLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const userObj = parsedData.user || parsedData;
        setAdminName(userObj.nom || userObj.name || "Admin");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
};
  const firstLetter = adminName.charAt(0).toUpperCase();

  
  const IconWrapper = ({ type }) => {
    const icons = {
      dashboard: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        </svg>
      ),
      projets: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h4.75a.75.75 0 0 1 .53.22L10.03 4.5H12.5A1.5 1.5 0 0 1 14 6v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-8Z" fill="currentColor" opacity=".7"/>
        </svg>
      ),
      suivi: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h5A1.5 1.5 0 0 1 12 3.5v9A1.5 1.5 0 0 1 10.5 14h-5A1.5 1.5 0 0 1 4 12.5v-9ZM5.5 5h5v1h-5V5Zm0 3h5v1h-5V8Zm0 3h3v1h-3v-1Z" fill="currentColor" opacity=".7"/>
        </svg>
      ),
      clients: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2.5 1H5.5A2.5 2.5 0 0 0 3 11.5V13h10v-1.5A2.5 2.5 0 0 0 10.5 9Z" fill="currentColor" opacity=".7"/>
        </svg>
      ),
      employes: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm5.5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2 13v-1.5A2.5 2.5 0 0 1 4.5 9h4A2.5 2.5 0 0 1 11 11.5V13H2Zm9.5-3h1A2.5 2.5 0 0 1 15 12.5V13h-3v-1.5a3.5 3.5 0 0 0-.5-1.5Z" fill="currentColor" opacity=".7"/>
        </svg>
      ),
      messages: (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h7A2.5 2.5 0 0 1 14 4.5v5a2.5 2.5 0 0 1-2.5 2.5H8.6l-2.9 2.2c-.5.4-1.2.1-1.2-.5v-1.7H4.5A2.5 2.5 0 0 1 2 9.5v-5Z" fill="currentColor" opacity=".7"/>
        </svg>
      )
    };
    return <span className="emp-sidebar-nav-icon">{icons[type]}</span>;
  };

  return (
    <div className="back-layout">
    
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="avatar-em">{firstLetter}</div>
          <div className="sidebar-user-info">
            {isOpen && (
              <>
                <h3>{adminName}</h3>
                <p>Administrateur</p>
              </>
            )}
          </div>
        </div>

        <nav className="menu-nav">
          <span className="menu-title">{isOpen && "MENU"}</span>
          
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="dashboard" /> {isOpen && "Dashboard"}
          </NavLink>
          
          <NavLink to="/projets" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="projets" /> {isOpen && "Projets"}
          </NavLink>
          
          <NavLink to="/suivi" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="suivi" /> {isOpen && "Suivi"}
          </NavLink>
          
          <NavLink to="/clients" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="clients" /> {isOpen && "Clients"}
          </NavLink>
          
          <NavLink to="/employes" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="employes" /> {isOpen && "Employés"}
          </NavLink>
          
          <NavLink to="/messages" className={({ isActive }) => (isActive ? "link active" : "link")}>
            <IconWrapper type="messages" /> {isOpen && "Messages"}
          </NavLink>
          
          <button className="logout-button" onClick={handleLogout}>
            <span className="emp-sidebar-nav-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3v1h2.5v8H10v1h3.5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H10ZM6.1 5.1 3.2 8l2.9 2.9.7-.7-2.1-2.2H10V7H4.7l2.1-2.2-.7-.7Z" fill="currentColor"/>
              </svg>
            </span>
            {isOpen && "Logout"}
          </button>
        </nav>
      </aside>

      
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <button className="burger-menu" onClick={toggleSidebar}>☰</button>
            <div className="brand-logo-area">
              <img src={logo} alt="logo" />
              <div className="brand-text">
                <span className="main-name">PRO ETUDES</span>
                <span className="sub-name">INGÉNIERIE & COORDINATION</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="user-pill">
              <div className="initial-dot">{firstLetter}</div>
              <span className="user-name">{adminName}</span>
            </div>
          </div>
        </header>

        <main className="content-view">
          {children}
        </main>
      </div>
    </div>
  );
}

export default BackLayout;