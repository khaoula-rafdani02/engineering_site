// src/pages/ProjetsPublic.jsx
import React from "react";
import projet1 from "../assets/projet1.jpg";
import projet2 from "../assets/projet2.jpg";
import projet3 from "../assets/projet3.jpg";
import "./ProjetsPublic.css";

const projetsData = [
  {
    id: 1,
    titre: "Projet A",
    image: projet1,
    description: [
      "Le Projet A consiste en la conception et la réalisation d’un bâtiment commercial moderne.",
      "Ce projet a été divisé en plusieurs phases clés :",
      "Étude préliminaire : analyse des besoins du client, étude du site et faisabilité technique.",
      "Conception architecturale : élaboration des plans détaillés, choix des matériaux écologiques et optimisation de l'espace.",
      "Ingénierie structurelle : calculs des fondations, charpente et éléments porteurs pour garantir sécurité et durabilité.",
    ],
  },
  {
    id: 2,
    titre: "Projet B",
    image: projet2,
    description: [
      "Le Projet B concerne le suivi et la coordination d’un projet industriel complexe.",
      "Les étapes détaillées comprennent :",
      "Planification initiale : définition du calendrier, allocation des ressources humaines et matérielles.",
      "Coordination des équipes : organisation des sous-traitants, suivi des différentes équipes techniques et reporting régulier.",
    ],
  },
  {
    id: 3,
    titre: "Projet C",
    image: projet3,
    description: [
      "Le Projet C est une étude et planification complète d’un réseau électrique.",
      "Le projet a été réalisé en plusieurs étapes :",
      "Analyse de faisabilité : évaluation du site, analyse des besoins énergétiques et contraintes locales.",
      "Conception technique : planification des lignes, choix des équipements, calcul des charges et optimisation énergétique.",
      "Conformité réglementaire : respect des normes locales et internationales pour les réseaux électriques.",
    ],
  },
];

const ProjetsPublic = () => {
  return (
    <div className="projets-public">
      <h1>Nos Projets</h1>
      <p className="intro">
        Découvrez nos projets détaillés avec toutes les étapes et explications techniques. Chaque projet est présenté avec ses phases clés et ses résultats.
      </p>

      <div className="projets-list">
        {projetsData.map((projet) => (
          <div key={projet.id} className="projet-card">
            <img src={projet.image} alt={projet.titre} />
            <div className="projet-text">
              <h2>{projet.titre}</h2>
              <ul className="projet-details">
                {projet.description.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjetsPublic;