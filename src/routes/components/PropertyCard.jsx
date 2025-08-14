// src/routes/components/PropertyCard.jsx
import React from "react";

export default function PropertyCard({ item, onEdit, onDelete, isAdmin = false }) {
  const {
    nombre,
    descripcion,
    precio,
    habitaciones,
    banos, // asegúrate que este sea el nombre exacto en tu API
    metros_cuadrados,
    direccion,
    ciudad,
    estado,
    destacada,
    foto_principal,
  } = item || {};

  return (
    <div className="shadow p-4 bg-white border flex flex-col">
      {foto_principal ? (
        <img
          src={foto_principal} // base64 o url
          alt={nombre}
          className="w-full h-48 object-cover mb-3"
        />
      ) : (
        <div className="w-full h-48 mb-3 bg-gray-100 grid place-content-center text-gray-400">
          Sin imagen
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-lg font-semibold text-[#4E342E]"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {nombre}
        </h3>
        {destacada && (
          <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800">
            Destacada
          </span>
        )}
      </div>

      <p className="text-sm text-[#5D4037] flex-1">{descripcion}</p>

      <div className="text-sm text-gray-600 space-y-1 mt-3">
        <div>
          <strong>Precio:</strong>{" "}
          {precio?.toLocaleString?.("es-AR") ?? precio}
        </div>
        <div>
          <strong>Ambientes:</strong> {habitaciones} hab · {banos} baños · {metros_cuadrados} m²
        </div>
        <div>
          <strong>Ubicación:</strong> {direccion}, {ciudad}, {estado}
        </div>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 border border-[#4E342E] text-[#4E342E] font-bold tracking-wide hover:bg-[#F3ECE7] transition-colors duration-200"
            style={{ fontFamily: "Playfair Display, serif" }}
            onClick={() => onEdit(item)}
          >
            Editar
          </button>

          <button
            className="px-3 py-1 border border-[#B71C1C] text-[#B71C1C] font-bold tracking-wide hover:bg-[#FCE4E4] transition-colors duration-200"
            style={{ fontFamily: "Playfair Display, serif" }}
            onClick={() => onDelete(item)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
