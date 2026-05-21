import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const clientId = localStorage.getItem("client_id");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, id_client: clientId }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Message envoyé avec succès !" });
        setForm({ nom: "", email: "", message: "" });
      } else if (data.errors) {
        const errors = Object.values(data.errors).flat().join(" | ");
        setStatus({ type: "error", message: "Erreur : " + errors });
      } else {
        setStatus({ type: "error", message: "Erreur lors de l'envoi du message" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Erreur lors de l'envoi du message" });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-wrapper">

        {/* FORMULAIRE */}
        <div className="contact-card">
          <h2>Contactez-nous</h2>

          {status && (
            <div className={`status-box ${status.type}`}>{status.message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Votre message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />
            <button type="submit">Envoyer</button>
          </form>

          <div className="contact-inscription">
            <p>Vous n'avez pas encore de compte ?</p>
            <button
              className="btn-inscription"
              onClick={() => navigate("/inscription")}
            >
              S'inscrire maintenant
            </button>
          </div>
        </div>

        {/* CARTE — Avenue Allal Al Fassi, Marrakech */}
        <div className="contact-map">
          <h3>Notre localisation</h3>
          <p className="map-adresse">📍 Avenue Allal Al Fassi N°26, Bureau 37, Marrakech, Maroc</p>
          <iframe
            title="Avenue Allal Al Fassi Marrakech"
            src="https://www.google.com/maps?q=Avenue+Allal+Al+Fassi+26+Marrakech+Maroc&z=16&output=embed"
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
}