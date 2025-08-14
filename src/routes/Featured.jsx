import React, { useEffect, useMemo, useState } from "react";
import Casa from "../media/images/Inicio.webp";
import { propiedadesApi } from "../services/api";

function formatPrecio(value, tipo) {
  const n = Number(value);
  if (Number.isNaN(n)) return value ?? "";
  const base = n.toLocaleString("es-AR");
  return tipo === "alquiler" ? `$${base} ARS / mes` : `$${base} ARS`;
}

function formatFecha(ts) {
  if (ts == null || ts === "") return "";
  let ms = Number(ts);
  if (!Number.isFinite(ms)) return String(ts);
  if (ms < 1e12) ms *= 1000; // segundos a ms
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const Featured = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await propiedadesApi.list();
        if (!alive) return;
        setData(Array.isArray(res) ? res : []);
      } catch (e) {
        setErr(e?.message || "Error al cargar propiedades");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const propiedades = useMemo(() => {
    return (data || [])
      .filter((x) => x?.destacada)
      .map((x) => ({
        id: x.id,
        tipo: x.tipo,
        titulo: x.nombre,
        descripcion: x.descripcion,
        imagen: x.foto_principal || Casa,
        precio: formatPrecio(x.precio, x.tipo),
        disponibleDesde: formatFecha(x.disponible_desde),
      }));
  }, [data]);

  return (
    <section className="bg-[#F3ECE7] py-10">
      <div className="mx-auto px-6">
        <h2
          className="text-3xl md:text-4xl font-semibold text-[#4E342E] text-center mb-8"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Propiedades Destacadas
        </h2>

        {loading && (
          <div className="text-center text-[#5D4037]">Cargando propiedades...</div>
        )}
        {err && (
          <div className="text-center text-red-700">{err}</div>
        )}
        {!loading && !err && propiedades.length === 0 && (
          <div className="text-center text-[#5D4037]">
            No hay propiedades destacadas por el momento.
          </div>
        )}

        {!loading && !err && propiedades.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propiedades.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs uppercase tracking-wide text-[#8D6E63] mb-2">
                    {item.tipo === "alquiler" ? "Alquiler" : "Venta"}
                  </span>
                  <h3
                    className="text-lg font-semibold text-[#4E342E] mb-1"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-[#5D4037] flex-1">{item.descripcion}</p>

                  <div className="mt-4 space-y-1">
                    <p className="text-base font-medium text-[#4E342E]">
                      {item.precio}
                    </p>
                    {item.disponibleDesde && (
                      <p className="text-xs text-[#5D4037]">
                        Disponible desde: {item.disponibleDesde}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
