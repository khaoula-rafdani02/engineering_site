import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

function CreateProjet() {
  const [nom_projet, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_cloture, setDateCloture] = useState("");
  const [maitre_ouvrage, setMaitre] = useState("");
  const [indemnite, setIndemnite] = useState("");
  const [id_client, setClient] = useState("");
  const [id_employe, setEmploye] = useState("");
  const [statut, setStatut] = useState("En cours");
  const [localisation, setLocalisation] = useState("");
  const [clients, setClients] = useState([]);
  const [employes, setEmployes] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    apiFetch("clients").then(res => res.json()).then(data => setClients(data));
    apiFetch("employes").then(res => res.json()).then(data => setEmployes(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    apiFetch("projets", {
      method: "POST",
      body: JSON.stringify({
        nom_projet, description, date_debut, date_cloture,
        maitre_ouvrage, indemnite: parseFloat(indemnite) || 0,
        id_client, id_employe, statut, localisation,
      }),
    })
      .then(res => res.json())
      .then(() => {
        alert("Projet ajouté");
        navigate(user?.role === "Administrateur" ? "/projets" : "/mes-projets");
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-5">
      <h2>Ajouter Projet</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" placeholder="Nom Projet" onChange={(e) => setNom(e.target.value)} />
        <textarea className="form-control mb-3" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <label>Date Début</label>
        <input type="date" className="form-control mb-3" onChange={(e) => setDateDebut(e.target.value)} />
        <label>Date Clôture</label>
        <input type="date" className="form-control mb-3" onChange={(e) => setDateCloture(e.target.value)} />
        <input className="form-control mb-3" placeholder="Maitre d'ouvrage" onChange={(e) => setMaitre(e.target.value)} />
        <input type="number" className="form-control mb-3" placeholder="Indemnité" onChange={(e) => setIndemnite(e.target.value)} />

        <select className="form-control mb-3" value={id_client} onChange={(e) => setClient(e.target.value)}>
          <option value="">Choisir Client</option>
          {clients.map((c) => (
            <option key={c.id_client} value={c.id_client}>{c.nom}</option>
          ))}
        </select>

        <select className="form-control mb-3" value={id_employe} onChange={(e) => setEmploye(e.target.value)}>
          <option value="">Choisir Employé</option>
          {employes.map((e) => (
            <option key={e.id_employe} value={e.id_employe}>{e.nom}</option>
          ))}
        </select>

        <input className="form-control mb-3" placeholder="Localisation" onChange={(e) => setLocalisation(e.target.value)} />

        <select className="form-control mb-3" value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="Suspendu">Suspendu</option>
        </select>

        <button className="btn btn-success">Enregistrer</button>
      </form>
    </div>
  );
}

export default CreateProjet;