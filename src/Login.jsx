import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const map = {
        "auth/invalid-email": "البريد الإلكتروني غير صالح",
        "auth/user-not-found": "لا يوجد حساب بهذا البريد",
        "auth/wrong-password": "كلمة المرور غير صحيحة",
        "auth/email-already-in-use": "هذا البريد مسجل مسبقاً",
        "auth/weak-password": "كلمة المرور ضعيفة (6 أحرف على الأقل)",
        "auth/invalid-credential": "البريد أو كلمة المرور غير صحيحة",
        "auth/too-many-requests": "محاولات كثيرة، حاول لاحقاً",
      };
      setError(map[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Segoe UI','Noto Kufi Arabic',Tahoma,sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1a1207 0%,#0f172a 50%,#1a0e04 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          border: "1px solid rgba(217,119,6,0.1)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          border: "1px solid rgba(217,119,6,0.08)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          padding: "40px 36px",
          maxWidth: 420,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg,#d97706,#b45309)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 22,
              marginBottom: 14,
              boxShadow: "0 8px 24px rgba(217,119,6,0.3)",
            }}
          >
            JL
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fbbf24",
              marginBottom: 4,
            }}
          >
            أراضي الأردن
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Jordan Land</div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
        </h2>
        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {isSignUp
            ? "أنشئ حسابك للوصول إلى المنصة"
            : "أدخل بياناتك للوصول إلى المنصة"}
        </p>

        {/* Error */}
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

        {/* Form */}
        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
              }}
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "white",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                direction: "ltr",
                textAlign: "left",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(217,119,6,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.12)")
              }
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#cbd5e1",
                marginBottom: 6,
              }}
            >
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 13,
                color: "white",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                direction: "ltr",
                textAlign: "left",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(217,119,6,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.12)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "#92400e"
                : "linear-gradient(135deg,#d97706,#b45309)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "13px 20px",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(217,119,6,0.3)",
              transition: "all 0.2s",
            }}
          >
            {loading
              ? "جارٍ التحميل..."
              : isSignUp
              ? "إنشاء حساب"
              : "تسجيل الدخول"}
          </button>
        </form>

        {/* Toggle */}
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "#94a3b8",
          }}
        >
          {isSignUp ? "لديك حساب؟" : "ليس لديك حساب؟"}{" "}
          <span
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            style={{
              color: "#fbbf24",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {isSignUp ? "سجّل الدخول" : "أنشئ حساب"}
          </span>
        </div>
      </div>
    </div>
  );
}
