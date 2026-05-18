import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSuivi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({
    id_projet: "",
    id_employe: "",
    localisation: "",
    statut: "En cours",
    commentaire: "",
  });
  const [newPhotos, setNewPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "Administrateur";
  const isEmployee = user?.role === "Employé";

  useEffect(() => {
    if (!isAdmin && !isEmployee) {
      navigate("/");
      return;
    }

    fetch("http://127.0.0.1:8000/api/projets")
      .then(res => res.json())
      .then(data => setProjets(Array.isArray(data) ? data : []));

    if (isAdmin) {
      fetch("http://127.0.0.1:8000/api/employes")
        .then(res => res.json())
        .then(data => setEmployes(Array.isArray(data) ? data : []));
    }

    fetch(`http://127.0.0.1:8000/api/suivis/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          id_projet: data.id_projet || "",
          id_employe: data.id_employe || "",
          localisation: data.localisation || "",
          statut: data.statut || "En cours",
          commentaire: data.commentaire || "",
        });
        setExistingPhotos(data.photos || []);
      });
  }, [id]);

  const handlePhotoChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewPhotos(prev => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingPhoto = (photo) => {
    setExistingPhotos(prev => prev.filter(p => p !== photo));
    setDeletedPhotos(prev => [...prev, photo]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("_method", "PUT");
    Object.keys(form).forEach(k => data.append(k, form[k]));
    newPhotos.forEach(p => data.append("photos[]", p.file));
    deletedPhotos.forEach(p => data.append("deleted_photos[]", p));

    fetch(`http://127.0.0.1:8000/api/suivis/${id}`, {
      method: "POST",
      body: data
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
        return res.json();
      })
      .then(() => {
        if (isAdmin) navigate("/suivi");
        else navigate("/mes-suivi");
      })
      .catch(err => {
        console.error(err);
        alert("Erreur : " + err.message);
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
      <h2>Modifier Suivi</h2>
      <form onSubmit={handleSubmit}>

        {/* Projet */}
        <div style={{ marginBottom: "16px" }}>
          <label>Projet</label><br />
          <select style={{ width: "100%", padding: "8px" }}
            value={form.id_projet}
            onChange={e => setForm({ ...form, id_projet: e.target.value })} required>
            <option value="">-- Choisir --</option>
            {projets.map(p => (
              <option key={p.id_projet} value={p.id_projet}>{p.nom_projet}</option>
            ))}
          </select>
        </div>

        {/* Employé — Admin فقط */}
        {isAdmin && (
          <div style={{ marginBottom: "16px" }}>
            <label>Employé</label><br />
            <select style={{ width: "100%", padding: "8px" }}
              value={form.id_employe}
              onChange={e => setForm({ ...form, id_employe: e.target.value })} required>
              <option value="">-- Choisir --</option>
              {employes.map(e => (
                <option key={e.id_employe} value={e.id_employe}>{e.nom}</option>
              ))}
            </select>
          </div>
        )}

        {/* Localisation */}
        <div style={{ marginBottom: "16px" }}>
          <label>Localisation</label><br />
          <input style={{ width: "100%", padding: "8px" }} type="text"
            value={form.localisation}
            onChange={e => setForm({ ...form, localisation: e.target.value })} />
        </div>

        {/* Statut */}
        <div style={{ marginBottom: "16px" }}>
          <label>Statut</label><br />
          <select style={{ width: "100%", padding: "8px" }}
            value={form.statut}
            onChange={e => setForm({ ...form, statut: e.target.value })}>
            <option>En cours</option>
            <option>Terminé</option>
            <option>Suspendu</option>
          </select>
        </div>

        {/* Commentaire */}
        <div style={{ marginBottom: "16px" }}>
          <label>Commentaire</label><br />
          <textarea style={{ width: "100%", padding: "8px" }} rows="3"
            value={form.commentaire}
            onChange={e => setForm({ ...form, commentaire: e.target.value })} />
        </div>

        {/* الصور الموجودة */}
        {existingPhotos.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
              Photos existantes
              <span style={{
                marginLeft: "10px", fontSize: "12px", fontWeight: 400,
                background: "#eff6ff", color: "#1d4ed8",
                padding: "2px 10px", borderRadius: "20px", border: "1px solid #93c5fd"
              }}>
                {existingPhotos.length} photo{existingPhotos.length > 1 ? "s" : ""}
              </span>
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px", padding: "12px",
              background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0"
            }}>
              {existingPhotos.map((photo, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={`http://127.0.0.1:8000/api/photos/${photo}`}
                    alt={`photo ${i + 1}`}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0", display: "block" }}
                  />
                  <button type="button" onClick={() => removeExistingPhoto(photo)}
                    style={{
                      position: "absolute", top: "4px", right: "4px",
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "#ef4444", color: "white", border: "none",
                      cursor: "pointer", fontSize: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,.3)"
                    }}>✕</button>
                  <div style={{
                    position: "absolute", bottom: "4px", left: "4px",
                    background: "rgba(0,0,0,.45)", color: "#fff",
                    fontSize: "10px", padding: "1px 6px", borderRadius: "10px"
                  }}>{i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* صور جديدة */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Ajouter nouvelles photos
            {newPhotos.length > 0 && (
              <span style={{
                marginLeft: "10px", fontSize: "12px", fontWeight: 400,
                background: "#f0fdf4", color: "#16a34a",
                padding: "2px 10px", borderRadius: "20px", border: "1px solid #86efac"
              }}>
                {newPhotos.length} nouvelle{newPhotos.length > 1 ? "s" : ""}
              </span>
            )}
          </label>

          {newPhotos.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px", marginBottom: "12px", padding: "12px",
              background: "#f0fdf4", borderRadius: "10px", border: "1px solid #86efac"
            }}>
              {newPhotos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p.preview} alt={`nouvelle ${i + 1}`}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "1px solid #86efac", display: "block" }}
                  />
                  <button type="button" onClick={() => removeNewPhoto(i)}
                    style={{
                      position: "absolute", top: "4px", right: "4px",
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "#ef4444", color: "white", border: "none",
                      cursor: "pointer", fontSize: "12px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,.3)"
                    }}>✕</button>
                  <div style={{
                    position: "absolute", bottom: "4px", left: "4px",
                    background: "rgba(0,0,0,.45)", color: "#fff",
                    fontSize: "10px", padding: "1px 6px", borderRadius: "10px"
                  }}>{i + 1}</div>
                </div>
              ))}
            </div>
          )}

          <label style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 16px", background: "#fff",
            border: "1.5px dashed #94a3b8", borderRadius: "8px",
            cursor: "pointer", fontSize: "13px", color: "#475569", fontWeight: 600
          }}>
            📎 Ajouter des photos
            <input type="file" multiple accept="image/*"
              onChange={handlePhotoChange} style={{ display: "none" }} />
          </label>
        </div>

        <button type="submit"
          style={{ background: "#122e4b", color: "white", padding: "10px 24px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Enregistrer
        </button>
      </form>
    </div>
  );
}