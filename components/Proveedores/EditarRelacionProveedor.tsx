"use client";

import { useState } from "react";

/* ---------- tipos ---------- */
export type RelacionAP = {
  id: number;
  modeloInventario: "LOTE_FIJO" | "TIEMPO_FIJO";
  costoPedido: number;
  costoCompraUnitarioArticulo: number;
  demoraEntregaProveedor: number;
  tiempoRevision?: number | null;
  articulo: { nombreArticulo: string };
};

type Props = {
  rel: RelacionAP;
  cerrar: () => void;
  alGuardar: () => void;
};

export default function EditarRelArtProv({ rel, cerrar, alGuardar }: Props) {
  /* ---------------- state ---------------- */
  const [form, setForm] = useState({
    modeloInventario: rel.modeloInventario,
    costoPedido: rel.costoPedido,
    costoCompraUnitarioArticulo: rel.costoCompraUnitarioArticulo,
    demoraEntregaProveedor: rel.demoraEntregaProveedor,
    tiempoRevision: rel.tiempoRevision ?? undefined,
  });

  const esTiempoFijo = form.modeloInventario === "TIEMPO_FIJO";

  /* ---------------- handlers ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next: any = {
        ...prev,
        [name]:
          name === "modeloInventario"
            ? value
            : value === ""
            ? undefined
            : Number(value),
      };
      /* si cambia a lote fijo -> limpiar tiempoRev */
      if (name === "modeloInventario" && value === "LOTE_FIJO") {
        next.tiempoRevision = undefined;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = { ...form };
    if (!esTiempoFijo) delete payload.tiempoRevision;

    const res = await fetch(
      `http://localhost:3000/articulos-proveedores/${rel.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`Error al guardar: ${err.message ?? "sin detalle"}`);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    /* Fondo semitransparente suave */
    <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
      {/* Tarjeta */}
      <div className="bg-white text-black w-full max-w-md rounded-lg shadow-lg px-8 py-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-center">
          Editar relación con “{rel.articulo.nombreArticulo}”
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Modelo */}
          <label className="font-medium">Modelo</label>
          <select
            name="modeloInventario"
            value={form.modeloInventario}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="LOTE_FIJO">Lote Fijo</option>
            <option value="TIEMPO_FIJO">Tiempo Fijo</option>
          </select>

          {/* Costo pedido */}
          <label className="font-medium">Costo pedido</label>
          <input
            type="number"
            name="costoPedido"
            value={form.costoPedido}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />

          {/* Costo unitario */}
          <label className="font-medium">Costo unitario</label>
          <input
            type="number"
            name="costoCompraUnitarioArticulo"
            value={form.costoCompraUnitarioArticulo}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />

          {/* Demora */}
          <label className="font-medium">Demora (días)</label>
          <input
            type="number"
            name="demoraEntregaProveedor"
            value={form.demoraEntregaProveedor}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />

          {/* Tiempo revisión – solo TIEMPO_FIJO */}
          {esTiempoFijo && (
            <>
              <label className="font-medium">Tiempo revisión</label>
              <input
                type="number"
                name="tiempoRevision"
                value={form.tiempoRevision ?? ""}
                onChange={handleChange}
                min={1}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </>
          )}

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={cerrar}
              className="text-gray-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
