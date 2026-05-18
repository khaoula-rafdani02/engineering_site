import React from "react";
import "./Apropos.css";
import photo1 from "../assets/apropos1.jpg"; // première photo
import photo2 from "../assets/apropos2.jpg"; // deuxième photo

export default function Apropos() {
  return (
    <div className="apropos-page">

      {/* HEADER */}
      <header className="apropos-header">
        <h1>À propos de PRO ETUDES D’INGENIERIE ET DE COORDINATION</h1>
        <p>
          Société spécialisée dans l’ingénierie et le management de projets, utilisant des méthodes et logiciels professionnels pour concrétiser vos projets.
        </p>
      </header>

      {/* SECTION MISSION */}
      <section className="apropos-intro card">
        <h2>Notre Mission</h2>
        <p>
          Chez <strong>PRO ETUDES D’INGENIERIE ET DE COORDINATION</strong>, nous nous engageons à offrir des solutions complètes pour la conception et la gestion des projets de construction et d’ingénierie. 
          Notre approche allie innovation, expertise technique et rigueur à chaque étape.
        </p>
      </section>

      {/* SECTION LOGICIELS */}
      <section className="apropos-logiciels card">
        <h2>Logiciels et Outils</h2>
        <ul>
          <li><strong>AutoCAD :</strong> Modélisation 2D/3D précise pour vos projets</li>
          <li><strong>Revit :</strong> Conception BIM pour planification avancée</li>
          <li><strong>Robot :</strong> Simulation et calcul des structures</li>
          <li><strong>MS Project :</strong> Gestion et suivi de planning</li>
        </ul>
      </section>

      {/* SECTION PROJETS / PHOTOS */}
      <section className="apropos-projets card">
        <h2>Projets et Réalisations</h2>
        <p>
          Nos réalisations couvrent divers domaines du bâtiment et de l’ingénierie. Chaque projet est mené avec précision, depuis l’étude jusqu’à l’exécution.
        </p>
        <div className="apropos-images">
          <img src={photo1} alt="Projet 1" />
          <img src={photo2} alt="Projet 2" />
        </div>
      </section>

      {/* SECTION STAGE */}
      <section className="apropos-stage card">
        <h2>Mon Stage au sein de l’entreprise</h2>
        <ul>
          <li>Participer à la modélisation et calcul des structures</li>
          <li>Gérer et suivre les projets de construction</li>
          <li>Utiliser AutoCAD, Revit et Robot dans un contexte réel</li>
        </ul>
        <p>
          Cette expérience m’a permis d’acquérir un savoir-faire concret et une compréhension professionnelle des projets d’ingénierie.
        </p>
      </section>

      {/* SECTION ENTREPRISE */}
      <section className="apropos-entreprise card">
        <h2>Présentation de l’entreprise</h2>
        <p>
          <strong>PRO ETUDES D’INGENIERIE ET DE COORDINATION</strong> met la technologie au service de l’ingénierie et de la construction, combinant expertise technique, outils avancés et créativité pour chaque projet.
        </p>
      </section>

      {/* SECTION CONTACT */}
      <section className="apropos-contact card">
        <h2>Pourquoi Nous Choisir</h2>
        <p>
          Nous garantissons qualité, précision et satisfaction client. Chaque projet est conduit avec professionnalisme, rigueur et respect des délais.
        </p>
      </section>

    </div>
  );
}