"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  proveedorId: number;
  cerrar: () => void;
  alGuardar: () => void;
};

export default function EditarProveedor({ proveedorId, cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    nombreProveedor: "",
    codigoProveedor: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/proveedores/${proveedorId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setFormulario({
            nombreProveedor: data.nombreProveedor,
            codigoProveedor: data.codigoProveedor,
          });
        } else {
          toast.error("No se pudo cargar el proveedor.");
        }
      })
      .catch(() => toast.error("Error al conectar con el servidor."));
  }, [proveedorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.nombreProveedor.trim()) {
      toast.warn("El nombre no puede estar vacío.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/proveedores/${proveedorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreProveedor: formulario.nombreProveedor }),
      });

      if (res.ok) {
        toast.success("Proveedor actualizado correctamente.");
        alGuardar();
        cerrar();
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = err.message ?? "Error desconocido.";
        toast.error(msg);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Modificar proveedor</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            value={formulario.nombreProveedor}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <label className="font-medium">Código</label>
          <input
            type="text"
            value={formulario.codigoProveedor}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />

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
