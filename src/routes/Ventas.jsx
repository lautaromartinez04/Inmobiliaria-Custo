// src/routes/Ventas.jsx
import React from "react";
import PropertyList from "./components/PropertyList";

export default function Ventas() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Propiedades en Venta</h1>
      <PropertyList tipo="venta" />
    </div>
  );
}
