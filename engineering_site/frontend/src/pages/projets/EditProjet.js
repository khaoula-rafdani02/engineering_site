import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditProjet() {
  const { id } = useParams();
  const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));

  const [nom_projet, setNomProjet] = useState("");
  const [description, setDescription] = useState("");
  const [date_debut, setDateDebut] = useState("");
  const [date_cloture, setDateCloture] = useState("");
  const [maitre_ouvrage, setMaitreOuvrage] = useState("");
  const [indemnite, setIndemnite] = useState("");
  const [id_client, setIdClient] = useState("");
  const [id_employe, setIdEmploye] = useState("");
  const [statut, setStatut] = useState("");
  const [localisation, setLocalisation] = useState("");

  const [clients, setClients] = useState([]);    // ← جديد
  const [employes, setEmployes] = useState([]);  // ← جديد

  useEffect(() => {
    // جيب données du projet
    fetch(`http://127.0.0.1:8000/api/projets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNomProjet(data.nom_projet);
        setDescription(data.description);
        setDateDebut(data.date_debut);
        setDateCloture(data.date_cloture);
        setMaitreOuvrage(data.maitre_ouvrage);
        setIndemnite(data.indemnite);
        setIdClient(data.id_client);
        setIdEmploye(data.id_employe);
        setStatut(data.statut);
        setLocalisation(data.localisation ?? "");
      });

    // جيب clients و employes
    fetch("http://127.0.0.1:8000/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));

    fetch("http://127.0.0.1:8000/api/employes")
      .then((res) => res.json())
      .then((data) => setEmployes(data));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/projets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom_projet,
        description,
        date_debut,
        date_cloture,
        maitre_ouvrage,
        indemnite: parseFloat(indemnite) || 0,
        id_client,
        id_employe,
        statut,
        localisation,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Projet modifié avec succès");
        navigate(user?.role === "Administrateur" ? "/projets" : "/mes-projets");
        console.log("USER ROLE:", user?.role);
      })
      .catch((error) => {
        console.log(error);
        alert("Erreur de connexion avec le serveur");
      });
  };

  return (
    <div className="container mt-5">
      <h2>Modifier Projet</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nom Projet</label>
          <input
            type="text"
            className="form-control"
            value={nom_projet}
            onChange={(e) => setNomProjet(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Date Début</label>
          <input
            type="date"
            className="form-control"
            value={date_debut}
            min="2000-01-01"
            max="2100-12-31"
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Date Clôture</label>
          <input
            type="date"
            className="form-control"
            value={date_cloture}
            min="2000-01-01"
            max="2100-12-31"
            onChange={(e) => setDateCloture(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Maitre Ouvrage</label>
          <input
            type="text"
            className="form-control"
            value={maitre_ouvrage}
            onChange={(e) => setMaitreOuvrage(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Indemnité</label>
          <input
            type="number"
            className="form-control"
            value={indemnite}
            onChange={(e) => setIndemnite(e.target.value)}
          />
        </div>

        {/* ← Select Client */}
        <div className="mb-3">
          <label>Client</label>
          <select
            className="form-control"
            value={id_client}
            onChange={(e) => setIdClient(e.target.value)}
          >
            <option value="">Choisir Client</option>
            {clients.map((c) => (
              <option key={c.id_client} value={c.id_client}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* ← Select Employé */}
        <div className="mb-3">
          <label>Employé</label>
          <select
            className="form-control"
            value={id_employe}
            onChange={(e) => setIdEmploye(e.target.value)}
          >
            <option value="">Choisir Employé</option>
            {employes.map((e) => (
              <option key={e.id_employe} value={e.id_employe}>
                {e.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Statut</label>
          <select
            className="form-control"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="">Choisir</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Localisation</label>
          <input
            type="text"
            className="form-control"
            value={localisation}
            placeholder="ex: Marrakech, Rue..."
            onChange={(e) => setLocalisation(e.target.value)}
          />
        </div>

        <button className="btn btn-success">Modifier Projet</button>
      </form>
    </div>
  );
}

export default EditProjet;