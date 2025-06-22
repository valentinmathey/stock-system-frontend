"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Proveedor = { id: number; nombreProveedor: string };

type Articulo = {
  id: number;
  nombreArticulo: string;
  proveedorPredeterminado?: Proveedor;
};

type Props = {
  articulo: Articulo;
  cerrar: () => void;
  alGuardar: () => void;
};

export default function ModificarArticulo({
  articulo,
  cerrar,
  alGuardar,
}: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedorId, setProveedorId] = useState<number | undefined>(
    articulo.proveedorPredeterminado?.id
  );

  /* cargar proveedores válidos */
  useEffect(() => {
    fetch(
      `http://localhost:3000/articulos-proveedores/proveedores-por-articulo/${articulo.id}`
    )
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setProveedores(data) : []))
      .catch(() => setProveedores([]));
  }, [articulo.id]);

  /* guardar */
  const handleGuardar = async () => {
    if (!proveedorId || proveedorId === 0) {
      toast.warn("Seleccioná un proveedor válido antes de guardar.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/articulos/${articulo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proveedorPredeterminadoId: proveedorId }),
        }
      );

      if (res.ok) {
        toast.success("Proveedor actualizado correctamente");
        alGuardar();
        cerrar();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(`Error al guardar: ${err.message ?? "sin detalle"}`);
      }
    } catch {
      toast.error("Error al guardar (sin conexión con backend)");
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center
                 bg-black/60 text-black"
    >
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          Modificar proveedor de “{articulo.nombreArticulo}”
        </h2>

        <label className="block mb-2 font-medium">
          Proveedor predeterminado
        </label>
        <select
          value={proveedorId}
          onChange={(e) => setProveedorId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        >
          <option value={0}>Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombreProveedor}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <button onClick={cerrar} className="text-gray-600 hover:underline">
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
