import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

function CreateClient() {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [date_creation, setDateCreation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    apiFetch("clients", {
      method: "POST",
      body: JSON.stringify({ nom, email, telephone, mot_de_passe, date_creation })
    })
      .then(res => res.json())
      .then(() => {
        alert("✅ Client ajouté avec succès");
        navigate("/clients");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">➕ Ajouter un Client</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez le nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Numéro de téléphone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={mot_de_passe}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date de création</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date_creation}
                    onChange={(e) => setDateCreation(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">💾 Ajouter</button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/clients")}
                  >
                    ❌ Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClient;