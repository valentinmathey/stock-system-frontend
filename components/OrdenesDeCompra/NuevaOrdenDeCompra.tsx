"use client";

import { useState } from "react";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

export function NuevaOrdenCompra({ cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    fechaOrden: "",
    proveedorId: 1,
    total: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name === "fechaOrden" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al registrar la orden");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 z-50">
        <h2 className="text-2xl font-bold mb-4 text-center">Nueva orden de compra</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <label className="font-medium">Fecha</label>
          <input
            type="date"
            name="fechaOrden"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">ID proveedor</label>
          <input
            type="number"
            name="proveedorId"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Total ($)</label>
          <input
            type="number"
            name="total"
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
              Guardar orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
