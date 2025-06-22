"use client";

import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  proveedorId: number;
  cerrar: () => void;
  alGuardar: () => void;
};


export function EliminarProveedor({ proveedorId, cerrar, alGuardar }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://localhost:3000/proveedores/${proveedorId}`,
      { method: 'DELETE' }
    );

    if (!res.ok) {
      // Sólo parseamos JSON en el caso de error
      const { message } = await res.json().catch(() => ({ message: 'Error al eliminar' }));
      toast.error(message);
      return;
    }

    // Éxito: toast + refresco
    toast.success('Proveedor eliminado correctamente');
    alGuardar();    // tu callback para recargar la lista
    cerrar();       // cierra el modal
  } catch (err: any){
      console.error("Error en handleDelete:", err);
    toast.error('Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 text-black">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Eliminar proveedor</h2>
        <p className="mb-6">
          ¿Estás seguro?{ " "} Esta acción es irreversible.
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
