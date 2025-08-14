// src/routes/Alquileres.jsx
import React from "react";
import PropertyList from "./components/PropertyList";

export default function Alquileres() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Propiedades en Alquiler</h1>
      <PropertyList tipo="alquiler" />
    </div>
  );
}
