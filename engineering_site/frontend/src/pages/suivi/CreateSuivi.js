import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSuivi() {
  const [projets, setProjets] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({
    id_projet: "",
    id_employe: "",
    localisation: "",
    statut: "En cours",
    commentaire: "",
  });
  const [photos, setPhotos] = useState([]); // [{ file, preview }]
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isEmployee = user?.role === "Employé";
  const isAdmin = user?.role === "Administrateur";

  useEffect(() => {
    // ✅ Role check — غير Admin و Employé يدخلو
    if (!isAdmin && !isEmployee) {
      navigate("/");
      return;
    }

    const params = new URLSearchParams({
      role: user?.role || "",
      id_employe: user?.id_employe || ""
    });

    fetch(`http://127.0.0.1:8000/api/projets?${params}`)
      .then(res => {
        if (!res.ok) throw new Error("projets non disponibles");
        return res.json();
      })
      .then(data => setProjets(Array.isArray(data) ? data : []))
      .catch(err => console.error("Projets:", err.message));

    // fetch employés seulement si Admin
    if (isAdmin) {
      fetch("http://127.0.0.1:8000/api/employes")
        .then(res => {
          if (!res.ok) throw new Error("employés non disponibles");
          return res.json();
        })
        .then(data => setEmployes(Array.isArray(data) ? data : []))
        .catch(err => console.error("Employés:", err.message));
    }

    // إلا كان Employé، نحطو id ديالو مباشرة
    if (isEmployee) {
      setForm(f => ({ ...f, id_employe: user.id_employe }));
    }
  }, []);

  // ✅ إضافة صور مع preview
  const handlePhotoChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotos(prev => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // ✅ حذف صورة
  const removePhoto = (index) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    photos.forEach(p => data.append("photos[]", p.file));

    fetch("http://127.0.0.1:8000/api/suivis", {
      method: "POST",
      body: data
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
        return res.json();
      })
      .then(() => {
        if (isAdmin) {
          navigate("/suivi");
        } else {
          navigate("/mes-suivi");
        }
      })
      .catch(err => {
        console.error("Submit:", err.message);
        alert("Erreur : " + err.message);
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Ajouter Suivi</h2>
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

        {/* ✅ Photos avec preview + suppression */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Photos
            {photos.length > 0 && (
              <span style={{
                marginLeft: "10px", fontSize: "12px", fontWeight: 400,
                background: "#eff6ff", color: "#1d4ed8",
                padding: "2px 10px", borderRadius: "20px", border: "1px solid #93c5fd"
              }}>
                {photos.length} photo{photos.length > 1 ? "s" : ""}
              </span>
            )}
          </label>

          {photos.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "10px",
              marginBottom: "12px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0"
            }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={p.preview}
                    alt={`photo ${i + 1}`}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      display: "block"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    style={{
                      position: "absolute", top: "4px", right: "4px",
                      width: "22px", height: "22px",
                      borderRadius: "50%",
                      background: "#ef4444", color: "white",
                      border: "none", cursor: "pointer",
                      fontSize: "12px", lineHeight: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,.3)"
                    }}
                    title="Supprimer cette photo"
                  >
                    ✕
                  </button>
                  <div style={{
                    position: "absolute", bottom: "4px", left: "4px",
                    background: "rgba(0,0,0,.45)", color: "#fff",
                    fontSize: "10px", padding: "1px 6px", borderRadius: "10px"
                  }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 16px",
            background: "#fff",
            border: "1.5px dashed #94a3b8",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px", color: "#475569", fontWeight: 600
          }}>
            📎 Ajouter des photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
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