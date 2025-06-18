"use client";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  articulo: {
    id: number;
    codigoArticulo: string;
    nombreArticulo: string;
    descripcionArticulo: string;
    precioVentaUnitarioArticulo: number;
    costoAlmacenamientoPorUnidad: number;
    stockActual: number;
    stockSeguridad: number;
    demandaAnual: number;
    proveedorPredeterminado?: { id: number };
  };
  cerrar: () => void;
  alGuardar: () => void;
};

export function EditarArticulo({ articulo, cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({ ...articulo });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]:
        name === "codigoArticulo" ||
        name === "nombreArticulo" ||
        name === "descripcionArticulo"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      codigoArticulo,
      nombreArticulo,
      precioVentaUnitarioArticulo,
      costoAlmacenamientoPorUnidad,
      stockActual,
      stockSeguridad,
      demandaAnual,
    } = formulario;
    const proveedorPredeterminadoId = articulo.proveedorPredeterminado?.id;

    if (!codigoArticulo.trim() || !nombreArticulo.trim()) {
      toast.warn("Completá el código y nombre del artículo.");
      return;
    }
    if (precioVentaUnitarioArticulo <= 0) {
      toast.warn("El precio de venta debe ser mayor a 0.");
      return;
    }
    if (costoAlmacenamientoPorUnidad <= 0) {
      toast.warn("El costo de almacenamiento debe ser mayor a 0.");
      return;
    }
    if (stockActual < 0 || stockSeguridad < 0 || demandaAnual < 0) {
      toast.warn("Los valores de stock no pueden ser negativos.");
      return;
    }

    if (demandaAnual < 2) {
      toast.warn(
        "La demanda anual debe ser al menos 2 para calcular el lote óptimo."
      );
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/articulos/${articulo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formulario,
            proveedorPredeterminadoId,
          }),
        }
      );

      if (res.ok) {
        toast.success("Artículo actualizado correctamente");
        alGuardar();
        cerrar();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error("Error al actualizar: " + (err.message || "desconocido"));
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 text-black">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Editar artículo</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          {/* Inputs texto */}
          <div>
            <label className="font-medium">Código</label>
            <input
              name="codigoArticulo"
              value={formulario.codigoArticulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Nombre</label>
            <input
              name="nombreArticulo"
              value={formulario.nombreArticulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="font-medium">Descripción</label>
            <input
              name="descripcionArticulo"
              value={formulario.descripcionArticulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Inputs numéricos */}
          <div>
            <label className="font-medium">Precio Venta ($)</label>
            <input
              type="number"
              min={0}
              name="precioVentaUnitarioArticulo"
              value={formulario.precioVentaUnitarioArticulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Costo almacenamiento ($)</label>
            <input
              type="number"
              min={0}
              name="costoAlmacenamientoPorUnidad"
              value={formulario.costoAlmacenamientoPorUnidad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Stock Actual</label>
            <input
              type="number"
              min={0}
              name="stockActual"
              value={formulario.stockActual}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Stock Seguridad</label>
            <input
              type="number"
              min={0}
              name="stockSeguridad"
              value={formulario.stockSeguridad}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-medium">Demanda anual</label>
            <input
              type="number"
              min={0}
              name="demandaAnual"
              value={formulario.demandaAnual}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

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
