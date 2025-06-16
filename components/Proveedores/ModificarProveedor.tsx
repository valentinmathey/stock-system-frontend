"use client";

import { useEffect, useState } from "react";

/* --------- Tipos --------- */
type Articulo = {
  id: number;
  nombreArticulo: string;
};

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

  const [articulos, setArticulos] = useState<Articulo[]>([]);

  /* ---------- Carga inicial ---------- */
  useEffect(() => {
    // proveedor
    fetch(`http://localhost:3000/proveedores/${proveedorId}`)
      .then((res) => res.json())
      .then((data) =>
        setFormulario((prev) => ({
          ...prev,
          nombreProveedor: data.nombreProveedor,
          articulo: {
            ...prev.articulo,
            articuloId: data.articulos?.[0]?.id ?? 0,
          },
        }))
      );

    // artículos
    fetch("http://localhost:3000/articulos")
      .then((res) => res.json())
      .then(setArticulos)
      .catch(() => setArticulos([]));
  }, [proveedorId]);

  /* ---------- Handlers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numeric = [
      "articuloId",
      "costoPedido",
      "costoCompraUnitarioArticulo",
      "demoraEntregaProveedor",
      "tiempoRevision",
    ];

    if (name in formulario.articulo) {
      setFormulario((prev) => {
        const newArticulo: any = {
          ...prev.articulo,
          [name]:
            numeric.includes(name) && name !== "modeloInventario"
              ? Number(value)
              : value,
        };

        // Si el usuario cambia a LOTE_FIJO, limpiamos tiempoRevision
        if (name === "modeloInventario" && value === "LOTE_FIJO") {
          newArticulo.tiempoRevision = undefined;
        }

        return { ...prev, articulo: newArticulo };
      });
    } else {
      setFormulario((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- Helpers ---------- */
  const buildPayload = () => {
    const { articulo } = formulario;

    const payload: any = {
      articuloId: articulo.articuloId,
      proveedorId, // viene por props
      modeloInventario: articulo.modeloInventario,
      costoPedido: articulo.costoPedido,
      costoCompraUnitarioArticulo: articulo.costoCompraUnitarioArticulo,
      demoraEntregaProveedor: articulo.demoraEntregaProveedor,
    };

    if (articulo.modeloInventario === "TIEMPO_FIJO") {
      payload.tiempoRevision = articulo.tiempoRevision;
    }
    return payload;
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
      alert(`Error al modificar proveedor: ${err.message ?? "sin detalle"}`);
    }
  };

  const esTiempoFijo = formulario.articulo.modeloInventario === "TIEMPO_FIJO";

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Modificar proveedor
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* Nombre */}
          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            value={formulario.nombreProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
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
            required
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
            required
            onChange={handleChange}
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

          {/* Tiempo de revisión (solo TIEMPO_FIJO) */}
          {esTiempoFijo && (
            <>
              <label className="font-medium">Tiempo de Revisión</label>
              <input
                type="number"
                name="tiempoRevision"
                value={formulario.articulo.tiempoRevision ?? ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                min={1}
              />
            </>
          )}

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={cerrar}
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
