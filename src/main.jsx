import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import App from './App.jsx'
import Login from './Login.jsx'

function Root() {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  if (user === undefined) {
    return (
      <div dir="rtl" style={{
        fontFamily: "'Segoe UI','Noto Kufi Arabic',Tahoma,sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#1a1207 0%,#0f172a 50%,#1a0e04 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg,#d97706,#b45309)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 900, fontSize: 22, marginBottom: 16,
            boxShadow: '0 8px 24px rgba(217,119,6,0.3)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>JL</div>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>جارٍ التحميل...</div>
          <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
