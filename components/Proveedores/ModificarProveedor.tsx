"use client";

import { useEffect, useState } from "react";

/* ---------- Tipos ---------- */
type Articulo = { id: number; nombreArticulo: string };
type Relacion = { id: number; articulo: { id: number } };

type Props = {
  proveedorId: number;
  cerrar: () => void;
  alGuardar: () => void;
};

/* --------------------------------------------------------------- */
export default function ModificarProveedor({
  proveedorId,
  cerrar,
  alGuardar,
}: Props) {
  /* ---------- State ---------- */
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [formulario, setFormulario] = useState({
    nombreProveedor: "",
    articulo: {
      articuloId: 0,
      modeloInventario: "LOTE_FIJO",
      costoPedido: 0,
      costoCompraUnitarioArticulo: 0,
      demoraEntregaProveedor: 0,
      tiempoRevision: undefined as number | undefined,
    },
  });

  /* ---------- Carga inicial ---------- */
  useEffect(() => {
    /* Relaciones de ESTE proveedor */
    const relsPromise: Promise<Relacion[]> = fetch(
      `http://localhost:3000/articulos-proveedores/por-proveedor/${proveedorId}`
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);

    /* Todos los artículos */
    const artsPromise: Promise<Articulo[]> = fetch(
      "http://localhost:3000/articulos"
    )
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);

    /* Filtramos los que ya existen en la relación */
    Promise.all([relsPromise, artsPromise])
      .then(([rels, allArts]) => {
        const usados = new Set<number>(rels.map((rel) => rel.articulo.id));
        const disponibles = allArts.filter((a) => !usados.has(a.id));

        setArticulos(disponibles);

        /* Pre-selección si no había valor */
        setFormulario((prev) => ({
          ...prev,
          articulo: {
            ...prev.articulo,
            articuloId: disponibles[0]?.id ?? 0,
          },
        }));
      })
      .catch(() => setArticulos([]));

    /* Nombre del proveedor */
    fetch(`http://localhost:3000/proveedores/${proveedorId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (prov) =>
          prov &&
          setFormulario((prev) => ({
            ...prev,
            nombreProveedor: prov.nombreProveedor,
          }))
      );
  }, [proveedorId]);

  /* ---------- Handlers ---------- */
  const numericFields = new Set([
    "articuloId",
    "costoPedido",
    "costoCompraUnitarioArticulo",
    "demoraEntregaProveedor",
    "tiempoRevision",
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name in formulario.articulo) {
      setFormulario((prev) => {
        const next = {
          ...prev.articulo,
          [name]:
            numericFields.has(name) && name !== "modeloInventario"
              ? Number(value)
              : value,
        };
        if (name === "modeloInventario" && value === "LOTE_FIJO") {
          next.tiempoRevision = undefined;
        }
        return { ...prev, articulo: next };
      });
    } else {
      setFormulario((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- Helpers ---------- */
  const esTiempoFijo = formulario.articulo.modeloInventario === "TIEMPO_FIJO";

  const buildPayload = () => {
    const { articulo } = formulario;
    return {
      proveedorId,
      articuloId: articulo.articuloId,
      modeloInventario: articulo.modeloInventario,
      costoPedido: articulo.costoPedido,
      costoCompraUnitarioArticulo: articulo.costoCompraUnitarioArticulo,
      demoraEntregaProveedor: articulo.demoraEntregaProveedor,
      ...(esTiempoFijo && { tiempoRevision: articulo.tiempoRevision }),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/articulos-proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(
        `Error al modificar proveedor: ${err.message ?? "relación duplicada"}`
      );
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Modificar proveedor
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* Nombre (solo lectura) */}
          <label className="font-medium">Nombre</label>
          <input
            type="text"
            value={formulario.nombreProveedor}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />

          {/* Artículo */}
          <label className="font-medium">Artículo</label>
          <select
            name="articuloId"
            value={formulario.articulo.articuloId}
            onChange={handleChange}
            required
            className="col-span-2 border border-gray-300 rounded px-3 py-2"
          >
            <option value={0}>Seleccionar artículo</option>
            {articulos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreArticulo}
              </option>
            ))}
          </select>

          {/* Modelo de inventario */}
          <label className="font-medium">Modelo de Inventario</label>
          <select
            name="modeloInventario"
            value={formulario.articulo.modeloInventario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="LOTE_FIJO">Lote Fijo</option>
            <option value="TIEMPO_FIJO">Tiempo Fijo</option>
          </select>

          {/* Costos y demora */}
          <label className="font-medium">Costo pedido</label>
          <input
            type="number"
            name="costoPedido"
            value={formulario.articulo.costoPedido}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Costo compra unitario</label>
          <input
            type="number"
            name="costoCompraUnitarioArticulo"
            value={formulario.articulo.costoCompraUnitarioArticulo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Demora entrega (días)</label>
          <input
            type="number"
            name="demoraEntregaProveedor"
            value={formulario.articulo.demoraEntregaProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Tiempo de revisión */}
          {esTiempoFijo && (
            <>
              <label className="font-medium">Tiempo de Revisión</label>
              <input
                type="number"
                name="tiempoRevision"
                value={formulario.articulo.tiempoRevision ?? ""}
                onChange={handleChange}
                min={1}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
