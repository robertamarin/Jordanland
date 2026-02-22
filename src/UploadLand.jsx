import { useState } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

const GOVS = [
  "محافظة اربد","محافظة البلقاء","محافظة الزرقاء","محافظة العاصمة",
  "محافظة العقبة","محافظة الكرك","محافظة المفرق","محافظة جرش",
  "محافظة عجلون","محافظة مادبا","محافظة معان","محافظة الطفيلة",
];

const GOV_EN = {
  "محافظة اربد":"Irbid","محافظة البلقاء":"Balqa","محافظة الزرقاء":"Zarqa",
  "محافظة العاصمة":"Amman","محافظة العقبة":"Aqaba","محافظة الكرك":"Karak",
  "محافظة المفرق":"Mafraq","محافظة جرش":"Jerash","محافظة عجلون":"Ajloun",
  "محافظة مادبا":"Madaba","محافظة معان":"Ma'an","محافظة الطفيلة":"Tafilah",
};

const inputStyle = {
  width: "100%",
  background: "#f9fafb",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  marginBottom: 5,
};

export default function UploadLand({ onClose, onSuccess, editData }) {
  const [form, setForm] = useState({
    gov: editData?.gov || "",
    dist: editData?.dist || "",
    village: editData?.village || "",
    basinNo: editData?.basinNo ? String(editData.basinNo) : "",
    basin: editData?.basin || "",
    hood: editData?.hood ? String(editData.hood) : "",
    board: editData?.board ? String(editData.board) : "",
    plot: editData?.plot ? String(editData.plot) : "",
    area: editData?.area ? String(editData.area) : "",
    share: editData?.share || "",
    ppm: editData?.ppm ? String(editData.ppm) : "",
    mapUrl: editData?.mapUrl || "",
    description: editData?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.gov || !form.village || !form.plot || !form.area) {
      setError("Governorate, village, plot number, and area are required");
      return;
    }
    setLoading(true);
    try {
      const area = parseFloat(form.area) || 0;
      const ppm = parseFloat(form.ppm) || 0;
      const price = area * ppm;
      const landData = {
        gov: form.gov, dist: form.dist, village: form.village,
        basinNo: parseInt(form.basinNo) || 0, basin: form.basin,
        hood: parseInt(form.hood) || 0, board: parseInt(form.board) || 0,
        plot: parseInt(form.plot) || 0, area,
        share: form.share || "1/1", ppm, price,
        mapUrl: form.mapUrl, description: form.description || "",
        pic: editData?.pic || "",
      };
      if (editData) {
        const docId = editData.id.replace("fb_", "");
        await updateDoc(doc(db, "lands", docId), { ...landData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "lands"), { ...landData, uid: auth.currentUser?.uid || "", createdAt: serverTimestamp() });
      }
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "gov", label: "Governorate *", type: "select", options: GOVS, optionLabels: GOV_EN, full: true },
    { key: "dist", label: "Registration Directorate", placeholder: "e.g. Irbid Lands" },
    { key: "village", label: "Village *", placeholder: "e.g. Bushra" },
    { key: "basin", label: "Basin Name", placeholder: "e.g. Al-Baydar" },
    { key: "basinNo", label: "Basin No.", placeholder: "e.g. 28", type: "number" },
    { key: "hood", label: "District No.", placeholder: "e.g. 2", type: "number" },
    { key: "board", label: "Board No.", placeholder: "e.g. 7", type: "number" },
    { key: "plot", label: "Plot No. *", placeholder: "e.g. 9", type: "number" },
    { key: "area", label: "Area (m²) *", placeholder: "e.g. 870.43", type: "number" },
    { key: "share", label: "Share", placeholder: "e.g. 1/1 or 0.5" },
    { key: "ppm", label: "Price per m² (JOD)", placeholder: "e.g. 15", type: "number" },
    { key: "description", label: "Notes / Description", placeholder: "Add any notes about this plot...", full: true, type: "textarea" },
    { key: "mapUrl", label: "Google Maps Link", placeholder: "https://maps.app.goo.gl/...", full: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 12, maxWidth: 620, width: "100%", maxHeight: "92vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e3a5f", borderRadius: "12px 12px 0 0" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0 }}>
              {editData ? "Edit Listing" : "Add New Listing"}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "2px 0 0" }}>
              {editData ? "Update the details below" : "Enter the land details to list on the platform"}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px" }}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#059669", fontWeight: 600, textAlign: "center" }}>
              {editData ? "Updated successfully!" : "Listing added successfully!"}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            {fields.map((f) => (
              <div key={f.key} style={f.full ? { gridColumn: "1 / -1" } : undefined}>
                <label style={labelStyle}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder || ""} rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
                  >
                    <option value="">-- Select --</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>{f.optionLabels?.[o] || o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "text" : "text"}
                    inputMode={f.type === "number" ? "decimal" : "text"}
                    value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder || ""} style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Price preview */}
          {form.area && form.ppm && (
            <div style={{ marginTop: 16, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#0369a1", fontWeight: 500 }}>Estimated Total Price</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>
                {((parseFloat(form.area) || 0) * (parseFloat(form.ppm) || 0)).toLocaleString("en-US", { maximumFractionDigits: 0 })} JOD
              </span>
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 8, padding: "12px", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || success} style={{ flex: 2, background: loading || success ? "#93c5fd" : "#2563eb", border: "none", borderRadius: 8, padding: "12px", color: "white", fontSize: 14, fontWeight: 600, cursor: loading || success ? "not-allowed" : "pointer" }}>
              {loading ? "Saving..." : success ? "Done!" : editData ? "Save Changes" : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
