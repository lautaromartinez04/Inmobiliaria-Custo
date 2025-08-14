// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./routes/components/NavBar";
import { Home } from "./routes/Home";
import Alquileres from "./routes/Alquileres";
import Ventas from "./routes/Ventas";
import AdminLogin from "./routes/AdminLogin";
import AdminPanel from "./routes/AdminPanel";
import ProtectedRoute from "./routes/ProtectedRoute";

export const App = () => {
  return (
    <>
      <NavBar />
      <main className="pt-[64px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alquileres" element={<Alquileres />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  );
};
