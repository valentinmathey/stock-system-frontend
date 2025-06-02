"use client";

import { useState } from "react";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

export function NuevaVenta({ cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    fechaVenta: new Date().toISOString().split("T")[0],
    cliente: "",
    total: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name === "total" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
    } else {
      alert("Error al registrar venta");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8 z-50">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar venta</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="font-medium">Fecha</label>
          <input
            type="date"
            name="fechaVenta"
            value={formulario.fechaVenta}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Cliente</label>
          <input
            type="text"
            name="cliente"
            value={formulario.cliente}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Total ($)</label>
          <input
            type="number"
            name="total"
            value={formulario.total}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <div className="flex justify-end gap-4 pt-2">
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
              Guardar venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
