// src/routes/components/PropertyList.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import { propiedadesApi } from "../../services/api";

export default function PropertyList({ tipo, isAdmin = false, onEdit, onDelete }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros (checklists y sliders)
  const [selectedHabitaciones, setSelectedHabitaciones] = useState([]); // [1,2,3]
  const [selectedBanos, setSelectedBanos] = useState([]);                // [1,2]
  const [selectedCiudades, setSelectedCiudades] = useState([]);          // ["Córdoba", ...]
  const [selectedEstados, setSelectedEstados] = useState([]);            // ["Córdoba", ...]
  const [onlyDestacadas, setOnlyDestacadas] = useState(false);

  // Precio (rango doble)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);

  // Aux: valores únicos
  const { uniqHabitaciones, uniqBanos, uniqCiudades, uniqEstados } = useMemo(() => {
    const habs = new Set();
    const ban = new Set();
    const cities = new Set();
    const states = new Set();
    (items || []).forEach((x) => {
      if (x?.habitaciones != null) habs.add(Number(x.habitaciones));
      if (x?.banos != null) ban.add(Number(x.banos));
      if (x?.ciudad) cities.add(String(x.ciudad));
      if (x?.estado) states.add(String(x.estado));
    });
    return {
      uniqHabitaciones: Array.from(habs).sort((a, b) => a - b),
      uniqBanos: Array.from(ban).sort((a, b) => a - b),
      uniqCiudades: Array.from(cities).sort((a, b) => a.localeCompare(b)),
      uniqEstados: Array.from(states).sort((a, b) => a.localeCompare(b)),
    };
  }, [items]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await propiedadesApi.list();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Inicializar rango de precios cuando cambia la data
  useEffect(() => {
    const precios = (items || []).map((x) => Number(x.precio)).filter((n) => Number.isFinite(n));
    const min = precios.length ? Math.min(...precios) : 0;
    const max = precios.length ? Math.max(...precios) : 0;
    setPriceMin(min);
    setPriceMax(max);
    setPriceFrom(min);
    setPriceTo(max);
  }, [items]);

  // Handlers de checklists
  const toggleFromArray = (arr, setArr, value) => {
    const exists = arr.includes(value);
    if (exists) setArr(arr.filter((v) => v !== value));
    else setArr([...arr, value]);
  };

  // Dual slider handlers
  const handlePriceFrom = (v) => {
    const val = Number(v);
    setPriceFrom(val <= priceTo ? val : priceTo);
  };
  const handlePriceTo = (v) => {
    const val = Number(v);
    setPriceTo(val >= priceFrom ? val : priceFrom);
  };

  // Aplicar filtros
  const filtered = useMemo(() => {
    return (items || [])
      .filter((x) => (tipo ? x.tipo === tipo : true))
      .filter((x) => {
        if (onlyDestacadas && !x.destacada) return false;

        // Habitaciones
        if (selectedHabitaciones.length) {
          if (!selectedHabitaciones.includes(Number(x.habitaciones))) return false;
        }

        // Baños
        if (selectedBanos.length) {
          if (!selectedBanos.includes(Number(x.banos))) return false;
        }

        // Ciudad
        if (selectedCiudades.length) {
          if (!selectedCiudades.includes(String(x.ciudad))) return false;
        }

        // Estado/Provincia
        if (selectedEstados.length) {
          if (!selectedEstados.includes(String(x.estado))) return false;
        }

        // Precio
        const p = Number(x.precio);
        if (Number.isFinite(priceFrom) && p < priceFrom) return false;
        if (Number.isFinite(priceTo) && p > priceTo) return false;

        return true;
      })
      .sort((a, b) => Number(b.destacada) - Number(a.destacada));
  }, [
    items, tipo,
    selectedHabitaciones, selectedBanos,
    selectedCiudades, selectedEstados,
    priceFrom, priceTo, onlyDestacadas
  ]);

  const resetFilters = () => {
    setSelectedHabitaciones([]);
    setSelectedBanos([]);
    setSelectedCiudades([]);
    setSelectedEstados([]);
    setOnlyDestacadas(false);
    setPriceFrom(priceMin);
    setPriceTo(priceMax);
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar de filtros (izquierda) */}
      <aside className="w-64 shrink-0">
        <div className="border p-4">
          <h3
            className="text-lg font-semibold text-[#4E342E] mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Filtrar
          </h3>

          {/* Solo destacadas */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDestacadas}
                onChange={(e) => setOnlyDestacadas(e.target.checked)}
              />
              <span>Solo destacadas</span>
            </label>
          </div>

          {/* Precio - doble manija */}
          <div className="mb-5">
            <div
              className="text-sm font-medium text-[#4E342E] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Precio (ARS)
            </div>

            <div className="text-xs text-[#5D4037] mb-2">
              {priceMin === priceMax
                ? `\$${priceMin.toLocaleString("es-AR")}`
                : `\$${priceFrom.toLocaleString("es-AR")} — \$${priceTo.toLocaleString("es-AR")}`}
            </div>

            {/* Contenedor para dos sliders superpuestos */}
            <div className="relative h-6">
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={priceFrom}
                onChange={(e) => handlePriceFrom(e.target.value)}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={priceTo}
                onChange={(e) => handlePriceTo(e.target.value)}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
              />
            </div>

            {/* Nota: si querés ver los sliders como líneas más elegantes,
                podés darle estilos con CSS a input[type=range] en tu index.css */}
          </div>

          {/* Habitaciones (checklist) */}
          <div className="mb-5">
            <div
              className="text-sm font-medium text-[#4E342E] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Habitaciones
            </div>
            <div className="space-y-2">
              {uniqHabitaciones.map((h) => (
                <label key={h} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedHabitaciones.includes(h)}
                    onChange={() => toggleFromArray(selectedHabitaciones, setSelectedHabitaciones, h)}
                  />
                  <span>{h}</span>
                </label>
              ))}
              {!uniqHabitaciones.length && <div className="text-sm text-gray-500">Sin datos</div>}
            </div>
          </div>

          {/* Baños (checklist) */}
          <div className="mb-5">
            <div
              className="text-sm font-medium text-[#4E342E] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Baños
            </div>
            <div className="space-y-2">
              {uniqBanos.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBanos.includes(b)}
                    onChange={() => toggleFromArray(selectedBanos, setSelectedBanos, b)}
                  />
                  <span>{b}</span>
                </label>
              ))}
              {!uniqBanos.length && <div className="text-sm text-gray-500">Sin datos</div>}
            </div>
          </div>

          {/* Ciudad (checklist) */}
          <div className="mb-5">
            <div
              className="text-sm font-medium text-[#4E342E] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Ciudad
            </div>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {uniqCiudades.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCiudades.includes(c)}
                    onChange={() => toggleFromArray(selectedCiudades, setSelectedCiudades, c)}
                  />
                    <span>{c}</span>
                </label>
              ))}
              {!uniqCiudades.length && <div className="text-sm text-gray-500">Sin datos</div>}
            </div>
          </div>

          {/* Estado / Provincia (checklist) */}
          <div className="mb-6">
            <div
              className="text-sm font-medium text-[#4E342E] mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Provincia
            </div>
            <div className="space-y-2 max-h-40 overflow-auto pr-1">
              {uniqEstados.map((e) => (
                <label key={e} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEstados.includes(e)}
                    onChange={() => toggleFromArray(selectedEstados, setSelectedEstados, e)}
                  />
                  <span>{e}</span>
                </label>
              ))}
              {!uniqEstados.length && <div className="text-sm text-gray-500">Sin datos</div>}
            </div>
          </div>

          <button onClick={resetFilters} className="w-full px-3 py-2 bg-gray-200">
            Limpiar filtros
          </button>
        </div>
      </aside>

      {/* Lista de propiedades (derecha) */}
      <section className="flex-1">
        {loading ? (
          <div className="text-center text-[#5D4037]">Cargando propiedades...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((it) => (
              <PropertyCard
                key={it.id}
                item={it}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {!filtered.length && (
              <div className="col-span-full text-center text-[#5D4037]">
                No se encontraron propiedades con esos filtros.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
