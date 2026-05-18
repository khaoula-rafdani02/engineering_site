import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {

  const admin = localStorage.getItem("admin");

  return (
    <nav className="navbar">

      <div className="logoBox">
        <img src={logo} alt="logo"/>
        <span className="companyName">PEIC</span>
      </div>

      <ul className="nav-menu">

        <li><Link to="/">Accueil</Link></li>

       

        <li><Link to="/services">Services</Link></li>

        <li><Link to="/ProjetsPublic">Projets</Link></li>
        
         <li><Link to="/apropos">A propos</Link></li>

        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/inscription">Inscription</Link></li>
        


        <li>
          {admin ? (
            <Link to="/dashboard">Dashboard
            </Link>
          ) : (
            <Link to="/login">Connexion</Link>
          )}
        </li>

      </ul>

    </nav>
  );
}