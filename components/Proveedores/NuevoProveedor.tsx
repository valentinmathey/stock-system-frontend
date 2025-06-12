"use client";

import { useState } from "react";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

export function NuevoProveedor({ cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    codigoProveedor: "",
    nombreProveedor: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al crear proveedor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo proveedor</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <label className="font-medium">Código</label>
          <input
            type="text"
            name="codigoProveedor"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

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
              Guardar proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
