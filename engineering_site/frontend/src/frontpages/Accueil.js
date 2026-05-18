import React from "react";
import { useNavigate } from "react-router-dom";
import "./Accueil.css";
import "./Temoignages.css";
import hero from "../assets/hero.png";
import presentation from "../assets/presentation.jpg";
import service1 from "../assets/service1.jpg";
import service2 from "../assets/service2.jpg";
import service3 from "../assets/service3.jpg";
import projet1 from "../assets/projet1.jpg";
import projet2 from "../assets/projet2.jpg";
import projet3 from "../assets/projet3.jpg";

const servicesData = [
  { id: 1, title: "Études Techniques", image: service1 },
  { id: 2, title: "Suivi & Contrôle", image: service2 },
  { id: 3, title: "Coordination de Projet", image: service3 },
];

const projetsData = [
  { id: 1, title: "Projet A", image: projet1 },
  { id: 2, title: "Projet B", image: projet2 },
  { id: 3, title: "Projet C", image: projet3 },
];

function Accueil() {
  const navigate = useNavigate();

  const handleVoirPlus = (type) => {
    if (type === "service") navigate("/services");
    else if (type === "projet") navigate("/ProjetsPublic");
  };

  const scrollToPresentation = () => {
    document.querySelector(".presentation").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="accueil">

      {/* HERO SECTION */}
      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="hero-overlay">
          <h1>PRO ETUDES D'INGENIERIE ET DE COORDINATION</h1>
          <p>
            Bureau d'études spécialisé dans l'ingénierie,
            la coordination et la gestion des projets techniques.
          </p>
          <button className="hero-btn" onClick={scrollToPresentation}>
            Découvrir ↓
          </button>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="presentation">
        <div className="presentation-image">
          <img src={presentation} alt="presentation" />
        </div>
        <div className="presentation-text">
          <h2>Qui sommes-nous ?</h2>
          <p>
            PEIC est un bureau d'études spécialisé dans les
            projets d'ingénierie et la coordination technique.
            Nous accompagnons les entreprises dans la conception,
            la planification et le suivi de leurs projets.
          </p>
          <p>
            Notre objectif est d'assurer une gestion efficace
            des projets tout en garantissant qualité et performance.
          </p>
          <button className="voir-plus-btn" onClick={() => navigate("/apropos")}>
            En savoir plus →
          </button>
        </div>
      </section>
   
{/* TEMOIGNAGES */}
<section className="temoignages-section">
  <h2 className="accueil-subtitle">Ce que disent nos clients</h2>
  <div className="temoignages-grid">
    {[
      {
        initials: "MA",
        nom: "Mohammed Alami",
        poste: "Directeur de projet",
        text: "Une équipe très professionnelle. Le suivi de notre chantier était impeccable, avec des rapports clairs et ponctuels.",
        stars: 5
      },
      {
        initials: "SF",
        nom: "Sara Fassi",
        poste: "Promoteur immobilier",
        text: "PEIC nous a accompagnés de A à Z dans notre projet de construction. Sérieux, compétents et toujours disponibles.",
        stars: 5
      },
      {
        initials: "KR",
        nom: "Karim Raji",
        poste: "Chef d'entreprise",
        text: "Grâce à leur expertise en coordination, nous avons pu livrer notre projet dans les délais. Je recommande vivement.",
        stars: 4
      }
    ].map((t, i) => (
      <div key={i} className="temoignage-card">
        <div className="temoignage-quote">"</div>
        <div className="temoignage-stars">
          {"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}
        </div>
        <p className="temoignage-text">{t.text}</p>
        <div className="temoignage-footer">
          <div className="temoignage-avatar">{t.initials}</div>
          <div className="temoignage-info">
            <strong>{t.nom}</strong>
            <span>{t.poste}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* SERVICES */}
      <section className="accueil-section">
        <h2 className="accueil-subtitle">Nos Services</h2>
        <div className="accueil-grid">
          {servicesData.map((service) => (
            <div key={service.id} className="accueil-card">
              <img src={service.image} alt={service.title} />
              <h3>{service.title}</h3>
              <button
                className="voir-plus-btn"
                onClick={() => handleVoirPlus("service")}
              >
                Voir Plus
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROJETS */}
      <section className="accueil-section">
        <h2 className="accueil-subtitle">Nos Projets</h2>
        <div className="accueil-grid">
          {projetsData.map((projet) => (
            <div key={projet.id} className="accueil-card">
              <img src={projet.image} alt={projet.title} />
              <h3>{projet.title}</h3>
              <button
                className="voir-plus-btn"
                onClick={() => handleVoirPlus("projet")}
              >
                Voir Plus
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Accueil;