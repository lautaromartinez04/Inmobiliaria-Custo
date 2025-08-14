// src/routes/components/PropertyForm.jsx
import React, { useEffect, useMemo, useState } from "react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:<mime>;base64,....
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helpers de fecha (UI: <input type="date"> ↔ API: timestamp unix en segundos)
function dateToUnixSeconds(dateStr) {
  if (!dateStr) return "";
  const ms = new Date(`${dateStr}T00:00:00`).getTime();
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : "";
}

function unixSecondsToDateString(unix) {
  if (unix == null || unix === "") return "";
  let s = Number(unix);
  if (!Number.isFinite(s)) return "";
  if (s > 1e12) s = Math.floor(s / 1000); // por si viniera en ms
  const d = new Date(s * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function PropertyForm({ initial = {}, onSubmit, onCancel }) {
  // Mapeo inicial con defaults
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    habitaciones: "",
    banos: "",
    metros_cuadrados: "",
    direccion: "",
    ciudad: "",
    estado: "",
    destacada: false,
    tipo: "alquiler", // "venta" / "alquiler"
    // UI date (yyyy-mm-dd). Convertimos a unix seconds al guardar:
    disponible_fecha: "",
    // Imagen principal en dataURL (base64) o URL:
    foto_principal: "",
    // Fotos adicionales (array de dataURL/URL):
    fotos: [],
    ...initial,
  });

  // Pre-cargar fecha legible si viene timestamp
  useEffect(() => {
    setForm((s) => ({
      ...s,
      disponible_fecha: s.disponible_fecha
        ? s.disponible_fecha
        : unixSecondsToDateString(initial.disponible_desde),
      fotos: Array.isArray(s.fotos) ? s.fotos : [],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // Imagen principal -> archivo normal, guardado en base64
  const onMainPhotoFile = async (e) => {
    const file = e.target.files?.[0];
    const b64 = await fileToBase64(file);
    handle("foto_principal", b64);
  };

  // Fotos adicionales
  const addExtraPhotoFile = async (e, index) => {
    const file = e.target.files?.[0];
    const b64 = await fileToBase64(file);
    const arr = [...(form.fotos || [])];
    arr[index] = b64;
    handle("fotos", arr);
  };

  const addPhotoSlot = () => handle("fotos", [...(form.fotos || []), ""]);
  const removePhoto = (idx) => {
    const arr = [...(form.fotos || [])];
    arr.splice(idx, 1);
    handle("fotos", arr);
  };

  const submit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      precio: form.precio === "" ? "" : Number(form.precio),
      habitaciones: form.habitaciones === "" ? "" : Number(form.habitaciones),
      banos: form.banos === "" ? "" : Number(form.banos),
      metros_cuadrados:
        form.metros_cuadrados === "" ? "" : Number(form.metros_cuadrados),
      // Convertimos fecha (yyyy-mm-dd) -> unix seconds
      disponible_desde: dateToUnixSeconds(form.disponible_fecha),
    };

    // No mandamos el campo UI “disponible_fecha”
    delete payload.disponible_fecha;

    onSubmit?.(payload);
  };

  // Estilos elegantes (todo bold, sin bordes redondeados, tu paleta)
  const labelCls =
    "block text-[#4E342E] text-sm font-bold mb-1";
  const inputCls =
    "w-full border px-3 py-2 font-bold text-[#4E342E] focus:outline-none focus:border-[#8D6E63]";
  const sectionTitleCls =
    "text-lg text-[#4E342E] font-bold mb-3";
  const fontStyle = { fontFamily: "Playfair Display, serif" };

  return (
    <form onSubmit={submit} className="space-y-5" style={fontStyle}>
      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nombre</label>
          <input
            className={inputCls}
            value={form.nombre}
            onChange={(e) => handle("nombre", e.target.value)}
            placeholder="Ej: Casa céntrica en alquiler"
          />
        </div>
        <div>
          <label className={labelCls}>Precio (ARS)</label>
          <input
            type="number"
            className={inputCls}
            value={form.precio}
            onChange={(e) => handle("precio", e.target.value)}
            placeholder="Ej: 120000"
          />
        </div>

        <div>
          <label className={labelCls}>Habitaciones</label>
          <input
            type="number"
            className={inputCls}
            value={form.habitaciones}
            onChange={(e) => handle("habitaciones", e.target.value)}
            placeholder="Ej: 3"
          />
        </div>
        <div>
          <label className={labelCls}>Baños</label>
          <input
            type="number"
            className={inputCls}
            value={form.banos}
            onChange={(e) => handle("banos", e.target.value)}
            placeholder="Ej: 2"
          />
        </div>

        <div>
          <label className={labelCls}>Metros cuadrados</label>
          <input
            type="number"
            className={inputCls}
            value={form.metros_cuadrados}
            onChange={(e) => handle("metros_cuadrados", e.target.value)}
            placeholder="Ej: 120"
          />
        </div>
        <div>
          <label className={labelCls}>Tipo</label>
          <select
            className={inputCls}
            value={form.tipo}
            onChange={(e) => handle("tipo", e.target.value)}
          >
            <option value="alquiler">Alquiler</option>
            <option value="venta">Venta</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Disponible desde</label>
          <input
            type="date"
            className={inputCls}
            value={form.disponible_fecha || ""}
            onChange={(e) => handle("disponible_fecha", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className={labelCls} style={{ marginBottom: 0 }}>
            Destacada
          </label>
          <input
            type="checkbox"
            checked={!!form.destacada}
            onChange={(e) => handle("destacada", e.target.checked)}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Descripción</label>
        <textarea
          className={inputCls}
          rows={3}
          value={form.descripcion}
          onChange={(e) => handle("descripcion", e.target.value)}
          placeholder="Detalles de la propiedad..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Dirección</label>
          <input
            className={inputCls}
            value={form.direccion}
            onChange={(e) => handle("direccion", e.target.value)}
            placeholder="Calle Falsa 123"
          />
        </div>
        <div>
          <label className={labelCls}>Ciudad</label>
          <input
            className={inputCls}
            value={form.ciudad}
            onChange={(e) => handle("ciudad", e.target.value)}
            placeholder="Córdoba"
          />
        </div>
        <div>
          <label className={labelCls}>Provincia/Estado</label>
          <input
            className={inputCls}
            value={form.estado}
            onChange={(e) => handle("estado", e.target.value)}
            placeholder="Córdoba"
          />
        </div>
      </div>

      {/* Foto principal */}
      <div>
        <div className={sectionTitleCls}>Foto principal</div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,180px] gap-4 items-start">
          <div>
            <label className={labelCls}>Subir imagen (archivo)</label>
            <input type="file" accept="image/*" onChange={onMainPhotoFile} />
            <div className="text-xs text-[#5D4037] font-bold mt-2">
              Se guarda automáticamente en base64. Al mostrarla se usa como imagen.
            </div>
          </div>
          <div>
            {form.foto_principal ? (
              <img
                src={form.foto_principal}
                alt="Vista previa"
                className="w-[180px] h-[120px] object-cover border"
              />
            ) : (
              <div className="w-[180px] h-[120px] grid place-content-center bg-gray-100 text-gray-500 border">
                Sin imagen
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fotos adicionales */}
      <div>
        <div className={sectionTitleCls}>Fotos adicionales</div>
        <div className="space-y-3">
          {(form.fotos || []).map((f, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr,180px,auto] gap-4 items-start"
            >
              <div>
                <label className={labelCls}>Subir imagen {idx + 1}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => addExtraPhotoFile(e, idx)}
                />
              </div>
              <div>
                {f ? (
                  <img
                    src={f}
                    alt={`Vista previa ${idx + 1}`}
                    className="w-[180px] h-[120px] object-cover border"
                  />
                ) : (
                  <div className="w-[180px] h-[120px] grid place-content-center bg-gray-100 text-gray-500 border">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="px-3 py-2 border border-[#B71C1C] text-[#B71C1C] font-bold tracking-wide hover:bg-[#FCE4E4] transition"
                  onClick={() => removePhoto(idx)}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="px-3 py-2 border border-[#4E342E] text-[#4E342E] font-bold tracking-wide hover:bg-[#F3ECE7] transition"
            onClick={addPhotoSlot}
          >
            + Agregar otra foto
          </button>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#4E342E] text-white font-bold tracking-wide hover:opacity-90 transition border border-[#4E342E]"
        >
          Guardar
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-white text-[#4E342E] font-bold tracking-wide border border-[#4E342E] hover:bg-[#F3ECE7] transition"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
