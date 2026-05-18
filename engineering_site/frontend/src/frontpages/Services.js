// src/pages/Services.jsx
import React from "react";
import "./Services.css";
import service1 from "../assets/service1.jpg";
import service2 from "../assets/service2.jpg";
import service3 from "../assets/service3.jpg";

const servicesData = [
  {
    id: 1,
    title: "Études Techniques",
    image: service1,
    details: [
      "Analyse complète des besoins du client et contraintes techniques.",
      "Études de faisabilité et modélisation 3D.",
      "Choix des matériaux et solutions durables.",
      "Rapports détaillés et recommandations pour la mise en œuvre."
    ]
  },
  {
    id: 2,
    title: "Coordination de Projets",
    image: service2,
    details: [
      "Planification et organisation des équipes techniques.",
      "Suivi des sous-traitants et gestion des ressources.",
      "Communication et reporting régulier avec le client.",
      "Optimisation des délais et contrôle des coûts."
    ]
  },
  {
    id: 3,
    title: "Suivi & Contrôle",
    image: service3,
    details: [
      "Contrôle qualité des travaux sur site.",
      "Vérification de la conformité aux normes et standards.",
      "Planification des inspections et rapports détaillés.",
      "Assurance que chaque étape respecte les délais et budget."
    ]
  },
];

const Services = () => {
  return (
    <section className="services-section">
      <div className="container">
        <h1 className="section-title">Nos Services</h1>
        <p className="section-intro">
          PRO ETUDES D’INGENIERIE ET DE COORDINATION (PEIC) vous accompagne à chaque étape de vos projets, avec un suivi technique détaillé et rigoureux.
        </p>
        <div className="services-list">
          {servicesData.map((service) => (
            <div className="service-card" key={service.id}>
              <img src={service.image} alt={service.title} className="service-img" />
              <div className="service-text">
                <h2 className="service-title">{service.title}</h2>
                <ul className="service-details">
                  {service.details.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;