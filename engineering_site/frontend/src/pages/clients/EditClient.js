import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [date_creation, setDateCreation] = useState("");

  useEffect(() => {
    apiFetch(`clients/${id}`)
      .then(res => res.json())
      .then(data => {
        setNom(data.nom);
        setEmail(data.email);
        setTelephone(data.telephone || "");
        if (data.date_creation) {
          const date = new Date(data.date_creation);
          setDateCreation(date.toISOString().split('T')[0]);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = { nom, email, telephone, date_creation };
    if (mot_de_passe) dataToSend.mot_de_passe = mot_de_passe;

    apiFetch(`clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(dataToSend)
    })
      .then(() => {
        alert("✏️ Client modifié avec succès");
        navigate("/clients");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0">✏️ Modifier le Client</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom complet</label>
                  <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-control" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Nouveau mot de passe
                    <small className="text-muted ms-2">(laisser vide pour garder l'ancien)</small>
                  </label>
                  <input type="password" className="form-control" placeholder="Nouveau mot de passe" value={mot_de_passe} onChange={(e) => setMotDePasse(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date de création</label>
                  <input type="date" className="form-control" value={date_creation} onChange={(e) => setDateCreation(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary"> Modifier</button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/clients")}>❌ Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditClient;