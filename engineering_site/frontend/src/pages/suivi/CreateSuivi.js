import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";

// ✅ Compress image avant upload
const compressImage = (file, maxSizeKB = 1800) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Resize ila kbira bzaf
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress b quality variable
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob.size / 1024 > maxSizeKB && quality > 0.3) {
              quality -= 0.1;
              tryCompress();
            } else {
              const compressedFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
              resolve(compressedFile);
            }
          }, "image/jpeg", quality);
        };
        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

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
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;
  const isEmployee = user?.role === "Employé";
  const isAdmin = user?.role === "Administrateur";

  useEffect(() => {
    if (!isAdmin && !isEmployee) { navigate("/"); return; }

    const params = new URLSearchParams({
      role: user?.role || "",
      id_employe: user?.id_employe || ""
    });

    apiFetch(`projets?${params}`)
      .then(res => { if (!res.ok) throw new Error("projets non disponibles"); return res.json(); })
      .then(data => setProjets(Array.isArray(data) ? data : []))
      .catch(err => console.error("Projets:", err.message));

    if (isAdmin) {
      apiFetch("employes")
        .then(res => { if (!res.ok) throw new Error("employés non disponibles"); return res.json(); })
        .then(data => setEmployes(Array.isArray(data) ? data : []))
        .catch(err => console.error("Employés:", err.message));
    }

    if (isEmployee) {
      setForm(f => ({ ...f, id_employe: user.id_employe }));
    }
  }, []);

  // ✅ Compress avant add
  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    setCompressing(true);

    try {
      const processed = await Promise.all(
        files.map(async (file) => {
          const compressed = await compressImage(file);
          console.log(`📸 ${file.name}: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
          return {
            file: compressed,
            preview: URL.createObjectURL(compressed)
          };
        })
      );
      setPhotos(prev => [...prev, ...processed]);
    } catch (err) {
      console.error("Compression error:", err);
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    photos.forEach(p => data.append("photos[]", p.file));

    try {
      const res = await fetch("http://127.0.0.1:8000/api/suivis", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: data
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Server HTML error:", text.substring(0, 500));
        throw new Error("Erreur serveur - voir console pour détails");
      }

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          const msgs = Object.values(result.errors).flat().join("\n");
          throw new Error(msgs);
        }
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }

      navigate(isAdmin ? "/suivi" : "/mes-suivi");

    } catch (err) {
      console.error("Submit error:", err.message);
      alert("Erreur : " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Ajouter Suivi</h2>
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: "16px" }}>
          <label>Projet</label><br />
          <select style={{ width: "100%", padding: "8px" }} value={form.id_projet} onChange={e => setForm({ ...form, id_projet: e.target.value })} required>
            <option value="">-- Choisir --</option>
            {projets.map(p => <option key={p.id_projet} value={p.id_projet}>{p.nom_projet}</option>)}
          </select>
        </div>

        {isAdmin && (
          <div style={{ marginBottom: "16px" }}>
            <label>Employé</label><br />
            <select style={{ width: "100%", padding: "8px" }} value={form.id_employe} onChange={e => setForm({ ...form, id_employe: e.target.value })} required>
              <option value="">-- Choisir --</option>
              {employes.map(e => <option key={e.id_employe} value={e.id_employe}>{e.nom}</option>)}
            </select>
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label>Localisation</label><br />
          <input style={{ width: "100%", padding: "8px" }} type="text" value={form.localisation} onChange={e => setForm({ ...form, localisation: e.target.value })} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Statut</label><br />
          <select style={{ width: "100%", padding: "8px" }} value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
            <option>En cours</option>
            <option>Terminé</option>
            <option>Suspendu</option>
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Commentaire</label><br />
          <textarea style={{ width: "100%", padding: "8px" }} rows="3" value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Photos
            {photos.length > 0 && (
              <span style={{ marginLeft: "10px", fontSize: "12px", fontWeight: 400, background: "#eff6ff", color: "#1d4ed8", padding: "2px 10px", borderRadius: "20px", border: "1px solid #93c5fd" }}>
                {photos.length} photo{photos.length > 1 ? "s" : ""}
              </span>
            )}
          </label>

          {photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px", marginBottom: "12px", padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p.preview} alt={`photo ${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0", display: "block" }} />
                  <button type="button" onClick={() => removePhoto(i)} style={{ position: "absolute", top: "4px", right: "4px", width: "22px", height: "22px", borderRadius: "50%", background: "#ef4444", color: "white", border: "none", cursor: "pointer", fontSize: "12px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,.3)" }}>✕</button>
                  <div style={{ position: "absolute", bottom: "4px", left: "4px", background: "rgba(0,0,0,.45)", color: "#fff", fontSize: "10px", padding: "1px 6px", borderRadius: "10px" }}>{i + 1}</div>
                </div>
              ))}
            </div>
          )}

          <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#fff", border: "1.5px dashed #94a3b8", borderRadius: "8px", cursor: compressing ? "wait" : "pointer", fontSize: "13px", color: "#475569", fontWeight: 600, opacity: compressing ? 0.6 : 1 }}>
            {compressing ? "⏳ Compression..." : "📎 Ajouter des photos"}
            <input type="file" multiple accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} disabled={compressing} />
          </label>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>
            Photos compressées automatiquement (&lt; 2MB)
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting || compressing}
          style={{ background: (submitting || compressing) ? "#94a3b8" : "#122e4b", color: "white", padding: "10px 24px", border: "none", borderRadius: "8px", cursor: (submitting || compressing) ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}