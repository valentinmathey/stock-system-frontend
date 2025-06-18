"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/* --------- Tipos --------- */
type Articulo = { id: number; nombreArticulo: string };

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

/* ================================================================= */
export function NuevoProveedor({ cerrar, alGuardar }: Props) {
  /* ---------- State ---------- */
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  const [form, setForm] = useState({
    codigoProveedor: "",
    nombreProveedor: "",
    articulo: {
      proveedorId: 0,
      articuloId: 0,
      modeloInventario: "LOTE_FIJO",
      costoPedido: 0,
      costoCompraUnitarioArticulo: 0,
      demoraEntregaProveedor: 0,
      tiempoRevision: undefined as number | undefined,
    },
  });

  /* ---------- Carga de artículos ---------- */
  useEffect(() => {
    fetch("http://localhost:3000/articulos")
      .then((r) => r.json())
      .then(setArticulos)
      .catch(() => setArticulos([]));
  }, []);

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

    if (name in form.articulo) {
      setForm((prev) => {
        const next: any = {
          ...prev.articulo,
          [name]:
            numeric.includes(name) && name !== "modeloInventario"
              ? Number(value)
              : value,
        };

        /* Si cambia a LOTE_FIJO limpiamos tiempoRevision */
        if (name === "modeloInventario" && value === "LOTE_FIJO") {
          next.tiempoRevision = undefined;
        }

        return { ...prev, articulo: next };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ---------- Helpers ---------- */
  const buildPayload = () => {
    const { articulo, ...proveedor } = form;

    const payload: any = {
      ...proveedor,
      articulo: {
        proveedorId: articulo.proveedorId, // 0, se setea en backend
        articuloId: articulo.articuloId,
        modeloInventario: articulo.modeloInventario,
        costoPedido: articulo.costoPedido,
        costoCompraUnitarioArticulo: articulo.costoCompraUnitarioArticulo,
        demoraEntregaProveedor: articulo.demoraEntregaProveedor,
      },
    };

    if (articulo.modeloInventario === "TIEMPO_FIJO") {
      payload.articulo.tiempoRevision = articulo.tiempoRevision;
    }
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.codigoProveedor.trim() || !form.nombreProveedor.trim()) {
      toast.warn("Completá el código y nombre del proveedor.");
      return;
    }

    if (form.articulo.articuloId === 0) {
      toast.warn("Seleccioná un artículo.");
      return;
    }

    if (form.articulo.costoPedido <= 0) {
      toast.warn("El costo de pedido debe ser mayor a 0.");
      return;
    }
    if (form.articulo.costoCompraUnitarioArticulo <= 0) {
      toast.warn("El costo unitario debe ser mayor a 0.");
      return;
    }
    if (form.articulo.demoraEntregaProveedor <= 0) {
      toast.warn("La demora de entrega debe ser mayor a 0.");
      return;
    }

    if (
      form.articulo.modeloInventario === "TIEMPO_FIJO" &&
      (!form.articulo.tiempoRevision || form.articulo.tiempoRevision <= 0)
    ) {
      toast.warn("El tiempo de revisión debe ser mayor a 0.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (res.ok) {
        toast.success("Proveedor creado correctamente");
        alGuardar();
        cerrar();
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.message ?? "Error desconocido";

        if (msg.includes("proveedor con código")) {
          toast.error("Ya existe un proveedor con ese código.");
        } else if (msg.includes("artículo") && msg.includes("no existe")) {
          toast.error("El artículo seleccionado no existe.");
        } else if (msg.includes("modeloInventario")) {
          toast.error("Faltan datos para el modelo de inventario.");
        } else {
          toast.error(`${msg}`);
        }
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    }
  };

  /* ---------- UI helpers ---------- */
  const esTiempoFijo = form.articulo.modeloInventario === "TIEMPO_FIJO";

  /* ---------------------------- UI ---------------------------- */
  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo proveedor</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* Código y Nombre */}
          <label className="font-medium">Código</label>
          <input
            type="text"
            name="codigoProveedor"
            value={form.codigoProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            value={form.nombreProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Artículo */}
          <label className="font-medium">Artículo</label>
          <select
            name="articuloId"
            value={form.articulo.articuloId}
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

          {/* Modelo */}
          <label className="font-medium">Modelo de Inventario</label>
          <select
            name="modeloInventario"
            value={form.articulo.modeloInventario}
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
            min={0}
            name="costoPedido"
            value={form.articulo.costoPedido}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Costo compra unitario</label>
          <input
            type="number"
            min={0}
            name="costoCompraUnitarioArticulo"
            value={form.articulo.costoCompraUnitarioArticulo}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Demora entrega (días)</label>
          <input
            type="number"
            min={0}
            name="demoraEntregaProveedor"
            value={form.articulo.demoraEntregaProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Tiempo de revisión solo si es TIEMPO_FIJO */}
          {esTiempoFijo && (
            <>
              <label className="font-medium">Tiempo de Revisión</label>
              <input
                type="number"
                name="tiempoRevision"
                value={form.articulo.tiempoRevision ?? ""}
                onChange={handleChange}
                required
                min={0}
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
              Guardar proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
