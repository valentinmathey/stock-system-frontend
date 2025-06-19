"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  proveedor: {
    id: number;
    codigoProveedor: string;
    nombreProveedor: string;
  };
  cerrar: () => void;
  alGuardar: () => void;
};

export function EliminarProveedor({ proveedor, cerrar, alGuardar }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/proveedores/${proveedor.id}`,
        { method: "DELETE" }
      );
      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Proveedor eliminado correctamente");
        alGuardar();
        cerrar();
      } else {
        const msg =
          typeof payload.message === "string"
            ? payload.message
            : "Error al eliminar proveedor";
        toast.error(msg);
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 text-black">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Eliminar proveedor</h2>
        <p className="mb-6">
          ¿Estás seguro de eliminar{" "}
          <strong>{proveedor.codigoProveedor}</strong> – "
          {proveedor.nombreProveedor}"? Esta acción es irreversible.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={cerrar}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
