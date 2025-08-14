// src/routes/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { propiedadesApi } from "../services/api";
import PropertyList from "./components/PropertyList";
import PropertyForm from "./components/PropertyForm";

export default function AdminPanel() {
  const { logout } = useAuth();
  const [editing, setEditing] = useState(null); // null=create
  const [items, setItems] = useState([]);

  useEffect(() => {
    propiedadesApi.list().then(setItems).catch(console.error);
  }, []);

  const refresh = async () => {
    const data = await propiedadesApi.list();
    setItems(data || []);
  };

  const onCreate = () => setEditing({}); // form vacío
  const onEdit = (item) => setEditing(item);

  const onDelete = async (item) => {
    if (!confirm(`Eliminar "${item?.nombre}"?`)) return;
    await propiedadesApi.remove(item.id);
    await refresh();
  };

  const save = async (payload) => {
    if (editing?.id) {
      await propiedadesApi.update(editing.id, payload);
    } else {
      await propiedadesApi.create(payload);
    }
    setEditing(null);
    await refresh();
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#4E342E] font-bold tracking-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Panel de Administración
        </h1>

        <div className="flex gap-2">
          {!editing && (
            <button
              className="px-4 py-2 bg-[#4E342E] text-white font-bold tracking-wide hover:opacity-90 transition border border-[#4E342E]"
              onClick={onCreate}
            >
              + Nueva propiedad
            </button>
          )}
          <button
            className="px-4 py-2 bg-white text-[#4E342E] font-bold tracking-wide border border-[#4E342E] hover:bg-[#F3ECE7] transition"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {editing ? (
        <div className="border p-5 bg-white">
          <h2
            className="text-xl text-[#4E342E] font-bold mb-4 tracking-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {editing?.id ? "Editar propiedad" : "Nueva propiedad"}
          </h2>

          {/* Nota: PropertyForm ya lo dejaste sin bordes redondeados.
             Si tuviera "rounded", quitarlos en ese componente también. */}
          <PropertyForm
            initial={editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <>
          <div
            className="text-sm text-[#5D4037] font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Desde aquí podés habilitar la edición (botón “Editar” en cada tarjeta),
            crear o eliminar propiedades. Las imágenes se guardan como base64.
          </div>

          <PropertyList
            isAdmin
            tipo={undefined}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </>
      )}
    </div>
  );
}
