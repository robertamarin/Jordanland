import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

const GOVS = [
  "محافظة اربد",
  "محافظة البلقاء",
  "محافظة الزرقاء",
  "محافظة العاصمة",
  "محافظة العقبة",
  "محافظة الكرك",
  "محافظة المفرق",
  "محافظة جرش",
  "محافظة عجلون",
  "محافظة مادبا",
  "محافظة معان",
  "محافظة الطفيلة",
];

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1.5px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 13,
  color: "white",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 600,
  color: "#cbd5e1",
  marginBottom: 5,
};

export default function UploadLand({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    gov: "",
    dist: "",
    village: "",
    basinNo: "",
    basin: "",
    hood: "",
    board: "",
    plot: "",
    area: "",
    share: "",
    ppm: "",
    mapUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.gov || !form.village || !form.plot || !form.area) {
      setError("المحافظة، القرية، رقم القطعة، والمساحة مطلوبة");
      return;
    }

    setLoading(true);
    try {
      const area = parseFloat(form.area) || 0;
      const ppm = parseFloat(form.ppm) || 0;
      const price = area * ppm;

      await addDoc(collection(db, "lands"), {
        gov: form.gov,
        dist: form.dist,
        village: form.village,
        basinNo: parseInt(form.basinNo) || 0,
        basin: form.basin,
        hood: parseInt(form.hood) || 0,
        board: parseInt(form.board) || 0,
        plot: parseInt(form.plot) || 0,
        area,
        share: form.share || "1/1",
        ppm,
        price,
        mapUrl: form.mapUrl,
        pic: "",
        uid: auth.currentUser?.uid || "",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "gov",
      label: "المحافظة *",
      type: "select",
      options: GOVS,
      full: true,
    },
    { key: "dist", label: "مديرية التسجيل", placeholder: "مثال: اراضي اربد" },
    { key: "village", label: "القرية *", placeholder: "مثال: بشرى" },
    { key: "basin", label: "اسم الحوض", placeholder: "مثال: البيدر" },
    {
      key: "basinNo",
      label: "رقم الحوض",
      placeholder: "مثال: 28",
      type: "number",
    },
    {
      key: "hood",
      label: "رقم الحي",
      placeholder: "مثال: 2",
      type: "number",
    },
    {
      key: "board",
      label: "رقم اللوحة",
      placeholder: "مثال: 7",
      type: "number",
    },
    {
      key: "plot",
      label: "رقم القطعة *",
      placeholder: "مثال: 9",
      type: "number",
    },
    {
      key: "area",
      label: "المساحة (م²) *",
      placeholder: "مثال: 870.43",
      type: "number",
    },
    { key: "share", label: "الحصة", placeholder: "مثال: 1/1 أو 0.5" },
    {
      key: "ppm",
      label: "سعر المتر المربع (د.أ)",
      placeholder: "مثال: 15",
      type: "number",
    },
    {
      key: "mapUrl",
      label: "رابط خرائط جوجل",
      placeholder: "https://maps.app.goo.gl/...",
      full: true,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        style={{
          background: "linear-gradient(135deg,#1a1207,#0f172a)",
          borderRadius: 20,
          maxWidth: 600,
          width: "100%",
          maxHeight: "92vh",
          overflow: "auto",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#fbbf24",
                margin: 0,
              }}
            >
              إضافة أرض جديدة
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "#94a3b8",
                margin: "4px 0 0",
              }}
            >
              أدخل بيانات القطعة لعرضها على المنصة
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 28px 28px" }}>
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12,
                color: "#fca5a5",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 10,
                padding: "14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#86efac",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              تم إضافة الأرض بنجاح!
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 16px",
            }}
          >
            {fields.map((f) => (
              <div
                key={f.key}
                style={f.full ? { gridColumn: "1 / -1" } : undefined}
              >
                <label style={labelStyle}>{f.label}</label>
                {f.type === "select" ? (
                  <select
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      appearance: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(217,119,6,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                    }
                  >
                    <option value="" style={{ background: "#1e293b" }}>
                      — اختر —
                    </option>
                    {f.options.map((o) => (
                      <option key={o} value={o} style={{ background: "#1e293b" }}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "text" : "text"}
                    inputMode={f.type === "number" ? "decimal" : "text"}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder || ""}
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(217,119,6,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                    }
                  />
                )}
              </div>
            ))}
          </div>

          {/* Price preview */}
          {form.area && form.ppm && (
            <div
              style={{
                marginTop: 16,
                background: "rgba(217,119,6,0.1)",
                border: "1px solid rgba(217,119,6,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>
                السعر الإجمالي المتوقع
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24" }}>
                {(
                  (parseFloat(form.area) || 0) * (parseFloat(form.ppm) || 0)
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
                د.أ
              </span>
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                padding: "13px",
                color: "#94a3b8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || success}
              style={{
                flex: 2,
                background:
                  loading || success
                    ? "#92400e"
                    : "linear-gradient(135deg,#d97706,#b45309)",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading || success ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(217,119,6,0.3)",
              }}
            >
              {loading ? "جارٍ الإضافة..." : success ? "تم!" : "إضافة الأرض"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
