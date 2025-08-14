// src/routes/AdminLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  if (user) return <Navigate to="/admin/panel" replace />;

  const submit = (e) => {
    e.preventDefault();
    const ok = login(u, p);
    if (!ok) setErr("Usuario o contraseña inválidos");
  };

  return (
    <div className="min-h-[60vh] bg-[#F3ECE7] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1
          className="text-3xl text-[#4E342E] mb-6 font-bold text-center tracking-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Acceso de Administrador
        </h1>

        <form
          onSubmit={submit}
          className="bg-white border p-6 space-y-5"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          <div className="space-y-2">
            <label className="block text-[#4E342E] text-sm font-bold">
              Usuario
            </label>
            <input
              className="w-full border px-3 py-2 font-bold text-[#4E342E] focus:outline-none focus:border-[#8D6E63]"
              placeholder="Ingresá tu usuario"
              value={u}
              onChange={(e) => setU(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#4E342E] text-sm font-bold">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border px-3 py-2 font-bold text-[#4E342E] focus:outline-none focus:border-[#8D6E63]"
              placeholder="••••••••"
              value={p}
              onChange={(e) => setP(e.target.value)}
            />
          </div>

          {err && (
            <div className="text-red-700 text-sm font-bold">{err}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#4E342E] text-white py-3 font-bold tracking-wide hover:opacity-90 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
