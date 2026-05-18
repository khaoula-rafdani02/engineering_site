import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Inscription.css";

function Inscription() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    mot_de_passe_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setErrors({});

    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
          setForm({
            nom: "",
            email: "",
            telephone: "",
            mot_de_passe: "",
            mot_de_passe_confirmation: "",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="inscription">
      <div className="inscription-card">

        {/* HEADER */}
        <div className="inscription-header">
          <h2>Créer un compte</h2>
        
        </div>

        {/* BODY */}
        <div className="inscription-body">

          {success && <div className="inscription-success">{success}</div>}

          <form onSubmit={handleSubmit}>

            <div className="inscription-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="nom"
                className={errors.nom ? "is-invalid" : ""}
                placeholder="Entrez votre nom"
                value={form.nom}
                onChange={handleChange}
                required
              />
              {errors.nom && <p className="invalid-msg">{errors.nom[0]}</p>}
            </div>

            <div className="inscription-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={errors.email ? "is-invalid" : ""}
                placeholder="exemple@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="invalid-msg">{errors.email[0]}</p>}
            </div>

            <div className="inscription-group">
              <label>Téléphone</label>
              <input
                type="text"
                name="telephone"
                className={errors.telephone ? "is-invalid" : ""}
                placeholder="0612345678"
                value={form.telephone}
                onChange={handleChange}
              />
              {errors.telephone && <p className="invalid-msg">{errors.telephone[0]}</p>}
            </div>

            <div className="inscription-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                className={errors.mot_de_passe ? "is-invalid" : ""}
                placeholder="••••••••"
                value={form.mot_de_passe}
                onChange={handleChange}
                required
              />
              {errors.mot_de_passe && <p className="invalid-msg">{errors.mot_de_passe[0]}</p>}
            </div>

            <div className="inscription-group">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                name="mot_de_passe_confirmation"
                placeholder="••••••••"
                value={form.mot_de_passe_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="inscription-actions">
              <button type="submit" className="voir-plus-btn" disabled={loading}>
                {loading ? "Inscription..." : "S'inscrire"}
              </button>
              <button
                type="button"
                className="btn-annuler"
                onClick={() => navigate("/")}
              >
                 Annuler
              </button>
            </div>

          </form>

          <div className="inscription-login">
            Vous avez déjà un compte ?{" "}
            <Link to="/connexion">Connectez-vous</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Inscription;