import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

      
        <div className="footer-col">
          <div className="footer-logo">
            <span className="footer-logo-main">PRO ETUDES D'INGENIERIE ET DE COORDINATION</span>
            
          </div>
          <p className="desc">
            Bureau d'études spécialisé dans l'ingénierie, la conception
            et la coordination des projets de bâtiment.
          </p>
          <div className="footer-contact-info">
            <div className="footer-contact-item">
              <span className="footer-icon">📞</span>
              <span>0661092790</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">✉️</span>
              <span>proetudes.bet@gmail.com</span>

            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">📍</span>
              <span> Avenue allal alfassi 26 bureau N°37 Marrakech</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Liens rapides</h4>
          <ul className="footer-list">
            <li><span className="footer-dot">▸</span><Link to="/">Accueil</Link></li>
            <li><span className="footer-dot">▸</span><Link to="/services">Services</Link></li>
            <li><span className="footer-dot">▸</span><Link to="/ProjetsPublic">Projets</Link></li>
            <li><span className="footer-dot">▸</span><Link to="/apropos">À propos</Link></li>
            <li><span className="footer-dot">▸</span><Link to="/contact">Contact</Link></li>
            <li><span className="footer-dot">▸</span><Link to="/inscription">Inscription</Link></li>
          </ul>
        </div>

        
        <div className="footer-col">
          <h4 className="footer-title">Logiciels utilisés</h4>
          <div className="footer-badges">
            <span className="footer-badge">AutoCAD</span>
            <span className="footer-badge">Revit</span>
            <span className="footer-badge">Robot</span>
            <span className="footer-badge">Bâtir</span>
          </div>

          <h4 className="footer-title" style={{ marginTop: "20px" }}>Suivez-nous</h4>
          <div className="socials">
            <a href="#" className="social-btn" aria-label="Facebook">f</a>
            <a href="#" className="social-btn" aria-label="LinkedIn">in</a>
            <a href="#" className="social-btn" aria-label="Instagram">ig</a>
          </div>
        </div>

      </div>

    
      <div className="footer-bottom">
        <div className="footer-links">
          <Link to="#">Mentions légales</Link>
          <span className="footer-sep">|</span>
          <Link to="#">Politique de confidentialité</Link>
          <span className="footer-sep">|</span>
          <Link to="/contact">Contact</Link>
        </div>
        <p className="footer-copy">© 2026 HME PRO — Tous droits réservés</p>
      </div>
    </footer>
  );
}

export default Footer;